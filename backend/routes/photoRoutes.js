const express = require('express');
const minioClient = require('../utils/minioClient');

const { uploadPhoto, searchPhotos, deletePhoto } = require('../controllers/photoController');
const {authMiddleware} = require('../middlewares/authMiddleware');

const router = express.Router();
console.log('photoController:', { uploadPhoto, searchPhotos, deletePhoto });
console.log('authMiddleware:', authMiddleware);

if (typeof authMiddleware !== 'function') {
    throw new Error("❌ ERREUR: authMiddleware n'est pas une fonction !");
}
router.post('/upload', authMiddleware, uploadPhoto);
router.get('/search', authMiddleware, searchPhotos);
router.delete('/:photoId', authMiddleware, deletePhoto);

module.exports = router;
