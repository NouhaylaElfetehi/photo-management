import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';

const token = localStorage.getItem('token');
console.log("🚨 Token récupéré dans localStorage :", token);

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🚀 Redirection immédiate si l'utilisateur n'est pas connecté
    if (!token) {
      console.warn("Aucun token trouvé, redirection vers /login...");
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération du profil :", error);
        localStorage.removeItem("token"); // Nettoyage du token invalide
        navigate('/login'); // Redirection en cas d'erreur
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div>
      <h2>Profil utilisateur</h2>
      {user ? (
        <div>
          <p><strong>Nom :</strong> {user.name}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}>Se déconnecter</button>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default ProfilePage;
