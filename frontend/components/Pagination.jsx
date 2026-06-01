import Link from 'next/link';

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = [1];

  if (current > 4) pages.push('ellipsis-left');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 3) pages.push('ellipsis-right');

  pages.push(total);
  return pages;
}

function buildHref(basePath, baseParams, page) {
  const params = new URLSearchParams();
  Object.entries(baseParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') params.set(k, v);
  });
  params.set('page', page);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export default function Pagination({ page, totalPages, basePath = '/', baseParams = {} }) {
  if (!totalPages || totalPages <= 1) return null;

  const current = Math.min(Math.max(page, 1), totalPages);
  const pages = getPageNumbers(current, totalPages);

  return (
    <nav className="pagination" aria-label="Phân trang">
      {current > 1 ? (
        <Link
          href={buildHref(basePath, baseParams, 1)}
          className="page-btn"
          aria-label="Trang đầu"
        >
          «
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">«</span>
      )}

      {current > 1 ? (
        <Link
          href={buildHref(basePath, baseParams, current - 1)}
          className="page-btn"
          aria-label="Trang trước"
        >
          ‹ Trước
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">‹ Trước</span>
      )}

      {pages.map((p, idx) => {
        if (p === 'ellipsis-left' || p === 'ellipsis-right') {
          return (
            <span key={`e-${idx}`} className="page-ellipsis" aria-hidden="true">
              …
            </span>
          );
        }
        if (p === current) {
          return (
            <span key={p} className="page-btn active" aria-current="page">
              {p}
            </span>
          );
        }
        return (
          <Link
            key={p}
            href={buildHref(basePath, baseParams, p)}
            className="page-btn"
            aria-label={`Trang ${p}`}
          >
            {p}
          </Link>
        );
      })}

      {current < totalPages ? (
        <Link
          href={buildHref(basePath, baseParams, current + 1)}
          className="page-btn"
          aria-label="Trang sau"
        >
          Tiếp ›
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">Tiếp ›</span>
      )}

      {current < totalPages ? (
        <Link
          href={buildHref(basePath, baseParams, totalPages)}
          className="page-btn"
          aria-label="Trang cuối"
        >
          »
        </Link>
      ) : (
        <span className="page-btn disabled" aria-disabled="true">»</span>
      )}
    </nav>
  );
}
