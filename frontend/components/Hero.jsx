import Link from 'next/link';

const QUICK_TAGS = [
  { label: '🔥 Phim Hot', href: '/?is_hot=true' },
  { label: '🎬 Phim Lẻ', href: '/?type=single' },
  { label: '📺 Phim Bộ', href: '/?type=series' },
  { label: '🎭 Demon Slayer', href: '/search?q=demon+slayer' },
  { label: '🦸 Marvel', href: '/search?q=marvel' },
  { label: '🌏 Hàn Quốc', href: '/search?q=han+quoc' }
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-badge">
          <span className="dot-pulse" aria-hidden="true"></span>
          <span>Vừa cập nhật hôm nay · Vietsub HD miễn phí</span>
        </div>

        <h1>
          Kỷ Nguyên Mới Của <br />
          <span className="gradient-text">Xem Phim Online</span>
        </h1>

        <p className="hero-subtitle">
          Hàng nghìn bộ phim, anime, series từ khắp thế giới. Vietsub chất lượng cao, không quảng cáo, xem mượt mà trên mọi thiết bị.
        </p>

        <form action="/search" method="GET" className="hero-search" role="search">
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
            <Link key={tag.href} href={tag.href} className="hero-tag">
              {tag.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
