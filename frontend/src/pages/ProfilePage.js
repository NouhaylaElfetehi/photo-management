import React, { useState, useEffect } from 'react';
import axios from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../components/index.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: null,
    password: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      console.warn('Aucun token trouvé, redirection vers /login...');
      navigate('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
        setUpdatedUser({ ...response.data, avatar: response.data.avatar });
      } catch (error) {
        console.error('Erreur lors de la récupération du profil:', error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        console.log("📸 Avatar en base64 prêt à être envoyé :", base64String.substring(0, 50) + "..."); // Vérification rapide
        setUpdatedUser((prevState) => ({
          ...prevState,
          avatar: base64String, // Convertir l'image en base64
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    console.log("📤 Données envoyées au backend :", updatedUser);
  
    try {
      const response = await axios.put('/auth/update', updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log("✅ Réponse du serveur :", response.data);
      
      setIsEditing(false);
      setUser(response.data.user);
      setUpdatedUser(response.data.user);
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour du profil :', error);
    }
  };
  
  

  return (
    <div className="profile-container">
       {user ? (
        <div className="profile-card">
          <div className="avatar-container">
          <img
            src={user.avatar ? user.avatar : "default-avatar.png"}
            onError={(e) => { 
              console.error("❌ Erreur de chargement de l'avatar :", user.avatar);
              e.target.src = "default-avatar.png"; 
            }}
            alt="User Avatar"
            className="avatar"
          />











          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-form">
              <input
                type="text"
                name="name"
                value={updatedUser.name}
                onChange={handleInputChange}
                placeholder="Nom"
                required
              />
              <input
                type="email"
                name="email"
                value={updatedUser.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
              />
              <input
                type="tel"
                name="phone"
                value={updatedUser.phone}
                onChange={handleInputChange}
                placeholder="Numéro de téléphone"
              />
              <input
                type="password"
                name="password"
                value={updatedUser.password}
                onChange={handleInputChange}
                placeholder="Mot de passe"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button type="submit" className="update-btn">Mettre à jour</button>
            </form>
          ) : (
            <div className="profile-info">
              <p><strong>Nom :</strong> {user.name}</p>
              <p><strong>Email :</strong> {user.email}</p>
              <p><strong>Téléphone :</strong> {user.phone || 'Non renseigné'}</p>
              <button 
                className="edit-btn" 
                onClick={() => setIsEditing(true)}
              >
                Modifier
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
};

export default ProfilePage;
