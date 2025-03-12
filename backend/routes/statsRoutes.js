const express = require('express');
const { getStats } = require('../controllers/statsController'); // ✅ Utilise la bonne fonction
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware.authMiddleware, getStats); 
module.exports = router;
