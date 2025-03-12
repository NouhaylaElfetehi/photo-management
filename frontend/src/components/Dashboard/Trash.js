import React, { useState, useEffect } from 'react';
import axios from '../../utils/api';
import '../../components/index.css'; // Import du CSS

const Trash = () => {
  const [trashItems, setTrashItems] = useState({ photos: [], albums: [] });

  useEffect(() => {
    const fetchTrashItems = async () => {
      try {
        const response = await axios.get('/trash');
        setTrashItems(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de la corbeille :', error);
      }
    };

    fetchTrashItems();
  }, []);

  const handleRestore = async (itemId, type) => {
    try {
      await axios.post('/trash/restore', { itemId, type });
      alert('✅ Élément restauré avec succès !');
      setTrashItems((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Erreur lors de la restauration :', error);
    }
  };

  const handleDelete = async (itemId, type) => {
    if (!window.confirm("❌ Supprimer définitivement cet élément ?")) return;
    try {
      await axios.delete('/trash/delete', { data: { itemId, type } });
      alert('🗑️ Élément supprimé définitivement !');
      setTrashItems((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item.id !== itemId),
      }));
    } catch (error) {
      console.error('Erreur lors de la suppression définitive :', error);
    }
  };

  return (
    <div className="trash-container">
      <h1 className="trash-title">🗑️ Corbeille</h1>

      {/* Section Photos supprimées */}
      <div className="trash-section">
        <h2>📷 Photos supprimées</h2>
        <div className="photo-list">
          {trashItems.photos.length > 0 ? (
            trashItems.photos.map((photo) => (
              <div className="photo-card" key={photo.id}>
                <img src={photo.url} alt={photo.name} />
                <p>{photo.name}</p>
                <div className="trash-actions">
                  <button onClick={() => handleRestore(photo.id, 'photos')} className="btn-restore">♻️ Restaurer</button>
                  <button onClick={() => handleDelete(photo.id, 'photos')} className="btn-delete">❌ Supprimer</button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-trash">Aucune photo supprimée.</p>
          )}
        </div>
      </div>

      {/* Section Albums supprimés */}
      <div className="trash-section">
        <h2>📁 Albums supprimés</h2>
        <div className="album-list">
          {trashItems.albums.length > 0 ? (
            trashItems.albums.map((album) => (
              <div className="album-card" key={album.id}>
                <h3>{album.name}</h3>
                <p>{album.description}</p>
                <div className="trash-actions">
                  <button onClick={() => handleRestore(album.id, 'albums')} className="btn-restore">♻️ Restaurer</button>
                  <button onClick={() => handleDelete(album.id, 'albums')} className="btn-delete">❌ Supprimer</button>
                </div>
              </div>
            ))
          ) : (
            <p className="empty-trash">Aucun album supprimé.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Trash;
