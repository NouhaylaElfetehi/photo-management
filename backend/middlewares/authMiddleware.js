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
// };
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  console.log("🔍 Headers reçus :", req.headers);



  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès non autorisé, token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Token décodé :", decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    req.user = user;
    console.log("✅ Utilisateur authentifié :", user.email);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Erreur d'authentification" });
  }
};



const checkAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé, admin requis' });
    }
    next();
};

module.exports = { authMiddleware, checkAdmin };
