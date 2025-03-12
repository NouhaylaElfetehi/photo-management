const PhotoSharingLink = require('../models/photoSharingLinkModel');

const initDB = async () => {
    await PhotoSharingLink.sync();
    console.log("✅ Table `photo_sharing_links` synchronisée.");
};
