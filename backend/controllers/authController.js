// backend/controllers/authController.js
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const User = require('../models/userModel');

// Configuration des variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET;


// Client OAuth2 pour Google
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

// Inscription
exports.register = async (req, res) => {
  console.log("Données reçues par le backend:", req.body); // ✅ Ajoute cette ligne

  const { email, password, name } = req.body;
  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hashedPassword, name });

    res.status(201).json({ message: 'Inscription réussie', user: newUser });
  } catch (error) {
    console.error('❌ Erreur lors de l’inscription :', error); // ✅ Affiche l’erreur en détail
    res.status(500).json({ message: 'Erreur serveur', error });
  }
};


// Connexion
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    // Générer un token JWT
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // 🔥 Access Token expire après 1 heure
    );
    
    const refreshToken = jwt.sign(
      { id: user.id },
      JWT_SECRET,
      { expiresIn: '7d' } // 🔥 Refresh Token expire après 7 jours
    );
    
    await User.updateRefreshToken(user.id, refreshToken);
   

    res.status(200).json({ message: 'Connexion réussie', accessToken, refreshToken });
  } catch (error) {
    console.error('❌ Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Authentification via Google
exports.googleAuth = async (req, res) => {
  const { tokenId } = req.body;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: tokenId,
      audience: GOOGLE_CLIENT_ID,
    });

    const { email, name } = ticket.getPayload();

    let user = await User.findByEmail(email);

    if (!user) {
      // Créer un nouvel utilisateur si non existant
      user = await User.create({ email, name, password: null });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Authentification Google réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur Google Auth', error });
  }
};

// Authentification via GitHub
exports.githubAuth = async (req, res) => {
  const { code } = req.body;

  try {
    // Obtenir un token d'accès GitHub
    const githubTokenResponse = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    );

    const { access_token } = githubTokenResponse.data;

    // Récupérer les infos utilisateur depuis l'API GitHub
    const githubUserResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { email, name } = githubUserResponse.data;

    let user = await User.findByEmail(email);

    if (!user) {
      // Créer un nouvel utilisateur si non existant
      user = await User.create({ email, name, password: null });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Authentification GitHub réussie', token });
  } catch (error) {
    res.status(500).json({ message: 'Erreur GitHub Auth', error });
  }
};
exports.getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non authentifié' });
    }

    const user = await User.findById(req.user.id); // Assurez-vous que la méthode est correcte
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({ name: user.name, email: user.email, avatar: user.avatar });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération du profil:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(401).json({ message: "Token de rafraîchissement manquant" });
  }

  try {
    // Vérifier si le Refresh Token est valide
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Vérifier si l'utilisateur existe et a toujours ce refreshToken
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Token invalide" });
    }

    // Générer un nouveau Access Token
    const newAccessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(403).json({ message: "Token de rafraîchissement invalide ou expiré" });
  }
};
