import React, { useState, useEffect } from "react";
import axios from "../../utils/api";
import { motion } from "framer-motion";

const Gallery = () => {
  const [photos, setPhotos] = useState([]);
  const [shareLinks, setShareLinks] = useState({});

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get("/photos");
        setPhotos(response.data.photos);
      } catch (error) {
        console.error("Erreur lors de la récupération des photos :", error);
      }
    };

    fetchPhotos();
  }, []);

  const handleShare = async (photoId) => {
    try {
      const response = await axios.post(`/share/photo/${photoId}`);
      setShareLinks({ ...shareLinks, [photoId]: response.data.shareLink });
    } catch (error) {
      console.error('Erreur lors du partage de la photo :', error);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">🖼️ Galerie</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <motion.div
            key={photo.id}
            whileHover={{ scale: 1.05 }}
            className="relative overflow-hidden rounded-lg shadow-lg"
          >
            <motion.img
              src={photo.url}
              alt={photo.name}
              className="w-full h-64 object-cover transition-transform duration-300 ease-in-out"
              whileHover={{ scale: 1.1 }}
            />
            <div className="absolute bottom-0 bg-black bg-opacity-50 text-white p-2 w-full text-center">
              {photo.name}
            </div>
            <button onClick={() => handleShare(photo.id)} className="btn-share">
              🔗 Partager la photo
            </button>
            {shareLinks[photo.id] && (
              <div className="share-link">
                <p>Lien :</p>
                <input type="text" value={shareLinks[photo.id]} readOnly />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
