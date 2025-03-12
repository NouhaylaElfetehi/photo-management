const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { sharePhoto,deleteSharedLink, getSharedContent, getSharedLinks } = require("../controllers/shareController");

const router = express.Router();

// ✅ Partage de photo
router.post('/photo/:photoId', authMiddleware, sharePhoto);

// ✅ Récupération d'un lien de partage
router.get('/:shareUrl', getSharedContent);

// ✅ Liste des liens partagés
router.get('/list', authMiddleware, getSharedLinks);

// ✅ Suppression d'un lien partagé
router.delete('/:token', authMiddleware, deleteSharedLink);

module.exports = router;
