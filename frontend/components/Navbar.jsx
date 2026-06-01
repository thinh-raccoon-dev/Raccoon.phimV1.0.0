import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link href="/" className="logo" aria-label="Raccoon.phim trang chủ">
          <span className="logo-emoji" aria-hidden="true">🦝</span>
          <span>Raccoon.phim</span>
        </Link>

        <ul className="nav-links">
          <li>
            <Link href="/">Trang Chủ</Link>
          </li>
          <li>
            <Link href="/?has_episodes=true">Xem Ngay</Link>
          </li>
          <li>
            <Link href="/?type=single">Phim Lẻ</Link>
          </li>
          <li>
            <Link href="/?type=series">Phim Bộ</Link>
          </li>
          <li>
            <Link href="/?is_hot=true">Hot</Link>
          </li>
        </ul>

        <form action="/search" method="GET" className="navbar-search" role="search">
          <input
            type="search"
            name="q"
            placeholder="Tìm phim, anime..."
            aria-label="Tìm kiếm phim"
            autoComplete="off"
          />
          <button type="submit" aria-label="Tìm kiếm">
            🔍
          </button>
        </form>
      </div>
    </nav>
  );
}
