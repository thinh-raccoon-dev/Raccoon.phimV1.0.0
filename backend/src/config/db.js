const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/testweb';
  try {
    await mongoose.connect(uri);
    console.log(`[DB] Đã kết nối MongoDB: ${uri}`);
  } catch (err) {
    console.error('[DB] Lỗi kết nối MongoDB:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
