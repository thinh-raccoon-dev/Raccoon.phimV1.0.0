const OPHIM_BASE = process.env.OPHIM_BASE || 'https://ophim1.com';
const IMG_BASE = 'https://img.ophim.live/uploads/movies/';

function normalizePoster(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return IMG_BASE + url;
}

function normalizeType(t) {
  if (t === 'series' || t === 'hoathinh') return 'series';
  return 'single';
}

function mapItem(it) {
  return {
    slug: it.slug,
    name: it.name,
    origin_name: it.origin_name || '',
    year: it.year || null,
    type: normalizeType(it.type),
    quality: it.quality || '',
    lang: it.lang || '',
    poster_url: normalizePoster(it.poster_url),
    thumb_url: normalizePoster(it.thumb_url),
    episode_current: it.episode_current || '',
    episode_total: it.episode_total || '',
    view: 0,
    rating: 0,
    is_hot: false
  };
}

async function searchMovies(req, res) {
  try {
    const q = (req.query.q || '').trim();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit, 10) || 24, 50);

    if (!q) {
      return res.json({
        status: 'success',
        data: { items: [], pagination: { page: 1, limit, total: 0, totalPages: 0 }, source: 'empty' }
      });
    }

    const url = `${OPHIM_BASE}/v1/api/tim-kiem?keyword=${encodeURIComponent(q)}&page=${page}&limit=${limit}`;
    const resp = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 testWeb-search' }
    });

    if (!resp.ok) {
      return res.status(502).json({
        status: 'error',
        message: `OPhim API trả về ${resp.status}`
      });
    }

    const json = await resp.json();
    const data = json.data || {};
    const rawItems = data.items || [];
    const params = data.params || {};
    const pagination = params.pagination || {};

    const items = rawItems.map(mapItem);
    const total = pagination.totalItems || items.length;
    const totalPages =
      pagination.totalPages ||
      (pagination.totalItemsPerPage ? Math.ceil(total / pagination.totalItemsPerPage) : 1);

    res.json({
      status: 'success',
      data: {
        items,
        pagination: { page, limit, total, totalPages },
        source: 'ophim'
      }
    });
  } catch (err) {
    console.error('[searchMovies] Lỗi:', err);
    res.status(500).json({ status: 'error', message: err.message });
  }
}

module.exports = { searchMovies };
