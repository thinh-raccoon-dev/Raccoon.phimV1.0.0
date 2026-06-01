# CLAUDE.md — testWeb Movie Streaming Site

## Project Overview

Trang web xem phim tiếng Việt tương tự rophim.com / motchill.net.
Frontend-only, không cần backend, không cần build tool, mở file là chạy được.

## Tech Stack

| Thành phần | Công nghệ |
|---|---|
| Markup | HTML5 thuần |
| Styling | Tailwind CSS Play CDN + `css/style.css` tùy chỉnh |
| Logic | Vanilla JavaScript |
| Data | OPhim API — không cần API key |
| Video | `<iframe>` embed từ `link_embed` OPhim |
| Deploy | Static (Netlify / GitHub Pages — kéo thả) |

## File Structure

```
testWeb/
├── CLAUDE.md           ← file này
├── plan.md             ← kế hoạch chi tiết toàn dự án
├── index.html          ← trang chủ
├── browse.html         ← duyệt & lọc phim
├── movie.html          ← chi tiết phim
├── watch.html          ← xem phim (iframe player)
├── search.html         ← kết quả tìm kiếm
│
├── css/
│   └── style.css       ← dark theme vars, scrollbar, animations
│
├── js/
│   ├── api.js          ← tất cả fetch calls đến OPhim
│   ├── utils.js        ← getQueryParam, truncate, lazyLoadImages
│   ├── components.js   ← renderNavbar, renderFooter, renderMovieCard, ...
│   ├── home.js         ← hero slider + rows trang chủ
│   ├── browse.js       ← filter + pagination
│   ├── movie.js        ← trang chi tiết phim
│   ├── watch.js        ← iframe player + chọn tập
│   └── search.js       ← trang tìm kiếm
│
└── assets/
    ├── placeholder.jpg ← poster fallback
    └── logo.svg
```

## OPhim API

**Base URL:** `https://ophim1.com` | Fallback: `https://ophim17.cc`

```js
GET /danh-sach/phim-moi-cap-nhat?page=1     // phim mới
GET /v1/api/danh-sach/phim-le?page=1         // phim lẻ
GET /v1/api/danh-sach/phim-bo?page=1         // phim bộ
GET /v1/api/the-loai/{slug}?page=1           // theo thể loại
GET /v1/api/quoc-gia/{slug}?page=1           // theo quốc gia
GET /phim/{slug}                             // chi tiết + episodes
GET /v1/api/tim-kiem?keyword={q}&page=1      // tìm kiếm

// Image CDN
https://img.ophim.live/uploads/movies/{filename}
```

## Design System

```css
--bg-primary:    #0f0f0f   /* nền chính */
--bg-card:       #1a1a2e   /* card phim */
--accent:        #e50914   /* đỏ Netflix */
--text-primary:  #e5e5e5
--text-muted:    #999
```

- Card phim: tỉ lệ 2:3, badge HD/Vietsub/CAM, hover overlay + play icon
- Lazy load ảnh qua `IntersectionObserver`
- Skeleton loading khi fetch API
- Responsive: 2 cột (mobile) → 3-4 (tablet) → 5-6 (desktop)

## Routing

Không dùng router library. Mỗi trang là file `.html` riêng.
State truyền qua URL query params:

```
movie.html?slug=ten-phim
watch.html?slug=ten-phim&ep=0&server=0
browse.html?genre=hanh-dong&year=2024&page=1
search.html?q=tu-khoa&page=1
```

Đọc params bằng `utils.getQueryParam('slug')` trong mỗi page JS.

## Development

Không cần `npm install`. Mở trực tiếp bằng:
- VS Code Live Server (khuyên dùng, tránh CORS fetch issues)
- Hoặc: `python -m http.server 8080` trong thư mục project

## Known Constraints

- Một số `link_embed` bị chặn bởi `X-Frame-Options: SAMEORIGIN` — thử server khác trong episode list
- OPhim không trả về tổng số trang — detect trang cuối khi `items` trả về mảng rỗng
- Tất cả text UI bằng tiếng Việt
