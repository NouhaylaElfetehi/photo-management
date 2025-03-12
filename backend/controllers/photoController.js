const minioClient = require('../utils/minioClient');
const Photo = require('../models/photoModel');
const { v4: uuidv4 } = require('uuid');

// Téléverser une photo
async function uploadPhoto(req, res) {
    try {
        if (!req.files || !req.files.photo) {
            return res.status(400).json({ message: 'Aucune photo envoyée' });
        }

        const { name, data } = req.files.photo;
        const { userId } = req.user;
        const photoId = uuidv4();
        const fileName = `${photoId}-${name}`;

        await minioClient.putObject(process.env.MINIO_BUCKET, fileName, data);

        const photo = await Photo.create({
            id: photoId,
            userId,
            fileName,
            uploadedAt: new Date(),
        });

        res.status(201).json({ message: 'Photo téléversée avec succès', photo });
    } catch (err) {
        console.error('Erreur lors du téléversement de la photo :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

// Rechercher des photos
async function searchPhotos(req, res) {
    try {
        const { userId } = req.user;
        const { tag, date, size } = req.query;

        const photos = await Photo.search({ userId, tag, date, size });
        res.status(200).json({ photos });
    } catch (err) {
        console.error('Erreur lors de la recherche des photos :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

// Supprimer une photo
async function deletePhoto(req, res) {
    try {
        const { photoId } = req.params;

        const photo = await Photo.findById(photoId);
        if (!photo) {
            return res.status(404).json({ message: 'Photo introuvable' });
        }

        // Supprimer du bucket MinIO
        await minioClient.removeObject(process.env.MINIO_BUCKET, photo.fileName);

        // Supprimer de la base de données
        await Photo.delete(photoId);

        res.status(200).json({ message: 'Photo supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la photo :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
}

console.log('photoController chargé:', { uploadPhoto, searchPhotos, deletePhoto });

module.exports = {
    uploadPhoto,
    searchPhotos,
    deletePhoto
};
