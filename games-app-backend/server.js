const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');
const gamesRouter = require('./routes/games'); // Ajusta la ruta según tu estructura

const app = express();

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173', // Permitir solo este origen (ajusta según sea necesario)
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

// Configura Multer para manejar la carga de archivos
const upload = multer({
  dest: path.join(__dirname, 'public', 'uploads'), // Directorio para almacenar las imágenes
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño del archivo a 5 MB
});

// Asegúrate de que el directorio 'uploads' exista
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configura Express para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api/games', gamesRouter);

// Configura el puerto y otros middlewares según sea necesario
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
