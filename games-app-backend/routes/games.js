const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Configura Multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Directorio para guardar las imágenes
  },
  filename: (req, file, cb) => {
    // Extrae la extensión del archivo original y usa el mismo nombre de archivo
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    cb(null, `${basename}-${Date.now()}${ext}`); // Genera un nombre único para evitar conflictos
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limitar tamaño del archivo a 5 MB
});

// Base de datos en memoria (simulación)
let games = [
  {
    id: 1,
    name: 'Hitman 3',
    progress: 30,
    isFavorite: false,
    coverImage: 'http://localhost:5000/uploads/placeholder-img.jpg'
  },
  {
    id: 2,
    name: 'Grand Theft Auto V',
    progress: 100,
    isFavorite: true,
    coverImage: 'http://localhost:5000/uploads/placeholder-img.jpg'

  },
  {
    id: 3,
    name: 'Diablo IV',
    progress: 75,
    isFavorite: false,
    coverImage: 'http://localhost:5000/uploads/placeholder-img.jpg'

  },
  {
    id: 4,
    name: 'Star Wars Battlefront 2',
    progress: 100,
    isFavorite: true,
    coverImage: 'http://localhost:5000/uploads/placeholder-img.jpg'

  }
];

// Obtener todos los juegos
router.get('/', (req, res) => {
  res.json(games);
});

// Añadir un nuevo juego
router.post('/', (req, res) => {
  const newGame = {
    id: games.length + 1,
    ...req.body
  };
  games.push(newGame);
  res.status(201).json(newGame);
});

// Actualizar un juego por ID
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, progress, isFavorite, coverImage } = req.body;

  const gameIndex = games.findIndex(game => game.id === id);
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' });
  }

  const updatedGame = {
    ...games[gameIndex],
    name,
    progress,
    isFavorite,
    coverImage
  };

  games[gameIndex] = updatedGame;
  res.json(updatedGame);
});

// Subir imagen de portada
router.post('/:id/upload', upload.single('file'), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const file = req.file;

  const gameIndex = games.findIndex(game => game.id === id);
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' });
  }

  if (file) {
    const coverImagePath = `http://localhost:5000/uploads/${file.filename}`;
    games[gameIndex].coverImage = coverImagePath;
    res.json({ coverImagePath });
  } else {
    res.status(400).json({ message: 'No file uploaded' });
  }
});

// Actualizar el progreso de un juego por ID
router.put('/:id/progress', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { progress } = req.body;

  const gameIndex = games.findIndex(game => game.id === id);
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' });
  }

  games[gameIndex].progress = progress;
  res.json(games[gameIndex]);
});

// favorite game
router.put('/:id/favorite', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { isFavorite } = req.body;

  const gameIndex = games.findIndex(game => game.id === id);
  if (gameIndex === -1) {
    return res.status(404).json({ message: 'Game not found' });
  }

  games[gameIndex].isFavorite = isFavorite;
  res.json(games[gameIndex]);
});


module.exports = router;
