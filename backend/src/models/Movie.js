const mongoose = require('mongoose');

const episodeItemSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    filename: String,
    link_embed: String,
    link_m3u8: String
  },
  { _id: false }
);

const episodeServerSchema = new mongoose.Schema(
  {
    server_name: String,
    server_data: [episodeItemSchema]
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    origin_name: { type: String, default: '' },
    year: { type: Number, index: true },
    type: { type: String, default: 'single', index: true },
    quality: { type: String, default: 'HD' },
    lang: { type: String, default: 'Vietsub' },
    time: { type: String, default: '' },
    episode_current: { type: String, default: '' },
    episode_total: { type: String, default: '' },
    poster_url: { type: String, default: '' },
    thumb_url: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: [String], default: [], index: true },
    country: { type: [String], default: [], index: true },
    actor: { type: [String], default: [] },
    director: { type: [String], default: [] },
    view: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 10 },
    is_hot: { type: Boolean, default: false, index: true },
    episodes: { type: [episodeServerSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
