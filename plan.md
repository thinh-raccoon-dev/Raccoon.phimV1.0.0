# Kế hoạch: Trang Web Xem Phim (rophim/motchill style)

## Context

Xây dựng trang web xem phim tiếng Việt tương tự rophim.com và motchill.net. Dự án bắt đầu từ thư mục trống, cần tạo toàn bộ từ đầu. Mục tiêu: frontend-only, không cần backend, deploy được ngay.

---

## Tech Stack

- **HTML/CSS/JS thuần** (không dùng React/Vue) — không cần build tool, mở file là chạy được
- **Tailwind CSS Play CDN** — responsive styling qua script tag, không cần compile
- **OPhim API** (`ophim1.com`) — API miễn phí, tiếng Việt, trả về phim + link embed trực tiếp, không cần API key
- **Video: `<iframe>` embed** — dùng `link_embed` từ OPhim, nhúng thẳng vào trang (giống cách rophim/motchill hoạt động)

---

## Cấu trúc thư mục

```
testWeb/
├── index.html          # Trang chủ
├── browse.html         # Duyệt phim / lọc
├── movie.html          # Chi tiết phim
├── watch.html          # Trang xem phim (iframe player)
├── search.html         # Kết quả tìm kiếm
│
├── css/
│   └── style.css       # Dark theme variables, scrollbar, animations, card hover
│
├── js/
│   ├── api.js          # Tất cả API calls tới OPhim, fallback mirror
│   ├── utils.js        # getQueryParam, truncate, formatDate, lazyLoadImages
│   ├── components.js   # renderNavbar, renderFooter, renderMovieCard, renderMovieGrid, renderEpisodeList, renderFilterBar, renderPagination
│   ├── home.js         # Logic trang chủ (hero slider, các row phim)
│   ├── browse.js       # Logic trang duyệt (filter + pagination)
│   ├── movie.js        # Logic trang chi tiết phim
│   ├── watch.js        # Logic trang xem phim
│   └── search.js       # Logic trang tìm kiếm
│
└── assets/
    ├── placeholder.jpg # Poster fallback khi ảnh lỗi
    └── logo.svg
```

---

## Các trang cần xây dựng

### 1. `index.html` — Trang chủ
- **Hero banner**: slider tự động 5-6 phim nổi bật, ảnh nền blur, nút "Xem Ngay"
- **Rows ngang**: Phim Mới Cập Nhật, Phim Lẻ, Phim Bộ, Phim Hàn Quốc, Phim Hành Động
- Mỗi row có nút cuộn trái/phải (Netflix-style)

### 2. `browse.html` — Duyệt & Lọc
- Bộ lọc: Thể Loại, Quốc Gia, Năm, Loại Phim, Sắp Xếp
- Grid phim responsive (2/3/4/6 cột theo màn hình)
- Pagination số trang
- URL params phản ánh filter (`?genre=hanh-dong&year=2024&page=1`)

### 3. `movie.html` — Chi tiết phim
- Poster + metadata (tên, năm, chất lượng, ngôn ngữ, thể loại, quốc gia, diễn viên, đạo diễn, nội dung)
- Tabs server (Vietsub #1, Thuyết Minh #1...)
- Grid tập phim (nếu phim bộ), click → chuyển sang watch.html
- Nút "Xem Phim" lớn

### 4. `watch.html` — Xem phim
- iframe 16:9 full-width từ `link_embed` của OPhim
- Panel chọn tập phía dưới player
- Chuyển tập không reload trang (chỉ đổi `iframe.src` + cập nhật URL param)

### 5. `search.html` — Tìm kiếm
- Hiển thị kết quả từ `?q=...`
- Grid phim + pagination
- Thông báo số kết quả

---

## OPhim API

**Base:** `https://ophim1.com` (fallback: `ophim17.cc`)

| Mục đích | Endpoint |
|---|---|
| Phim mới cập nhật | `GET /danh-sach/phim-moi-cap-nhat?page=1` |
| Phim lẻ | `GET /v1/api/danh-sach/phim-le?page=1` |
| Phim bộ | `GET /v1/api/danh-sach/phim-bo?page=1` |
| Theo thể loại | `GET /v1/api/the-loai/{slug}?page=1` |
| Theo quốc gia | `GET /v1/api/quoc-gia/{slug}?page=1` |
| Chi tiết phim + tập | `GET /phim/{slug}` |
| Tìm kiếm | `GET /v1/api/tim-kiem?keyword={query}&page=1` |

**Image base URL:** `https://img.ophim.live/uploads/movies/`

Episode object trả về `link_embed` → nhúng thẳng vào `<iframe src="link_embed">`.

---

## UI / Design

- **Dark theme mặc định**: nền `#0f0f0f`, card `#1a1a2e`, accent đỏ `#e50914`, chữ `#e5e5e5`
- CSS custom properties trong `style.css`
- Card phim: poster 2:3, badge HD/CAM/Vietsub, hover overlay với nút play
- Lazy loading ảnh qua `IntersectionObserver`
- Skeleton loading khi đang fetch API
- Responsive: mobile (2 cột) → tablet (3-4 cột) → desktop (5-6 cột)
- Hamburger menu trên mobile

---

## Thứ tự xây dựng

1. **Hạ tầng** — `api.js`, `utils.js`, `components.js` (navbar/footer/card), `style.css`
2. **Trang chủ** — hero slider + các row ngang + `home.js`
3. **Chi tiết phim** — `movie.html` + `movie.js`
4. **Xem phim** — `watch.html` + `watch.js` (iframe player + chọn tập)
5. **Duyệt phim** — `browse.html` + `browse.js` (filter + pagination)
6. **Tìm kiếm** — `search.html` + `search.js`
7. **Polish** — skeleton loading, error state, mobile menu, scroll-to-top, og:meta tags

---

## Lưu ý kỹ thuật

- **CORS**: OPhim API hỗ trợ CORS từ browser fetch, không cần proxy
- **iframe bị chặn**: Một số `link_embed` có `X-Frame-Options: SAMEORIGIN` — thử server khác trong cùng episode
- **Không có tổng số trang**: Detect trang cuối khi array kết quả trả về rỗng
- **Deploy**: Kéo thả thư mục lên Netlify / GitHub Pages — không cần build step

---

## Kiểm tra

1. Mở `index.html` trực tiếp trên trình duyệt (hoặc dùng VS Code Live Server)
2. Kiểm tra API calls trong DevTools Network tab
3. Click vào phim bất kỳ → vào trang chi tiết → xem phim → player hiển thị
4. Test trên mobile viewport (Chrome DevTools)
5. Test tìm kiếm và bộ lọc
