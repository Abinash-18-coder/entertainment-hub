# 🎬 CineVerse — Modern Entertainment Aggregator Platform

> A full-stack entertainment aggregator featuring upcoming release timelines, genre discovery, IMDb rating leaderboards, personalized watchlists, and direct streaming platform redirects (Netflix, Prime Video, Disney+ Hotstar).

---

## 🌐 Live Production Links

* **Live Web Application:** [https://cineverse-hub.vercel.app](https://cineverse-hub.vercel.app)
* **Interactive API Documentation (Swagger):** [https://cineverse-backend-api.onrender.com/docs](https://cineverse-backend-api.onrender.com/docs)

---

## 🛠️ Technology Stack

### Backend (Python)
* **FastAPI:** High-performance async REST API framework.
* **PostgreSQL:** Cloud relational database hosted on Neon.
* **SQLAlchemy 2.0 (Async) & Alembic:** Async ORM and database version control migrations.
* **Passlib (Bcrypt) & PyJWT:** Secure password hashing and dual-token JWT authentication.
* **APScheduler:** Background jobs refreshing release calendars and IMDb scores.
* **Pytest:** Automated test suite covering edge cases and auth routes.

### Frontend (JavaScript)
* **React 18 & Vite:** Lightning-fast UI component library and bundler.
* **Tailwind CSS:** Bespoke midnight dark-mode cinema design system.
* **TanStack Query (React Query):** Server-state caching and optimistic mutations.
* **Framer Motion:** Micro-interactions, GPU-accelerated page transitions, and toast alerts.
* **Lucide Icons:** Clean modern vector iconography.

---

## 🚀 Local Development Setup

### 1. Clone the Repository
```bash
git clone [https://github.com/Abinash-18-coder/entertainment-hub.git](https://github.com/Abinash-18-coder/entertainment-hub.git)
cd entertainment-hub
