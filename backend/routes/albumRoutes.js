const express = require('express');
const { createAlbum, getAlbums, deleteAlbum, addPhotoToAlbum, removePhotoFromAlbum } = require('../controllers/albumController');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ Corrigé

const router = express.Router();

router.post('/create', authMiddleware, createAlbum);
router.get('/', authMiddleware, getAlbums);
router.delete('/:albumId', authMiddleware, deleteAlbum);
router.post('/:albumId/add-photo', authMiddleware, addPhotoToAlbum);
router.delete('/:albumId/remove-photo/:photoId', authMiddleware, removePhotoFromAlbum);

module.exports = router;
