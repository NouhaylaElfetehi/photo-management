// frontend/src/components/Dashboard/CreateAlbum.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../utils/api';
import { toast } from 'react-toastify';


const CreateAlbum = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // 🔹 Récupérer le token
    console.log("Token envoyé:", token); // 🔥 Vérifier si le token est bien récupéré
  
    try {
      await axios.post('/albums/create', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } } // 🔹 Ajouter le token ici
      );
  
      toast.success('Album créé avec succès !');
      navigate('/albums');
    } catch (error) {
      console.error("Erreur création album:", error.response?.data);
      toast.error(error.response?.data?.message || 'Erreur lors de la création de l’album.');
    }
  };

  return (
    <div className="create-album">
      <h2>Créer un album</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'album"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit" className="btn">Créer</button>
      </form>
    </div>
  );
};

export default CreateAlbum;