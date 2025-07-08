// --- BirdFinder Backend ---
const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for all origins (development)
app.use(cors());

// Multer setup for image uploads (memory storage, 5MB limit, JPG/PNG only)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed.'));
    }
  },
});

// Health check route
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'BirdFinder backend is running.' });
});

// POST /predict: Accepts image upload, returns mock prediction
app.post('/predict', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded.' });
  }
  // TODO: Integrate ML model or external API here
  res.json({
    species_common: 'Northern Cardinal',
    species_scientific: 'Cardinalis cardinalis',
    confidence: 0.97,
    image_url: 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Cardinalis_cardinalis_male_RWD2.jpg',
    wiki_url: 'https://en.wikipedia.org/wiki/Northern_cardinal',
  });
});

// Centralized error handler
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 