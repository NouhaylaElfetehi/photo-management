// frontend/src/components/Dashboard/Search.js
import React, { useState } from 'react';
import axios from '../../utils/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [photos, setPhotos] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/photos/search?query=${query}`);
      setPhotos(response.data.photos);
    } catch (error) {
      console.error('Erreur lors de la recherche :', error);
    }
  };

  return (
    <div className="search">
      <h2>Recherche avancée</h2>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Rechercher par tags, dates, taille"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="btn">Rechercher</button>
      </form>
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

export default Search;
