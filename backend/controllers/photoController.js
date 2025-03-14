const minioClient = require('../utils/minioClient');
const { v4: uuidv4 } = require('uuid');
const Photo = require('../models/photoModel');
const Album = require('../models/albumModel');

async function uploadPhoto(req, res) {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ message: 'Aucune photo envoyée' });
        }

        const { name, data, size } = req.files.photo; // ✅ Ajout de `size`
        const { albumId } = req.body;
        const { userId } = req.user;

        // 🔹 Vérifier l'album
        if (albumId) {
            const album = await Album.findById(albumId);
            if (!album) {
                return res.status(404).json({ message: "Album introuvable" });
            }
        }

        // ✅ Vérifier MinIO
        const bucketName = process.env.MINIO_BUCKET;
        if (!bucketName) {
            return res.status(500).json({ message: "Erreur serveur: Bucket MinIO non défini" });
        }

        // 🔹 Générer un ID unique et envoyer à MinIO
        const photoId = uuidv4();
        const fileName = `${photoId}-${name}`;
        await minioClient.putObject(bucketName, fileName, data);

        // 🔹 Enregistrer en base de données
        const photo = await Photo.create({
            id: photoId,
            userId,
            fileName,
            size,
            uploadedAt: new Date(),
        });

        if (albumId) {
            await Photo.updateAlbum(photoId, albumId);
        }

        res.status(201).json({ message: 'Photo téléversée avec succès', photo });
    } catch (err) {
        console.error('❌ Erreur lors du téléversement de la photo :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function searchPhotos(req, res) {
    try {
        const { userId } = req.user;
        const { tag, date, size } = req.query;

        const photos = await Photo.search({ userId, tag, date, size });
        res.status(200).json({ photos });
    } catch (err) {
        console.error('❌ Erreur lors de la recherche des photos :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

async function deletePhoto(req, res) {
    try {
        const { photoId } = req.params;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo introuvable' });
        }

        await minioClient.removeObject(process.env.MINIO_BUCKET, photo.fileName);
        await Photo.delete(photoId);

        res.status(200).json({ message: 'Photo supprimée avec succès' });
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de la photo :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

console.log('✅ photoController chargé');

module.exports = {
    uploadPhoto,
    searchPhotos,
    deletePhoto
};
