var express = require('express');
var router = express.Router();
const path = require('path');

// Configurar la carpeta "public" como una carpeta estática
router.use(express.static(path.join(__dirname, '..', 'public')));

// Ruta para servir el archivo "home.html"
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'Home.html'));
});

module.exports = router;
