// backend/controllers/statsController.js
const Photo = require('../models/photoModel');
const Album = require('../models/albumModel');

exports.getStats = async (req, res) => {
  const { userId } = req.user;

  try {
    const photoCount = await Photo.countByUser(userId);
    const albumCount = await Album.countByUser(userId);
    const storageUsed = await Photo.calculateStorageByUser(userId);

    res.status(200).json({
      photos: photoCount,
      albums: albumCount,
      storageUsed: storageUsed / (1024 * 1024 * 1024), // Convertir en Go
      storageTotal: 10, // Stockage total en Go
    });
  } catch (error) {
    console.error("❌ Erreur serveur sur /api/stats :", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
