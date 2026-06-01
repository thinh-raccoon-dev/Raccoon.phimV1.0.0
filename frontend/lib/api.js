const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function fetchMovies(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') query.set(k, v);
  });

  const url = `${API_URL}/movies?${query.toString()}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Lỗi tải danh sách phim: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function fetchMovieBySlug(slug) {
  const res = await fetch(`${API_URL}/movies/${slug}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Lỗi tải chi tiết phim: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}

export async function searchOphim(q, page = 1) {
  const params = new URLSearchParams({ q, page: String(page) });
  const res = await fetch(`${API_URL}/search?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Lỗi tìm kiếm: HTTP ${res.status}`);
  }
  const json = await res.json();
  return json.data;
}
