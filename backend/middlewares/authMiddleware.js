// const jwt = require('jsonwebtoken');
// const User = require('../models/userModel'); // Assure-toi que le modèle utilisateur est bien importé

// const authMiddleware = async (req, res, next) => {
//     console.log("🔍 Middleware Auth - Headers :", req.headers.authorization);

//     const authHeader = req.headers.authorization;
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//         return res.status(401).json({ message: "Accès non autorisé, token manquant" });
//     }

//     const token = authHeader.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         console.log("✅ Token décodé :", decoded);

//         // Vérifier si l'utilisateur existe dans la base de données
//         const user = await User.findOne({ where: { id: decoded.id } });
//            if (!user) {
//             return res.status(404).json({ message: "Utilisateur introuvable" });
//         }

//         req.user = user; // ✅ Attache l’utilisateur récupéré à req.user
//         next();
//     } catch (error) {
//       if (error.name === "TokenExpiredError") {
//         return res.status(401).json({ message: "Token expiré, veuillez vous reconnecter" });
//       } else if (error.name === "JsonWebTokenError") {
//         return res.status(401).json({ message: "Token invalide" });
//       }
//       return res.status(401).json({ message: "Erreur d'authentification" });
//       }
// };const jwt = require("jsonwebtoken");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  console.log("🔍 Headers reçus :", req.headers);

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("❌ Accès refusé, aucun token fourni !");
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé :", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn("❌ Utilisateur introuvable !");
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    req.user = user;
    console.log("✅ Utilisateur authentifié :", req.user);
    next();
  } catch (error) {
    console.error("❌ Erreur d'authentification :", error);
    return res.status(401).json({ message: "Erreur d'authentification" });
  }
};

module.exports = { authMiddleware };
