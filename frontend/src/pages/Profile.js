import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles.css'; // Assurez-vous que les styles sont bien appliqués

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    avatar: "https://via.placeholder.com/150"
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        console.warn("Aucun token trouvé, affichage du mode test.");
        return; // 🔹 Désactive l'API pour le test
      }

      try {
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("❌ Erreur lors de la récupération du profil :", error);
        localStorage.removeItem('token');
        // navigate('/login'); // 🔹 Commente ceci pour tester le style sans redirection
      }
    };

    // 🔹 Désactive temporairement la requête pour tester le style
    // fetchUser();
  }, [navigate]);

  return (
    <div className="profile-container">
      {user ? (
        <div className="profile-card">
          {/* Photo de profil */}
          <img 
            src={user.avatar || "https://via.placeholder.com/150"} 
            alt="Photo de profil" 
            className="profile-avatar"
          />

          {/* Infos utilisateur */}
          <h2>{user.name}</h2>
          <p className="profile-email">{user.email}</p>

          {/* Bouton de déconnexion */}
          <button 
            className="btn-logout" 
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          >
            Se déconnecter
          </button>
        </div>
      ) : (
        <p className="loading-text">Chargement du profil...</p>
      )}
    </div>
  );
};

export default ProfilePage;
