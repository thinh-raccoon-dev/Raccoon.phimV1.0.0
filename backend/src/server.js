require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const movieRoutes = require('./routes/movieRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true
  })
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({
    status: 'success',
    message: 'testWeb API đang chạy',
    endpoints: {
      listMovies: 'GET /api/movies?page=1&limit=24&type=single&has_episodes=true&is_hot=true',
      detail: 'GET /api/movies/:slug (auto-sync từ OPhim nếu chưa có trong DB)',
      search: 'GET /api/search?q=demon+slayer&page=1 (proxy đến OPhim search)'
    }
  });
});

app.use('/api/movies', movieRoutes);
app.use('/api/search', searchRoutes);

app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint không tồn tại' });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[Server] Backend chạy tại http://localhost:${PORT}`);
  });
});
