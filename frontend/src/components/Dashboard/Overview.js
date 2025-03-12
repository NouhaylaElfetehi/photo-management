import React, { useState, useEffect } from 'react';
import StatsChart from './StatsChart';
import axios from '../../utils/api';
import "../../components/index.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    photos: 0,
    albums: 0,
    storageUsed: 0,
    storageTotal: 10, // En Go
  });

  const [sharedLinks, setSharedLinks] = useState([]); // ✅ Ajout de l'état pour les liens partagés

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des statistiques :', error);
      }
    };

    const fetchSharedLinks = async () => {
      try {
        const token = localStorage.getItem('token'); // 🔥 Récupère le token
        if (!token) {
          console.error("❌ Aucun token trouvé, l'utilisateur n'est pas authentifié.");
          return;
        }

        const response = await axios.get('http://localhost:5000/api/share/list', {
          headers: {
            Authorization: `Bearer ${token}` // ✅ Ajoute l'authentification
          }
        });

        setSharedLinks(response.data.links);
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des liens partagés :', error);
      }
    }; // 🔥 ✅ Ajout de la fermeture correcte de la fonction fetchSharedLinks

    // Appel des fonctions dans useEffect
    fetchStats();
    fetchSharedLinks();
  }, []); // 🔥 ✅ useEffect bien défini

  // ✅ Fonction pour supprimer un lien partagé
  const handleDeleteShare = async (token) => {
    try {
      await axios.delete(`/share/${token}`);
      setSharedLinks(sharedLinks.filter(link => link.token !== token));
    } catch (error) {
      console.error('Erreur lors de la suppression du lien de partage :', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">📊 Tableau de bord</h1>

      {/* Cartes de statistiques */}
      <div className="stats-cards">
        <div className="stat-card">
          <h3>📷 Photos</h3>
          <p>{stats.photos}</p>
        </div>
        <div className="stat-card">
          <h3>📁 Albums</h3>
          <p>{stats.albums}</p>
        </div>
        <div className="stat-card">
          <h3>💾 Stockage utilisé</h3>
          <p>{stats.storageUsed} Go / {stats.storageTotal} Go</p>
        </div>
      </div>

      {/* Liens partagés */}
      <div className="shared-links-section">
        <h2>🔗 Liens Partagés</h2>
        {sharedLinks.length > 0 ? (
          <ul>
            {sharedLinks.map((link) => (
              <li key={link.token}>
                <a href={`/share/${link.token}`} target="_blank" rel="noopener noreferrer">
                  {link.url}
                </a>
                <button onClick={() => handleDeleteShare(link.token)}>❌ Supprimer</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun lien partagé.</p>
        )}
      </div>

      {/* Graphiques des statistiques */}
      <StatsChart stats={stats} />

      {/* Actions rapides */}
      <div className="dashboard-actions">
        <a href="/albums" className="btn-dashboard">📁 Gérer les albums</a>
        <a href="/photos" className="btn-dashboard">📷 Voir les photos</a>
        <a href="/trash" className="btn-dashboard">🗑️ Voir la corbeille</a>
      </div>
    </div>
  );
};

export default Dashboard;
