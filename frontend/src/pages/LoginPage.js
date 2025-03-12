import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/api';
import OAuth from '../components/Auth/OAuth';
import "../components/index.css"

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', { email, password });
      console.log("📡 Réponse API :", response.data);
      localStorage.setItem('token', response.data.accessToken);
      localStorage.setItem('refreshToken', response.data.refreshToken);
      console.log("✅ Token stocké :", response.data.accessToken);
      await new Promise(resolve => setTimeout(resolve, 500)); // Assure le stockage avant reload
    window.location.reload();
      navigate('/dashboard');
    } catch (error) {
      console.error('❌ Erreur lors de la connexion :', error);
    }
  };
  
  console.log("🔑 Token stocké :", localStorage.getItem('token'));
  console.log("🔄 Refresh Token stocké :", localStorage.getItem('refreshToken'));
  
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Connexion</h2>

        {/* Formulaire de connexion */}
        <form onSubmit={handleSubmit}>
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

          <button type="submit" className="btn-login">Se connecter</button>
        </form>

        {/* Connexion via OAuth */}
        <div className="oauth-section">
          <p>Ou connectez-vous avec :</p>
          <OAuth />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
