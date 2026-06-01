'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function WatchPlayer({ movie }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialServer = Math.max(parseInt(searchParams.get('server'), 10) || 0, 0);
  const initialEp = Math.max(parseInt(searchParams.get('ep'), 10) || 0, 0);

  const [serverIdx, setServerIdx] = useState(initialServer);
  const [epIdx, setEpIdx] = useState(initialEp);
  const [showHelper, setShowHelper] = useState(false);

  const servers = movie.episodes || [];
  const currentServer = servers[serverIdx] || servers[0];
  const epList = currentServer?.server_data || [];
  const currentEp = epList[epIdx] || epList[0];

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('ep', epIdx);
    params.set('server', serverIdx);
    router.replace(`/watch/${movie.slug}?${params.toString()}`, { scroll: false });
  }, [epIdx, serverIdx, movie.slug, router]);

  useEffect(() => {
    setShowHelper(false);
    const timer = setTimeout(() => setShowHelper(true), 8000);
    return () => clearTimeout(timer);
  }, [epIdx, serverIdx]);

  const goPrev = () => setEpIdx((i) => Math.max(i - 1, 0));
  const goNext = () => setEpIdx((i) => Math.min(i + 1, epList.length - 1));

  if (!currentEp) {
    return (
      <div className="error-box">
        <p><strong>Phim này chưa có dữ liệu xem.</strong></p>
        <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
          Có thể đây là phim cũ trong DB (seed) chưa có link. Hãy chạy lệnh sau ở backend để đồng bộ phim thật:
        </p>
        <code style={{ display: 'block', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.4)', borderRadius: 4 }}>
          cd backend && npm run sync
        </code>
        <div style={{ marginTop: '1rem' }}>
          <Link href={`/movie/${movie.slug}`} className="btn btn-secondary">← Xem chi tiết phim</Link>
          {' '}
          <Link href="/" className="btn btn-secondary">🏠 Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="watch-wrapper">
      <div className="player-box">
        <iframe
          key={currentEp.link_embed}
          src={currentEp.link_embed}
          title={`${movie.name} - ${currentEp.name}`}
          allowFullScreen
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className={`player-fallback ${showHelper ? 'highlight' : ''}`}>
        <span>{showHelper ? '⚠ Player chưa phát được?' : '⚠ Player bị trắng/đen?'}</span>
        <a
          href={currentEp.link_embed}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary btn-small ${showHelper ? 'pulse' : ''}`}
        >
          🔗 Mở video ở tab mới
        </a>
        {currentEp.link_m3u8 ? (
          <a
            href={currentEp.link_m3u8}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary btn-small"
          >
            📺 Stream m3u8
          </a>
        ) : null}
        {servers.length > 1 ? (
          <span className="fallback-hint">hoặc đổi sang server khác bên dưới ↓</span>
        ) : null}
      </div>

      <div className="player-controls">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goPrev}
          disabled={epIdx === 0}
        >
          ← Tập trước
        </button>
        <span className="now-playing">
          Đang xem: <strong>{currentEp.name}</strong> · {currentServer.server_name}
        </span>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={goNext}
          disabled={epIdx >= epList.length - 1}
        >
          Tập sau →
        </button>
      </div>

      {servers.length > 1 ? (
        <div className="server-tabs">
          <span className="server-label">Server:</span>
          {servers.map((srv, idx) => (
            <button
              key={`${srv.server_name}-${idx}`}
              type="button"
              className={`server-tab ${idx === serverIdx ? 'active' : ''}`}
              onClick={() => {
                setServerIdx(idx);
                setEpIdx(0);
              }}
            >
              {srv.server_name}
            </button>
          ))}
        </div>
      ) : null}

      <div className="episode-section">
        <h3 className="section-title">
          <span className="accent-bar" />
          Danh sách tập ({epList.length} tập)
        </h3>
        <div className="episode-grid">
          {epList.map((ep, idx) => (
            <button
              type="button"
              key={`${ep.slug}-${idx}`}
              className={`episode-btn ${idx === epIdx ? 'active' : ''}`}
              onClick={() => setEpIdx(idx)}
            >
              {ep.name}
            </button>
          ))}
        </div>
      </div>

      <p className="watch-hint">
        Nếu player không phát, hãy thử chuyển sang server khác. Một số link bị chặn iframe bởi browser.
      </p>

      <div style={{ marginTop: '1.5rem' }}>
        <Link href={`/movie/${movie.slug}`} className="btn btn-secondary">
          ← Quay lại chi tiết phim
        </Link>
      </div>
    </div>
  );
}
