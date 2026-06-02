import './globals.css';

export const metadata = {
  title: {
    default: 'Raccoon.phim — Xem Phim Online Vietsub HD',
    template: '%s · Raccoon.phim'
  },
  description:
    'Raccoon.phim — Trang xem phim online tiếng Việt. Phim mới, phim bộ, anime Vietsub chất lượng cao, không quảng cáo.',
  keywords: ['xem phim', 'phim vietsub', 'phim online', 'anime', 'phim bộ', 'phim lẻ'],
  authors: [{ name: 'Raccoon.phim' }],
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦝</text></svg>'
  },
  openGraph: {
    title: 'Raccoon.phim — Xem Phim Online Vietsub HD',
    description: 'Hàng nghìn bộ phim, anime, series. Vietsub HD, không quảng cáo.',
    type: 'website',
    locale: 'vi_VN'
  }
};

export const viewport = {
  themeColor: '#a855f7'
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
