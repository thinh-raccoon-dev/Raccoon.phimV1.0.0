'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MovieCard({ movie }) {
  const {
    slug,
    name,
    origin_name,
    poster_url,
    thumb_url,
    quality,
    lang,
    year,
    type,
    episode_current,
    rating,
    is_hot
  } = movie;

  const imgSrc = poster_url || thumb_url;
  const isSeries = type === 'series';
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <article className="movie-card">
      <Link href={`/watch/${slug}?ep=0&server=0`} className="movie-card-link" aria-label={`Xem ${name}`}>
        <div className="poster-wrapper">
          {imgSrc && !imgFailed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={name}
              loading="lazy"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div className="poster-placeholder">
              <span className="placeholder-icon">🎬</span>
              <span className="placeholder-title">{name}</span>
              {year ? <span className="placeholder-year">{year}</span> : null}
            </div>
          )}

          <div className="play-overlay">
            <span className="play-icon">▶</span>
            <span className="play-label">Xem ngay</span>
          </div>

          {quality ? <span className="badge badge-quality">{quality}</span> : null}
          {is_hot ? (
            <span className="badge-hot">HOT</span>
          ) : lang ? (
            <span className="badge badge-lang">{lang.split('+')[0].trim()}</span>
          ) : null}

          {isSeries && episode_current ? (
            <span className="episode-tag">{episode_current}</span>
          ) : null}
        </div>
      </Link>

      <div className="movie-info">
        <h3 className="movie-name" title={name}>
          <Link href={`/watch/${slug}?ep=0&server=0`}>{name}</Link>
        </h3>
        <p className="movie-origin" title={origin_name}>
          {origin_name || '—'}
        </p>
        <div className="movie-meta">
          {year ? <span>{year}</span> : null}
          {year && rating ? <span className="dot" /> : null}
          {rating ? <span className="rating">★ {rating.toFixed(1)}</span> : null}
          <Link href={`/movie/${slug}`} className="info-link" title="Xem chi tiết phim">
            ⓘ
          </Link>
        </div>
      </div>
    </article>
  );
}
