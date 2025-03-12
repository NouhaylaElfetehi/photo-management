const { DataTypes } = require('sequelize');
const db = require('../utils/dbClient');

const PhotoSharingLink = db.define('PhotoSharingLink', {
    url: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    photo_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    max_views: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    download_enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

module.exports = PhotoSharingLink;
