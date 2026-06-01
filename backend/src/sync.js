require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Movie = require('./models/Movie');

const OPHIM_BASE = process.env.OPHIM_BASE || 'https://ophim1.com';
const DELAY_MS = 150;

const firstArg = process.argv[2];
const MODE = firstArg === 'refresh' ? 'refresh' : 'pages';
const PAGES = MODE === 'pages' ? parseInt(firstArg, 10) || 2 : 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 testWeb-sync' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} - ${url}`);
  return res.json();
}

async function fetchListPage(page) {
  const url = `${OPHIM_BASE}/danh-sach/phim-moi-cap-nhat?page=${page}`;
  const data = await fetchJson(url);
  return data.items || [];
}

async function fetchDetail(slug) {
  const url = `${OPHIM_BASE}/phim/${slug}`;
  return fetchJson(url);
}

function normalizeType(t) {
  if (t === 'series' || t === 'hoathinh') return 'series';
  return 'single';
}

function mapMovie(detail) {
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

async function upsertBySlug(slug) {
  const detail = await fetchDetail(slug);
  if (!detail || !detail.movie) return { ok: false, reason: 'no detail' };
  const doc = mapMovie(detail);
  if (!doc.slug || !doc.name) return { ok: false, reason: 'missing slug/name' };
  await Movie.findOneAndUpdate({ slug: doc.slug }, doc, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });
  const eps = doc.episodes.reduce((sum, s) => sum + s.server_data.length, 0);
  return { ok: true, name: doc.name, servers: doc.episodes.length, eps };
}

async function syncPages() {
  console.log(`[Sync] Mode: pages | Sẽ lấy ${PAGES} trang phim mới cập nhật`);
  let total = 0;
  let failed = 0;

  for (let page = 1; page <= PAGES; page++) {
    console.log(`\n[Sync] === Trang ${page}/${PAGES} ===`);
    let items;
    try {
      items = await fetchListPage(page);
    } catch (err) {
      console.error(`[Sync] Lỗi tải trang ${page}:`, err.message);
      continue;
    }
    console.log(`[Sync] Có ${items.length} phim trong trang ${page}`);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const prefix = `  [${i + 1}/${items.length}] ${item.slug}`;
      try {
        const result = await upsertBySlug(item.slug);
        if (result.ok) {
          total++;
          console.log(`${prefix} ✓ ${result.name} (${result.servers} server, ${result.eps} tập)`);
        } else {
          console.log(`${prefix} — bỏ qua (${result.reason})`);
        }
      } catch (err) {
        failed++;
        console.error(`${prefix} ✗ ${err.message}`);
      }
      await sleep(DELAY_MS);
    }
  }
  return { total, failed };
}

async function syncRefresh() {
  console.log('[Sync] Mode: refresh | Refresh link cho tất cả phim đang có trong DB');
  const slugs = await Movie.find({}, { slug: 1, _id: 0 }).lean();
  console.log(`[Sync] Có ${slugs.length} phim trong DB cần refresh`);

  let total = 0;
  let failed = 0;
  let removed = 0;

  for (let i = 0; i < slugs.length; i++) {
    const slug = slugs[i].slug;
    if (!slug) continue;
    const prefix = `  [${i + 1}/${slugs.length}] ${slug}`;
    try {
      const result = await upsertBySlug(slug);
      if (result.ok) {
        total++;
        console.log(`${prefix} ✓ ${result.name} (${result.servers} server, ${result.eps} tập)`);
      } else {
        console.log(`${prefix} — bỏ qua (${result.reason})`);
      }
    } catch (err) {
      failed++;
      const msg = err.message || '';
      if (msg.includes('HTTP 404')) {
        await Movie.deleteOne({ slug });
        removed++;
        console.log(`${prefix} ✗ 404 → đã xoá khỏi DB`);
      } else {
        console.error(`${prefix} ✗ ${msg}`);
      }
    }
    await sleep(DELAY_MS);
  }
  return { total, failed, removed };
}

async function main() {
  console.log(`[Sync] OPhim base: ${OPHIM_BASE}`);
  await connectDB();

  let stats;
  if (MODE === 'refresh') {
    stats = await syncRefresh();
    console.log(`\n[Sync] Hoàn tất: ${stats.total} phim refresh, ${stats.failed} lỗi, ${stats.removed} phim 404 đã xoá`);
  } else {
    stats = await syncPages();
    console.log(`\n[Sync] Hoàn tất: ${stats.total} phim upsert, ${stats.failed} lỗi`);
  }

  await mongoose.connection.close();
  process.exit(0);
}

main().catch((err) => {
  console.error('[Sync] Lỗi nghiêm trọng:', err);
  process.exit(1);
});
