const { v4: uuidv4 } = require('uuid');
const pool = require('../utils/dbClient');

// 🔹 Partage d'une photo avec expiration et options de téléchargement
exports.sharePhoto = async (req, res) => {
    const { photoId } = req.params;
    const { maxViews, expirationDate, downloadEnabled } = req.body; // 🔥 Nouveaux paramètres
    const shareUrl = uuidv4();

    try {
        await pool.query(
            `INSERT INTO photo_sharing_links (photo_id, url, expiration_date, max_views, download_enabled, views) 
             VALUES ($1, $2, $3, $4, $5, 0)`, // Ajout de "views" avec valeur par défaut 0
            [photoId, shareUrl, expirationDate, maxViews, downloadEnabled]
        );

        res.status(201).json({ 
            message: 'Lien de partage généré', 
            url: `/share/${shareUrl}`, 
            maxViews, 
            expirationDate, 
            downloadEnabled 
        });
    } catch (error) {
        console.error('❌ Erreur lors du partage de la photo:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// 📥 Accéder au contenu partagé avec gestion des vues et expiration
exports.getSharedContent = async (req, res) => {
    const { shareUrl } = req.params;

    try {
        const result = await pool.query(
            `SELECT * FROM photo_sharing_links 
             WHERE url = $1 AND (expiration_date IS NULL OR expiration_date > NOW())`,
            [shareUrl]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '⚠️ Lien invalide ou expiré.' });
        }

        const shareData = result.rows[0];

        // ⏳ Vérifier si le lien a atteint son nombre maximum de vues
        if (shareData.max_views !== null && shareData.views >= shareData.max_views) {
            return res.status(403).json({ message: "⚠️ Ce lien de partage a expiré (nombre de vues dépassé)." });
        }

        // 🔥 Mettre à jour le compteur de vues
        await pool.query(`UPDATE photo_sharing_links SET views = views + 1 WHERE url = $1`, [shareUrl]);

        res.json({ 
            type: 'photo', 
            data: shareData, 
            downloadEnabled: shareData.download_enabled 
        });

    } catch (error) {
        console.error('❌ Erreur lors de l’accès au contenu partagé:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// 📋 Récupérer tous les liens partagés
exports.getSharedLinks = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM photo_sharing_links");
        res.status(200).json({ links: result.rows });
    } catch (error) {
        console.error("❌ Erreur lors de la récupération des liens partagés :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};




// 🗑️ Supprimer un lien de partage
exports.deleteSharedLink = async (req, res) => {
    const { token } = req.params;

    try {
        await pool.query("DELETE FROM photo_sharing_links WHERE url = $1", [token]);
        res.status(200).json({ message: "Lien supprimé avec succès" });
    } catch (error) {
        console.error("❌ Erreur lors de la suppression du lien :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
