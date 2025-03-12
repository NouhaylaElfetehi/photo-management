// backend/routes/trashRoutes.js
const express = require('express');
const { restoreItem, deleteItemPermanently, getTrashItems } = require('../controllers/trashController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Récupérer les éléments supprimés
router.get('/', authMiddleware.authMiddleware, getTrashItems);

// Restaurer un élément
router.post('/restore', authMiddleware.authMiddleware, restoreItem);

// Supprimer définitivement un élément
router.delete('/delete', authMiddleware.authMiddleware, deleteItemPermanently);

module.exports = router;
