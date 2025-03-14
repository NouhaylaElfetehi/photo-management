// // backend/controllers/statsController.js
// const Photo = require('../models/photoModel');
// const Album = require('../models/albumModel');

// exports.getStats = async (req, res) => {
//   console.log("📊 Requête reçue dans getStats - Utilisateur :", req.user);
//   const { userId } = req.user;
//   const pool = require("../utils/dbClient");

// pool.query("SELECT * FROM users LIMIT 1")
//   .then(result => console.log("✅ Connexion DB OK :", result.rows))
//   .catch(err => console.error("❌ Erreur connexion DB :", err));


//   try {
//     const photoCount = await Photo.countByUser(userId);
//     const albumCount = await Album.countByUser(userId);
//     const storageUsed = await Photo.calculateStorageByUser(userId);

//     res.status(200).json({
//       photos: photoCount,
//       albums: albumCount,
//       storageUsed: storageUsed / (1024 * 1024 * 1024), // Convertir en Go
//       storageTotal: 10, // Stockage total en Go
//     });
//   } catch (error) {
//     console.error("❌ Erreur serveur sur /api/stats :", error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };
const Photo = require('../models/photoModel');  // ✅ Assure-toi que cette ligne est bien présente !
const Album = require('../models/albumModel');

exports.getStats = async (req, res) => {
  const { userId } = req.user;
  try {
    console.log("🔍 Récupération des stats pour l'utilisateur :", userId);

    const photoCount = await Photo.countByUser(userId);
    console.log("📸 Nombre de photos :", photoCount);

    const albumCount = await Album.countByUser(userId);
    console.log("📁 Nombre d'albums :", albumCount);

    const storageUsed = await Photo.calculateStorageByUser(userId);
    console.log("💾 Espace utilisé :", storageUsed);

    res.status(200).json({
      photos: photoCount,
      albums: albumCount,
      storageUsed: storageUsed / (1024 * 1024 * 1024), // Convertir en Go
      storageTotal: 10, // Stockage total en Go
    });
  } catch (error) {
    console.error("❌ Erreur serveur sur `/api/stats` :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
