require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');

async function seed() {
  await connectDB();

  const dataPath = path.join(__dirname, '..', '..', 'data', 'movies.json');
  if (!fs.existsSync(dataPath)) {
    console.error(`[Seed] Không tìm thấy file dữ liệu: ${dataPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(dataPath, 'utf-8');
  const movies = JSON.parse(raw);

  console.log(`[Seed] Đọc được ${movies.length} phim từ data/movies.json`);

  await Movie.deleteMany({});
  console.log('[Seed] Đã xoá toàn bộ phim cũ trong DB');

  const inserted = await Movie.insertMany(movies);
  console.log(`[Seed] Đã thêm ${inserted.length} phim vào MongoDB`);

  await mongoose.connection.close();
  console.log('[Seed] Hoàn tất, đóng kết nối DB');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed] Lỗi:', err);
  process.exit(1);
});
