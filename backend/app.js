const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const albumRoutes = require('./routes/albumRoutes');
const statsRoutes = require('./routes/statsRoutes');
const trashRoutes = require('./routes/trashRoutes');
const shareRoutes = require("./routes/shareRoutes");
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload');
app.use(express.json({ limit: '50mb' })); // ✅ Permet d'accepter de gros fichiers (images)
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // ✅ Pour encodage URL (optionnel)

app.use(fileUpload()); 

// ✅ Middleware global
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

console.log('✅ Chargement des routes...');

// ✅ Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/trash', trashRoutes);
app.use("/api/share",shareRoutes);

app.get('/', (req, res) => {
  res.send('API Backend Fonctionnelle');
});

module.exports = app;
