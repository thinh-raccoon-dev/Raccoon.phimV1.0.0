'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { animate, stagger, createTimeline } from 'animejs';

const QUICK_TAGS = [
  { label: '🔥 Phim Hot', href: '/?is_hot=true' },
  { label: '🎬 Phim Lẻ', href: '/?type=single' },
  { label: '📺 Phim Bộ', href: '/?type=series' },
  { label: '🎭 Demon Slayer', href: '/search?q=demon+slayer' },
  { label: '🦸 Marvel', href: '/search?q=marvel' },
  { label: '🌏 Hàn Quốc', href: '/search?q=han+quoc' }
];

export default function Hero() {
  const rootRef = useRef(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const tl = createTimeline({
      defaults: { ease: 'outExpo', duration: 700 }
    });

    tl.add('.hero-badge', { opacity: [0, 1], translateY: [-16, 0], duration: 600 })
      .add(
        '.hero h1',
        { opacity: [0, 1], translateY: [40, 0], duration: 900 },
        '-=300'
      )
      .add(
        '.hero-subtitle',
        { opacity: [0, 1], translateY: [25, 0], duration: 700 },
        '-=600'
      )
      .add(
        '.hero-search',
        { opacity: [0, 1], scale: [0.92, 1], duration: 700 },
        '-=400'
      )
      .add(
        '.hero-tag',
        {
          opacity: [0, 1],
          translateY: [12, 0],
          duration: 500,
          delay: stagger(60)
        },
        '-=350'
      );

    const orbAnim = animate('.hero-glow-orb', {
      scale: [1, 1.18, 1],
      opacity: [0.55, 0.85, 0.55],
      duration: 4500,
      loop: true,
      ease: 'inOutSine'
    });

    const orbDriftAnim = animate('.hero-glow-orb', {
      translateX: [-20, 20, -20],
      duration: 8000,
      loop: true,
      ease: 'inOutQuad'
    });

    return () => {
      orbAnim.pause();
      orbDriftAnim.pause();
      tl.pause();
    };
  }, []);

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-glow-orb" aria-hidden="true"></div>

      <div className="container hero-inner">
        <div className="hero-badge" style={{ opacity: 0 }}>
          <span className="dot-pulse" aria-hidden="true"></span>
          <span>Vừa cập nhật hôm nay · Vietsub HD miễn phí</span>
        </div>

        <h1 style={{ opacity: 0 }}>
          Kỷ Nguyên Mới Của <br />
          <span className="gradient-text">Xem Phim Online</span>
        </h1>

        <p className="hero-subtitle" style={{ opacity: 0 }}>
          Hàng nghìn bộ phim, anime, series từ khắp thế giới. Vietsub chất lượng cao, không quảng cáo, xem mượt mà trên mọi thiết bị.
        </p>

        <form action="/search" method="GET" className="hero-search" role="search" style={{ opacity: 0 }}>
          <span className="hero-search-icon" aria-hidden="true">🔍</span>
          <input
            type="search"
            name="q"
            placeholder="Tìm phim, anime, diễn viên... (vd: demon slayer)"
            aria-label="Tìm kiếm phim"
            autoComplete="off"
          />
          <button type="submit">Tìm phim</button>
        </form>

        <div className="hero-tags">
          {QUICK_TAGS.map((tag) => (
            <Link key={tag.href} href={tag.href} className="hero-tag" style={{ opacity: 0 }}>
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
