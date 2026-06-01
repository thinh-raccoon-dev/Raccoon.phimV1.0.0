# testWeb — Movie Streaming (Full-stack version)

Phiên bản full-stack: **Next.js (FE) + Express + MongoDB (BE)** kèm dữ liệu phim mẫu trong `data/movies.json`.

> Lưu ý: Phiên bản thuần frontend (HTML/CSS/JS + OPhim API) được mô tả trong `CLAUDE.md` và `plan.md`. Repo này hiện cung cấp **cả 2 nhánh kiến trúc**, bạn dùng cái nào phù hợp.

---

## Cấu trúc

```
testWeb/
├── data/
│   └── movies.json          # 12 phim mẫu (Việt, Hàn, Mỹ, Nhật...)
│
├── backend/                 # Express + Mongoose
│   ├── package.json
│   ├── .env.example
│   └── src/
│       ├── server.js
│       ├── seed.js
│       ├── config/db.js
│       ├── models/Movie.js
│       ├── controllers/movieController.js
│       └── routes/movieRoutes.js
│
└── frontend/                # Next.js 14 (App Router, JSX)
    ├── package.json
    ├── next.config.mjs
    ├── .env.local.example
    ├── app/
    │   ├── layout.jsx
    │   ├── page.jsx         # Trang list phim
    │   └── globals.css
    ├── components/
    │   ├── Navbar.jsx
    │   └── MovieCard.jsx
    └── lib/
        └── api.js
```

---

## Yêu cầu môi trường

- **Node.js** ≥ 18
- **MongoDB** chạy local (mặc định `mongodb://127.0.0.1:27017`) hoặc MongoDB Atlas

---

## Cài đặt & chạy

### 1. Backend (Express + MongoDB)

```bash
cd backend
npm install
cp .env.example .env       # Windows: copy .env.example .env
npm run seed               # Nạp 12 phim từ data/movies.json vào DB
npm run dev                # Server chạy tại http://localhost:5000
```

Kiểm tra:

- `GET http://localhost:5000/` → thông tin API
- `GET http://localhost:5000/api/movies` → danh sách phim
- `GET http://localhost:5000/api/movies?type=series&limit=5` → lọc phim bộ
- `GET http://localhost:5000/api/movies/queen-of-tears` → chi tiết 1 phim

### 2. Frontend (Next.js)

Mở terminal mới:

```bash
cd frontend
npm install
cp .env.local.example .env.local   # Windows: copy .env.local.example .env.local
npm run dev                        # Mở http://localhost:3000
```

Trang chủ sẽ gọi `GET /api/movies` từ backend và render grid phim.

---

## API tóm tắt

| Method | Endpoint | Query params | Mô tả |
|---|---|---|---|
| GET | `/api/movies` | `page`, `limit`, `type` (`single`\|`series`), `country`, `category`, `year`, `is_hot`, `q`, `sort`, `order` | List + filter + phân trang |
| GET | `/api/movies/:slug` | — | Chi tiết một phim theo `slug` |

Response chuẩn:

```json
{
  "status": "success",
  "data": {
    "items": [ /* ... */ ],
    "pagination": { "page": 1, "limit": 12, "total": 12, "totalPages": 1 }
  }
}
```

---

## Roadmap tiếp theo

- [ ] Trang chi tiết phim `/movie/[slug]`
- [ ] Trang xem phim `/watch/[slug]` với iframe player
- [ ] Trang tìm kiếm `/search?q=...`
- [ ] Bộ lọc thể loại / quốc gia / năm
- [ ] Đồng bộ thêm dữ liệu từ OPhim API về DB
- [ ] Authentication (lưu phim yêu thích)
