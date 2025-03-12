import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../../utils/api';

const AlbumView = () => {
  const { albumId } = useParams();
  const [photos, setPhotos] = useState([]);
  const [shareLink, setShareLink] = useState('');

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get(`/albums/${albumId}`);
        setPhotos(response.data.photos);
      } catch (error) {
        console.error('Erreur lors de la récupération des photos :', error);
      }
    };

    fetchPhotos();
  }, [albumId]);

  const handleShare = async () => {
    try {
      const response = await axios.post(`/share/album/${albumId}`);
      setShareLink(response.data.shareLink);
    } catch (error) {
      console.error('Erreur lors du partage de l’album :', error);
    }
  };

  return (
    <div className="album-view">
      <h1>Photos de l’album</h1>
      <div className="photo-actions">
        <Link to={`/albums/${albumId}/add-photo`} className="btn">Ajouter des photos</Link>
        <button onClick={handleShare} className="btn-share">🔗 Partager l'album</button>
      </div>
      {shareLink && (
        <div className="share-link">
          <p>Lien de partage :</p>
          <input type="text" value={shareLink} readOnly />
        </div>
      )}
      <div className="photo-list">
        {photos.map((photo) => (
          <div className="photo-card" key={photo.id}>
            <img src={photo.url} alt={photo.name} />
            <p>{photo.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlbumView;
