'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { animate } from 'animejs';

export default function Navbar() {
  const emojiRef = useRef(null);

  const handleLogoHover = () => {
    if (!emojiRef.current) return;
    animate(emojiRef.current, {
      rotate: [
        { to: -18, duration: 80 },
        { to: 18, duration: 130 },
        { to: -12, duration: 100 },
        { to: 8, duration: 90 },
        { to: 0, duration: 110 }
      ],
      scale: [
        { to: 1.25, duration: 200 },
        { to: 1, duration: 310 }
      ],
      ease: 'outQuad'
    });
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link
          href="/"
          className="logo"
          aria-label="Raccoon.phim trang chủ"
          onMouseEnter={handleLogoHover}
        >
          <span className="logo-emoji" ref={emojiRef} aria-hidden="true" style={{ display: 'inline-block' }}>
            🦝
          </span>
          <span>Raccoon.phim</span>
        </Link>

        <ul className="nav-links">
          <li><Link href="/">Trang Chủ</Link></li>
          <li><Link href="/?has_episodes=true">Xem Ngay</Link></li>
          <li><Link href="/?type=single">Phim Lẻ</Link></li>
          <li><Link href="/?type=series">Phim Bộ</Link></li>
          <li><Link href="/?is_hot=true">Hot</Link></li>
        </ul>

        <form action="/search" method="GET" className="navbar-search" role="search">
          <input
            type="search"
            name="q"
            placeholder="Tìm phim, anime..."
            aria-label="Tìm kiếm phim"
            autoComplete="off"
          />
          <button type="submit" aria-label="Tìm kiếm">🔍</button>
        </form>
      </div>
    </nav>
  );
}
