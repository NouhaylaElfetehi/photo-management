// backend/server.js
const app = require('./app');
const dotenv = require('dotenv');

 
dotenv.config();

 
const PORT = process.env.PORT || 5000;
console.log('✅ Lancement du serveur...');

require('./utils/dbClient');

app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`);
});
