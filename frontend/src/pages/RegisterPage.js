import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import { toast } from 'react-toastify';
import "../components/index.css"

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', { name, email, password });
      toast.success('Inscription réussie ! Connectez-vous maintenant.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l’inscription.');
    }
  };

  // 🔹 Redirection vers le backend pour OAuth
  const handleGoogleAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const handleGithubAuth = () => {
    window.location.href = "http://localhost:5000/api/auth/github";
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Créer un compte</h2>

        {/* Formulaire d'inscription */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder="Nom" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
            <i className="fas fa-user"></i> {/* Icône utilisateur */}
          </div>

          <div className="input-group">
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <i className="fas fa-envelope"></i> {/* Icône email */}
          </div>

          <div className="input-group">
            <input 
              type="password" 
              placeholder="Mot de passe" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <i className="fas fa-lock"></i> {/* Icône mot de passe */}
          </div>

          <button type="submit" className="btn-register">S'inscrire</button>
        </form>

        {/* 🔹 Connexion via Google & GitHub */}
        <div className="oauth-section">
          <p>Ou inscrivez-vous avec :</p>
          <button onClick={handleGoogleAuth} className="btn-google">
            <i className="fab fa-google"></i> S'inscrire avec Google
          </button>
          <button onClick={handleGithubAuth} className="btn-github">
            <i className="fab fa-github"></i> S'inscrire avec GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
