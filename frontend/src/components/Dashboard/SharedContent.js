import React, { useEffect, useState } from 'react';
import axios from '../utils/api';
import { useParams } from 'react-router-dom';

const SharedContent = () => {
    const { shareUrl } = useParams();
    const [content, setContent] = useState(null);

    useEffect(() => {
        const fetchSharedContent = async () => {
            try {
                const response = await axios.get(`/share/${shareUrl}`);
                setContent(response.data);
            } catch (error) {
                console.error('❌ Erreur lors de l’accès au contenu partagé:', error);
            }
        };

        fetchSharedContent();
    }, [shareUrl]);

    if (!content) return <p>Chargement...</p>;

    return (
        <div>
            <h1>📤 Contenu Partagé</h1>
            <img src={content.data.url} alt={content.data.name} />

            {content.downloadEnabled ? (
                <a href={content.data.url} download>⬇️ Télécharger</a>
            ) : (
                <p>🚫 Téléchargement désactivé</p>
            )}
        </div>
    );
};

export default SharedContent;
