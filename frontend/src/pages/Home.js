import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import background from "../assets/background.jpg"; // Vérifie que l'image existe !
import "../components/index.css"; // Import du fichier CSS

const Home = () => {
  return (
    <div>
      {/* HEADER */}
      <header
        className="home-header"
        style={{ backgroundImage: `url(${background})` }}
      >
        <div className="content">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            📷 Bienvenue sur <span className="text-blue-400">PhotoManager</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Gérez vos albums et photos en toute simplicité avec une interface fluide et intuitive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <Link to="/login" className="btn-primary">
              Commencer 🚀
            </Link>
          </motion.div>
        </div>
      </header>

      {/* SECTION FONCTIONNALITÉS */}
      <section className="features">
        <div className="feature-box">
          <i className="fas fa-images"></i>
          <h3>Albums illimités</h3>
          <p>Créez et organisez vos albums facilement.</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-search"></i>
          <h3>Recherche avancée</h3>
          <p>Trouvez rapidement vos photos par tags et date.</p>
        </div>
        <div className="feature-box">
          <i className="fas fa-cloud-upload-alt"></i>
          <h3>Sauvegarde Cloud</h3>
          <p>Stockez et accédez à vos photos en toute sécurité.</p>
        </div>
      </section>

    
    </div>
  );
};

export default Home;
