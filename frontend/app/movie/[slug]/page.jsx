import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { fetchMovieBySlug } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const movie = await fetchMovieBySlug(params.slug);
    return {
      title: `${movie.name} (${movie.year || ''})`,
      description: movie.content?.slice(0, 160) || movie.name
    };
  } catch {
    return { title: 'Phim không tồn tại' };
  }
}

export default async function MovieDetailPage({ params }) {
  let movie;
  try {
    movie = await fetchMovieBySlug(params.slug);
  } catch (err) {
    notFound();
  }

  const {
    name,
    origin_name,
    year,
    quality,
    lang,
    time,
    type,
    episode_current,
    episode_total,
    poster_url,
    thumb_url,
    content,
    category,
    country,
    actor,
    director,
    view,
    rating,
    episodes
  } = movie;

  const hasEpisodes = Array.isArray(episodes) && episodes.length > 0;
  const firstServerEps = hasEpisodes ? episodes[0].server_data || [] : [];
  const bgImage = thumb_url || poster_url;

  return (
    <>
      <Navbar />

      <div
        className="movie-hero"
        style={
          bgImage
            ? { backgroundImage: `linear-gradient(to bottom, rgba(15,15,15,0.3), rgba(15,15,15,0.95)), url(${bgImage})` }
            : undefined
        }
      >
        <div className="container movie-hero-inner">
          <div className="movie-poster-col">
            {poster_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster_url} alt={name} className="movie-poster-large" />
            ) : (
              <div className="poster-placeholder" style={{ position: 'relative', aspectRatio: '2/3' }}>
                <span className="placeholder-icon">🎬</span>
                <span className="placeholder-title">{name}</span>
              </div>
            )}
          </div>

          <div className="movie-meta-col">
            <h1 className="movie-detail-title">{name}</h1>
            {origin_name ? <p className="movie-detail-origin">{origin_name}</p> : null}

            <div className="movie-badges">
              {quality ? <span className="meta-badge badge-quality">{quality}</span> : null}
              {lang ? <span className="meta-badge">{lang}</span> : null}
              {year ? <span className="meta-badge">{year}</span> : null}
              {time ? <span className="meta-badge">{time}</span> : null}
              {episode_current ? <span className="meta-badge">{episode_current}</span> : null}
              {rating ? <span className="meta-badge rating-badge">★ {rating.toFixed(1)}</span> : null}
            </div>

            <dl className="movie-info-list">
              {category?.length ? (
                <div>
                  <dt>Thể loại:</dt>
                  <dd>{category.join(', ')}</dd>
                </div>
              ) : null}
              {country?.length ? (
                <div>
                  <dt>Quốc gia:</dt>
                  <dd>{country.join(', ')}</dd>
                </div>
              ) : null}
              {director?.length ? (
                <div>
                  <dt>Đạo diễn:</dt>
                  <dd>{director.join(', ')}</dd>
                </div>
              ) : null}
              {actor?.length ? (
                <div>
                  <dt>Diễn viên:</dt>
                  <dd>{actor.slice(0, 8).join(', ')}{actor.length > 8 ? '...' : ''}</dd>
                </div>
              ) : null}
              {type ? (
                <div>
                  <dt>Loại phim:</dt>
                  <dd>{type === 'series' ? 'Phim bộ' : 'Phim lẻ'}{episode_total ? ` (${episode_total} tập)` : ''}</dd>
                </div>
              ) : null}
              {view ? (
                <div>
                  <dt>Lượt xem:</dt>
                  <dd>{view.toLocaleString('vi-VN')}</dd>
                </div>
              ) : null}
            </dl>

            <div className="movie-actions">
              {hasEpisodes ? (
                <Link
                  href={`/watch/${params.slug}?ep=0&server=0`}
                  className="btn btn-primary"
                >
                  ▶ Xem Phim
                </Link>
              ) : (
                <button className="btn btn-disabled" disabled>
                  Chưa có tập phim
                </button>
              )}
              <Link href="/" className="btn btn-secondary">
                ← Quay lại
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container">
        {content ? (
          <section className="movie-section">
            <h2 className="section-title">
              <span className="accent-bar" />
              Nội Dung Phim
            </h2>
            <p className="movie-content">{content}</p>
          </section>
        ) : null}

        {hasEpisodes ? (
          <section className="movie-section">
            <h2 className="section-title">
              <span className="accent-bar" />
              Danh Sách Tập ({firstServerEps.length} tập)
            </h2>
            <div className="episode-grid">
              {firstServerEps.map((ep, idx) => (
                <Link
                  key={`${ep.slug}-${idx}`}
                  href={`/watch/${params.slug}?ep=${idx}&server=0`}
                  className="episode-btn"
                >
                  {ep.name}
                </Link>
              ))}
            </div>
            {episodes.length > 1 ? (
              <p className="movie-section-hint">
                * Phim có {episodes.length} server. Chọn server khác trong trang xem nếu một server bị lỗi.
              </p>
            ) : null}
          </section>
        ) : null}

        <footer className="footer">
          © {new Date().getFullYear()} <span className="footer-brand">🦝 Raccoon.phim</span>
        </footer>
      </main>
    </>
  );
}
