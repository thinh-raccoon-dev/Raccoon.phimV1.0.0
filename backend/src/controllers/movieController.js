const Movie = require('../models/Movie');
const { fetchDetailFromOphim, mapDetailToDoc } = require('../utils/ophimMapper');

async function listMovies(req, res) {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 12, 50);
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.country) filter.country = req.query.country;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.year) filter.year = parseInt(req.query.year, 10);
    if (req.query.is_hot === 'true') filter.is_hot = true;
    if (req.query.has_episodes === 'true') {
      filter['episodes.0.server_data.0.link_embed'] = { $exists: true, $ne: '' };
    }
    if (req.query.q) {
      filter.$or = [
        { name: { $regex: req.query.q, $options: 'i' } },
        { origin_name: { $regex: req.query.q, $options: 'i' } }
      ];
    }

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;

    const [items, total] = await Promise.all([
      Movie.find(filter).sort({ [sortField]: sortOrder }).skip(skip).limit(limit).lean(),
      Movie.countDocuments(filter)
    ]);

    res.json({
      status: 'success',
      data: {
        items,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  } catch (err) {
    console.error('[listMovies] Lỗi:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

async function getMovieBySlug(req, res) {
  const { slug } = req.params;
  try {
    let movie = await Movie.findOne({ slug }).lean();
    let source = 'db';

    if (!movie) {
      try {
        const detail = await fetchDetailFromOphim(slug);
        if (!detail || !detail.movie) {
          return res.status(404).json({ status: 'error', message: 'Không tìm thấy phim trên OPhim' });
        }
        const doc = mapDetailToDoc(detail);
        if (!doc.slug || !doc.name) {
          return res.status(404).json({ status: 'error', message: 'Dữ liệu phim không hợp lệ' });
        }
        movie = await Movie.findOneAndUpdate({ slug: doc.slug }, doc, {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }).lean();
        source = 'ophim-autosync';
        console.log(`[getMovieBySlug] Auto-synced: ${doc.name} (${doc.slug})`);
      } catch (fetchErr) {
        if (fetchErr.statusCode === 404) {
          return res.status(404).json({ status: 'error', message: 'Phim không tồn tại' });
        }
        console.error(`[getMovieBySlug] Lỗi auto-sync ${slug}:`, fetchErr.message);
        return res.status(502).json({ status: 'error', message: `Không lấy được phim từ OPhim: ${fetchErr.message}` });
      }
    }

    res.json({ status: 'success', data: movie, source });
  } catch (err) {
    console.error('[getMovieBySlug] Lỗi:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { listMovies, getMovieBySlug };
