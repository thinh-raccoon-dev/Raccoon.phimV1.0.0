import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import WatchPlayer from '@/components/WatchPlayer';
import { fetchMovieBySlug } from '@/lib/api';

export async function generateMetadata({ params }) {
  try {
    const movie = await fetchMovieBySlug(params.slug);
    return { title: `Xem: ${movie.name}` };
  } catch {
    return { title: 'Xem phim' };
  }
}

export default async function WatchPage({ params }) {
  let movie;
  try {
    movie = await fetchMovieBySlug(params.slug);
  } catch (err) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="page-title">
          <span className="accent-bar" />
          {movie.name}
          {movie.origin_name ? (
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.75rem' }}>
              ({movie.origin_name})
            </span>
          ) : null}
        </h1>
        <WatchPlayer movie={movie} />
        <footer className="footer">
          © {new Date().getFullYear()} <span className="footer-brand">🦝 Raccoon.phim</span>
        </footer>
      </main>
    </>
  );
}
