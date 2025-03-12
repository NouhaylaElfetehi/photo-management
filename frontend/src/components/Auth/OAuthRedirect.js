// frontend/src/components/Auth/OAuthRedirect.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../utils/api';

const OAuthRedirect = ({ provider }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      const token = new URLSearchParams(location.hash).get('access_token');
      if (token) {
        try {
          const response = await axios.post(`/auth/${provider}`, { token });
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        } catch (error) {
          console.error('Erreur lors du traitement OAuth :', error);
        }
      }
    };

    handleOAuthRedirect();
  }, [location, navigate, provider]);

  return <div>Connexion en cours...</div>;
};

export default OAuthRedirect;
