// backend/controllers/trashController.js
const Photo = require('../models/photoModel');
const Album = require('../models/albumModel');

// Récupérer les éléments supprimés
exports.getTrashItems = async (req, res) => {
  const { userId } = req.user;
  try {
    console.log("🔍 Récupération de la corbeille pour l'utilisateur :", userId);

    const photos = await Photo.findDeletedByUser(userId);
    console.log("🗑️ Photos supprimées :", photos);

    const albums = await Album.findDeletedByUser(userId);
    console.log("🗑️ Albums supprimés :", albums);

    res.status(200).json({ photos, albums });
  } catch (err) {
    console.error("❌ Erreur serveur `/api/trash` :", err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// Restaurer un élément
exports.restoreItem = async (req, res) => {
  const { itemId, type } = req.body;

  try {
    if (type === 'photo') {
      await Photo.restore(itemId);
    } else if (type === 'album') {
      await Album.restore(itemId);
    }
    res.status(200).json({ message: 'Élément restauré avec succès' });
  } catch (err) {
    console.error('Erreur lors de la restauration :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer définitivement un élément
exports.deleteItemPermanently = async (req, res) => {
  const { itemId, type } = req.body;

  try {
    if (type === 'photo') {
      await Photo.delete(itemId);
    } else if (type === 'album') {
      await Album.delete(itemId);
    }
    res.status(200).json({ message: 'Élément supprimé définitivement' });
  } catch (err) {
    console.error('Erreur lors de la suppression définitive :', err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
