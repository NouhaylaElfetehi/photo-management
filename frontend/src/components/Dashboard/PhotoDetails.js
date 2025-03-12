import React, { useState } from 'react';
import axios from '../utils/api';

const PhotoDetails = ({ photoId }) => {
    const [shareUrl, setShareUrl] = useState('');
    const [maxViews, setMaxViews] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [downloadEnabled, setDownloadEnabled] = useState(true);

    const handleShare = async () => {
        try {
            const response = await axios.post(`/share/photo/${photoId}`, {
                maxViews: maxViews || null,
                expirationDate: expirationDate || null,
                downloadEnabled
            });
            setShareUrl(response.data.url);
        } catch (error) {
            console.error('❌ Erreur lors de la génération du lien:', error);
        }
    };

    return (
        <div>
            <h3>🔗 Partager la Photo</h3>
            <label>Nombre maximum de vues :</label>
            <input type="number" value={maxViews} onChange={e => setMaxViews(e.target.value)} />

            <label>Date d’expiration :</label>
            <input type="date" value={expirationDate} onChange={e => setExpirationDate(e.target.value)} />

            <label>
                <input type="checkbox" checked={downloadEnabled} onChange={() => setDownloadEnabled(!downloadEnabled)} />
                Autoriser le téléchargement ?
            </label>

            <button onClick={handleShare}>🔗 Générer le lien</button>
            {shareUrl && <p>Lien de partage : <a href={shareUrl} target="_blank">{shareUrl}</a></p>}
        </div>
    );
};

export default PhotoDetails;
