const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const photoRoutes = require('./routes/photoRoutes');
const albumRoutes = require('./routes/albumRoutes');
const statsRoutes = require('./routes/statsRoutes');
const trashRoutes = require('./routes/trashRoutes');
const shareRoutes = require("./routes/shareRoutes");

const app = express();

// ✅ Middleware global
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('✅ Chargement des routes...');

// ✅ Définition des routes
app.use('/api/auth', authRoutes);
app.use('/api/photos', photoRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/trash', trashRoutes);
app.use("/api/share", shareRoutes);

app.get('/', (req, res) => {
  res.send('API Backend Fonctionnelle');
});

module.exports = app;
