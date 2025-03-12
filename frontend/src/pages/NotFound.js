// frontend/src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Page non trouvée</h1>
      <p>Désolé, la page que vous cherchez n'existe pas.</p>
      <Link to="/" className="btn">Retour à l'accueil</Link>
    </div>
  );
};

export default NotFound;
