# July — Personal Portfolio & Blog

A full-stack personal portfolio and blog system built for a chef and traveler. Includes a public-facing portfolio site, a private admin dashboard, and a FastAPI backend with PostgreSQL.

---

## Project Structure

```
July_Portfolio/
├── Portfolio/          # Public-facing portfolio website (React + Vite)
├── admin_dashboard/    # Private admin dashboard (React + Vite)
└── backend/            # REST API + database (FastAPI + PostgreSQL)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend (Portfolio) | React 18, Vite, TanStack Query, Axios |
| Frontend (Admin) | React 18, Vite, TanStack Query, Axios |
| Backend | FastAPI, SQLAlchemy 2.0, Pydantic v2, Uvicorn |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose + passlib) |
| File Storage | Local uploads (served by FastAPI) |
| Containerization | Docker + Docker Compose |

---

## Features

### Portfolio Site
- Home page with hero, featured work, about preview, and latest journal posts
- Work gallery with masonry layout and category filtering (Dish / Restaurant / Review)
- Journal with category filtering, pagination, and featured post
- Individual post pages with cover image, content, photo gallery, and "Keep reading" section
- About page with bio, pillars, and timeline
- Contact form with category selection, sent directly to backend
- Fully responsive design

### Admin Dashboard
- JWT-protected login
- **Journal** — create, edit, publish/draft posts with cover photo, body text, category, custom date, and up to 5 photos per post
- **Work** — create, edit, delete work entries with single cover photo, type, and location
- **Messages** — view contact form submissions
- **Settings** — manage admin account

### Backend API
- Public endpoints: posts (paginated), work, individual post by slug, contact form
- Admin endpoints: full CRUD for posts and work, image upload, message inbox
- Rate limiting on contact form
- File upload with Pillow image processing
- Auto-slug generation with uniqueness handling

---

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/) and Docker Compose
- [Node.js](https://nodejs.org/) 18+ and npm

---

### 1. Backend

```bash
cd backend

# Copy and configure environment
cp .env.example .env
# Edit .env — set SECRET_KEY, FIRST_ADMIN_EMAIL, FIRST_ADMIN_PASSWORD

# Start database + API
docker compose up -d

# On first run, create the admin account
docker exec -it backend-backend-1 python setup.py
```

The API will be available at `http://localhost:8000`
API docs: `http://localhost:8000/docs`

---

### 2. Portfolio Site

```bash
cd Portfolio

# Copy and configure environment
cp .env.example .env
# Edit .env — set your email, location, social links

npm install
npm run dev
```

Runs at `http://localhost:5173`

---

### 3. Admin Dashboard

```bash
cd admin_dashboard

npm install
npm run dev
```

Runs at `http://localhost:5174`  
Login with the admin credentials you set in `backend/.env`

---

## Environment Variables

### `Portfolio/.env`

```env
VITE_API_URL=http://localhost:8000

VITE_CONTACT_EMAIL=your@email.com
VITE_SITE_LOCATION=Your City

VITE_SOCIAL_INSTAGRAM=
VITE_SOCIAL_FACEBOOK=
VITE_SOCIAL_LINE=
VITE_SOCIAL_TIKTOK=
VITE_SOCIAL_TWITTER=
```

### `admin_dashboard/.env`

```env
VITE_API_URL=http://localhost:8000
```

### `backend/.env`

```env
DATABASE_URL=postgresql://july:july_password@localhost:5432/july_portfolio
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080

UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE_MB=10
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

FIRST_ADMIN_EMAIL=you@yourdomain.com
FIRST_ADMIN_PASSWORD=choose-a-strong-password
```

> Generate a secure secret key with:
> ```bash
> python -c "import secrets; print(secrets.token_hex(32))"
> ```

---

## API Overview

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/posts` | Public | List published posts (paginated) |
| GET | `/api/posts/{slug}` | Public | Get single post |
| GET | `/api/work` | Public | List work entries |
| POST | `/api/contact` | Public | Submit contact form |
| POST | `/api/admin/login` | — | Get JWT token |
| GET/POST | `/api/admin/posts` | Admin | List / create posts |
| PUT/DELETE | `/api/admin/posts/{id}` | Admin | Update / delete post |
| POST | `/api/admin/posts/{id}/images` | Admin | Add photo to post |
| GET/POST | `/api/admin/work` | Admin | List / create work entries |
| PUT/DELETE | `/api/admin/work/{id}` | Admin | Update / delete work entry |
| POST | `/api/admin/upload` | Admin | Upload media file |
| GET | `/api/admin/messages` | Admin | View contact messages |

Full interactive docs at `http://localhost:8000/docs`

---

## Deployment Notes

- Set `CORS_ORIGINS` in `backend/.env` to your production frontend URLs
- Set `VITE_API_URL` in both frontend `.env` files to your production API URL
- Uploaded files in `backend/uploads/` should be persisted (volume mount or object storage)
- Build the frontends with `npm run build` — output goes to `dist/`

---

## License

Personal project. Not licensed for redistribution.
