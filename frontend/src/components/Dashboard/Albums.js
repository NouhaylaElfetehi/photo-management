import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "../../utils/api";
import { motion } from "framer-motion";

const Albums = () => {
  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get("/albums");
        setAlbums(response.data.albums);
      } catch (error) {
        console.error("Erreur lors de la récupération des albums :", error);
      }
    };

    fetchAlbums();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold text-center mb-6">📷 Albums</h1>
      <div className="text-center mb-6">
        <Link to="/albums/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
          + Créer un album
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {albums.map((album) => (
          <motion.div
            key={album.id}
            whileHover={{ scale: 1.05 }}
            className="p-6 bg-white shadow-lg rounded-lg transition-all"
          >
            <h3 className="text-xl font-semibold">{album.name}</h3>
            <p className="text-gray-600">{album.description}</p>
            <Link to={`/albums/${album.id}`} className="mt-4 inline-block text-blue-600 hover:underline">
              Voir l'album →
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Albums;
