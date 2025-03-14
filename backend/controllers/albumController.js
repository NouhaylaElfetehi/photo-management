// backend/controllers/albumController.js
const Album = require('../models/albumModel');
const Photo = require('../models/photoModel');

// Créer un album
exports.createAlbum = async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user?.id; // ✅ Vérification supplémentaire

  if (!userId) {
    return res.status(401).json({ message: "Utilisateur non authentifié" });
  }

  try {
    const album = await Album.create({ userId, name, description });
    res.status(201).json({ message: "Album créé avec succès", album });
  } catch (err) {
    console.error("❌ Erreur lors de la création de l’album :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Récupérer tous les albums de l'utilisateur
exports.getAlbums = async (req, res) => {
  const { userId } = req.user;

  try {
    const albums = await Album.findAllByUser(userId);
    res.status(200).json({ albums });
  } catch (err) {
    console.error('Erreur lors de la récupération des albums :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un album
exports.deleteAlbum = async (req, res) => {
  const { albumId } = req.params;

  try {
    await Album.delete(albumId);
    res.status(200).json({ message: 'Album supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l’album :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une photo à un album
// backend/controllers/albumController.js
exports.addPhotoToAlbum = async (req, res) => {
    const { albumId } = req.params;
    const { photoId } = req.body;
  
    try {
      const album = await Album.findById(albumId);
      if (!album) {
        return res.status(404).json({ message: 'Album introuvable' });
      }
  
      await Album.addPhoto(albumId, photoId);
      res.status(200).json({ message: 'Photo ajoutée à l’album avec succès' });
    } catch (err) {
      console.error('Erreur lors de l’ajout de la photo à l’album :', err);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  

// Supprimer une photo d'un album
exports.removePhotoFromAlbum = async (req, res) => {
  const { albumId, photoId } = req.params;

  try {
    await Album.removePhoto(albumId, photoId);
    res.status(200).json({ message: 'Photo supprimée de l’album avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de la photo de l’album :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
