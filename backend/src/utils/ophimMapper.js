const OPHIM_BASE = process.env.OPHIM_BASE || 'https://ophim1.com';

function normalizeType(t) {
  if (t === 'series' || t === 'hoathinh') return 'series';
  return 'single';
}

function mapDetailToDoc(detail) {
  const m = detail.movie || {};
  const episodes = detail.episodes || [];
  return {
    slug: m.slug,
    name: m.name,
    origin_name: m.origin_name || '',
    year: m.year || null,
    type: normalizeType(m.type),
    quality: m.quality || 'HD',
    lang: m.lang || 'Vietsub',
    time: m.time || '',
    episode_current: m.episode_current || '',
    episode_total: m.episode_total || '',
    poster_url: m.poster_url || '',
    thumb_url: m.thumb_url || '',
    content: (m.content || '').replace(/<[^>]+>/g, '').trim(),
    category: Array.isArray(m.category) ? m.category.map((c) => c.name).filter(Boolean) : [],
    country: Array.isArray(m.country) ? m.country.map((c) => c.name).filter(Boolean) : [],
    actor: Array.isArray(m.actor) ? m.actor.filter(Boolean) : [],
    director: Array.isArray(m.director) ? m.director.filter(Boolean) : [],
    view: m.view || 0,
    is_hot: (m.view || 0) > 500000,
    episodes: episodes.map((srv) => ({
      server_name: srv.server_name || 'Server',
      server_data: (srv.server_data || []).map((ep) => ({
        name: ep.name,
        slug: ep.slug,
        filename: ep.filename || '',
        link_embed: ep.link_embed || '',
        link_m3u8: ep.link_m3u8 || ''
      }))
    }))
  };
}

async function fetchDetailFromOphim(slug) {
  const url = `${OPHIM_BASE}/phim/${slug}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 testWeb' }
  });
  if (!res.ok) {
    const err = new Error(`OPhim HTTP ${res.status}`);
    err.statusCode = res.status;
    throw err;
  }
  return res.json();
}

module.exports = { OPHIM_BASE, normalizeType, mapDetailToDoc, fetchDetailFromOphim };
