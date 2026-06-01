import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { searchOphim } from '@/lib/api';

export const metadata = {
  title: 'Tìm kiếm phim'
};

export default async function SearchPage({ searchParams }) {
  const q = (searchParams?.q || '').trim();
  const page = Math.max(parseInt(searchParams?.page, 10) || 1, 1);

  let data = null;
  let error = null;

  if (q) {
    try {
      data = await searchOphim(q, page);
    } catch (err) {
      error = err.message;
    }
  }

  const items = data?.items || [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar />
      <main className="container">
        <div className="page-header">
          <h1 className="page-title">
            <span className="accent-bar" />
            {q ? `Kết quả tìm kiếm: "${q}"` : 'Tìm kiếm phim'}
            {pagination && pagination.total ? (
              <span className="page-count">({pagination.total} kết quả)</span>
            ) : null}
          </h1>
          {pagination && pagination.totalPages > 1 ? (
            <span className="page-indicator">
              Trang <strong>{pagination.page}</strong> / {pagination.totalPages}
            </span>
          ) : null}
        </div>

        {!q ? (
          <div className="empty-box">
            <p>
              <strong>Nhập từ khoá vào ô tìm kiếm ở navbar phía trên.</strong>
            </p>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>
              Ví dụ: <Link href="/search?q=demon+slayer" style={{ color: 'var(--accent)' }}>demon slayer</Link>,{' '}
              <Link href="/search?q=oppenheimer" style={{ color: 'var(--accent)' }}>oppenheimer</Link>,{' '}
              <Link href="/search?q=naruto" style={{ color: 'var(--accent)' }}>naruto</Link>,{' '}
              <Link href="/search?q=thanh+guom+diet+quy" style={{ color: 'var(--accent)' }}>thanh gươm diệt quỷ</Link>
            </p>
          </div>
        ) : error ? (
          <div className="error-box">
            <strong>Lỗi tìm kiếm:</strong>
            <p style={{ marginTop: '0.5rem' }}>{error}</p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-box">
            <p>
              <strong>Không tìm thấy phim nào khớp với "{q}"</strong>
            </p>
            <p style={{ marginTop: '0.75rem', color: 'var(--text-muted)' }}>
              Gợi ý:
            </p>
            <ul style={{ marginTop: '0.5rem', color: 'var(--text-muted)', textAlign: 'left', maxWidth: 500, margin: '0.5rem auto' }}>
              <li>Thử tên gốc tiếng Anh thay vì tiếng Việt (ví dụ: "Demon Slayer" thay vì "Kimetsu no Yaiba")</li>
              <li>Bỏ dấu tiếng Việt: "thanh guom diet quy"</li>
              <li>Tìm bằng từ khoá ngắn hơn (ví dụ: "demon" thôi)</li>
            </ul>
          </div>
        ) : (
          <>
            <p className="search-hint">
              Kết quả lấy trực tiếp từ kho OPhim · Click vào phim sẽ tự đồng bộ về DB để xem
            </p>
            <section className="movie-grid">
              {items.map((movie) => (
                <MovieCard key={movie.slug} movie={movie} />
              ))}
            </section>

            <Pagination
              page={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              basePath="/search"
              baseParams={{ q }}
            />
          </>
        )}

        <footer className="footer">
          © {new Date().getFullYear()} <span className="footer-brand">🦝 Raccoon.phim</span>
        </footer>
      </main>
    </>
  );
}
