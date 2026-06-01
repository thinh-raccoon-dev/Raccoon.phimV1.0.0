import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import MovieCard from '@/components/MovieCard';
import Pagination from '@/components/Pagination';
import { fetchMovies } from '@/lib/api';

const DEFAULT_LIMIT = 24;
const FEATURES = [
  {
    icon: '⚡',
    title: 'Xem ngay tức thì',
    desc: 'Hơn 80% phim trong kho có sẵn link xem. Bấm là chạy, không chờ đợi.'
  },
  {
    icon: '🎬',
    title: 'Vietsub chất lượng cao',
    desc: 'Vietsub, lồng tiếng, thuyết minh đầy đủ. Cập nhật tập mới mỗi ngày từ OPhim.'
  },
  {
    icon: '🚀',
    title: 'Không quảng cáo phiền',
    desc: 'Player sạch, không pop-up. Đổi server dễ dàng nếu một nguồn bị lỗi.'
  }
];

export default async function HomePage({ searchParams }) {
  const page = Math.max(parseInt(searchParams?.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams?.limit, 10) || DEFAULT_LIMIT, 1), 50);

  const filterParams = {
    type: searchParams?.type,
    is_hot: searchParams?.is_hot,
    has_episodes: searchParams?.has_episodes,
    q: searchParams?.q
  };

  const hasFilter = Boolean(
    filterParams.type || filterParams.is_hot || filterParams.has_episodes || filterParams.q || page > 1
  );

  let data = null;
  let error = null;

  try {
    data = await fetchMovies({ page, limit, ...filterParams });
  } catch (err) {
    error = err.message;
  }

  const items = data?.items || [];
  const pagination = data?.pagination;

  let titleText = 'Mới Cập Nhật';
  let subtitle = 'Phim mới nhất vừa được đồng bộ về kho';
  if (filterParams.type === 'single') {
    titleText = 'Phim Lẻ';
    subtitle = 'Phim chiếu rạp, phim điện ảnh';
  } else if (filterParams.type === 'series') {
    titleText = 'Phim Bộ';
    subtitle = 'Series nhiều tập, phim dài hấp dẫn';
  } else if (filterParams.is_hot === 'true') {
    titleText = 'Phim Hot Đang Xem Nhiều';
    subtitle = 'Top phim có lượt xem cao nhất';
  } else if (filterParams.has_episodes === 'true') {
    titleText = 'Phim Xem Được Ngay';
    subtitle = 'Đã có sẵn link xem, bấm vào là chạy';
  }
  if (filterParams.q) {
    titleText = `Kết quả: "${filterParams.q}"`;
    subtitle = `${pagination?.total || 0} phim khớp với từ khoá của bạn`;
  }

  return (
    <>
      <Navbar />

      {!hasFilter ? (
        <>
          <Hero />
          <main className="container">
            <section className="feature-strip">
              {FEATURES.map((f) => (
                <div key={f.title} className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </div>
              ))}
            </section>
          </main>
        </>
      ) : null}

      <main className="container">
        <div className={hasFilter ? 'page-header' : 'section-header'} style={hasFilter ? undefined : { marginTop: '2rem' }}>
          <div>
            <h2 className={hasFilter ? 'page-title' : 'section-title'}>
              <span className="accent-bar" />
              {titleText}
              {pagination ? <span className="page-count">({pagination.total} phim)</span> : null}
            </h2>
            {!hasFilter ? <p className="section-subtitle">{subtitle}</p> : null}
          </div>
          {pagination && pagination.totalPages > 1 ? (
            <span className="page-indicator">
              Trang <strong>{pagination.page}</strong> / {pagination.totalPages}
            </span>
          ) : null}
        </div>

        {error ? (
          <div className="error-box">
            <strong>Không thể tải danh sách phim.</strong>
            <p style={{ marginTop: '0.5rem' }}>{error}</p>
            <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              Kiểm tra backend đã chạy tại <code>http://localhost:5000</code> chưa.
            </p>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-box">
            <p><strong>Không tìm thấy phim nào.</strong></p>
            {filterParams.q ? (
              <p style={{ marginTop: '0.5rem' }}>
                Thử từ khoá khác hoặc <Link href="/" style={{ color: 'var(--accent)' }}>về trang chủ</Link>.
              </p>
            ) : (
              <p style={{ marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                Chạy <code>npm run sync</code> ở backend để nạp phim từ OPhim.
              </p>
            )}
          </div>
        ) : (
          <>
            <section className="movie-grid">
              {items.map((movie) => (
                <MovieCard key={movie._id || movie.slug} movie={movie} />
              ))}
            </section>

            <Pagination
              page={pagination?.page || 1}
              totalPages={pagination?.totalPages || 1}
              basePath="/"
              baseParams={{
                ...filterParams,
                limit: limit !== DEFAULT_LIMIT ? limit : undefined
              }}
            />
          </>
        )}

        <footer className="footer">
          <p>
            © {new Date().getFullYear()} <span className="footer-brand">🦝 Raccoon.phim</span> · Dữ liệu cung cấp bởi OPhim
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.78rem' }}>
            Trang web phi lợi nhuận · Mục đích giáo dục · Không lưu trữ video
          </p>
        </footer>
      </main>
    </>
  );
}
