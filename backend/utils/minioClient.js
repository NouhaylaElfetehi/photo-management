const Minio = require('minio');
require('dotenv').config();

// Configuration du client MinIO
const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || 'play.min.io',
  port: parseInt(process.env.MINIO_PORT) || 9000,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
});

const bucketName = process.env.MINIO_BUCKET;
(async () => {
    try {
        const exists = await minioClient.bucketExists(bucketName);
        if (!exists) {
            await minioClient.makeBucket(bucketName, 'us-east-1');
            console.log(`✅ Bucket "${bucketName}" créé`);
        } else {
            console.log(`✅ Bucket "${bucketName}" existe déjà`);
        }
    } catch (error) {
        console.error('❌ Erreur MinIO :', error);
    }
})();

// Vérifier la connexion
minioClient.bucketExists('photomanagement', (err, exists) => {
  if (err) {
    console.error('❌ Erreur MinIO:', err);
  } else if (exists) {
    console.log('✅ Bucket "photomanagement" existe déjà');
  } else {
    minioClient.makeBucket('photomanagement', 'us-east-1', (err) => {
      if (err) return console.error('❌ Impossible de créer le bucket:', err);
      console.log('✅ Bucket "photomanagement" créé avec succès');
    });
  }
});

module.exports = minioClient;
