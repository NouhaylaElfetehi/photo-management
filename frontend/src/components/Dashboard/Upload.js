// frontend/src/components/Dashboard/Upload.js
import React, { useState } from 'react';
import axios from '../../utils/api';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [tags, setTags] = useState('');
  const [previewImages, setPreviewImages] = useState([]); // ✅ Déclarer useState pour gérer les previews

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // ✅ Générer les aperçus des images sélectionnées
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('photos', file);
    });
    formData.append('tags', tags);

    try {
      await axios.post('/photos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Photos téléversées avec succès !');

      // ✅ Nettoyer l'état après l'upload
      setFiles([]);
      setTags('');
      setPreviewImages([]);
    } catch (error) {
      console.error('Erreur lors du téléversement :', error);
    }
  };

  return (
    <div className="upload">
      <h2>Ajouter des photos</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" multiple onChange={handleFileChange} />
        <input
          type="text"
          placeholder="Tags (séparés par des virgules)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit" className="btn">Téléverser</button>
      </form>

      {/* ✅ Afficher les aperçus des images sélectionnées */}
      <div className="preview-container">
        {previewImages.map((src, index) => (
          <img key={index} src={src} alt="Preview" className="preview-image" />
        ))}
      </div>
    </div>
  );
};

export default Upload;
