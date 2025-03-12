const express = require('express');
const { register, login, googleAuth, githubAuth, refreshToken, getMe} = require('../controllers/authController');

const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authMiddleware } = require('../middlewares/authMiddleware'); // ✅ Ajout du middleware
const jwt = require("jsonwebtoken");


router.get('/me', authMiddleware, getMe);

router.post('/register', [
    body('email').isEmail().withMessage('Email invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    register(req, res);
  });

router.post('/login', login);

// 🔹 Route OAuth Google
router.get('/google', (req, res) => {
  const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=http://localhost:5000/api/auth/google/callback&response_type=code&scope=email profile`;
  res.redirect(googleAuthURL);
});

// 🔹 Route OAuth GitHub
router.get('/github', (req, res) => {
  const githubAuthURL = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=http://localhost:5000/api/auth/github/callback&scope=user:email`;
  res.redirect(githubAuthURL);
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token requis" });
  }

  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => { // ✅ Utilise process.env.JWT_SECRET
    if (err) {
      return res.status(403).json({ message: "Refresh token invalide" });
    }

    const newAccessToken = jwt.sign(
      { id: decoded.id, email: decoded.email },
      process.env.JWT_SECRET, // ✅ Utilise process.env.JWT_SECRET
      { expiresIn: '1h' }
    );

    res.json({ accessToken: newAccessToken });
  });
});




// 🔹 Callbacks après authentification OAuth
router.get('/google/callback', googleAuth);
router.get('/github/callback', githubAuth);

module.exports = router;
