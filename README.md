# 💰 ExpenseTracker

A full-stack personal finance management application built with **Django REST Framework** and **React (Vite)**. Track income & expenses, visualize cash flow, and manage category-based budgets — all from a modern, beautifully crafted dashboard.

![Made with Django](https://img.shields.io/badge/Backend-Django%20REST-092E20?logo=django&logoColor=white)
![Made with React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=black)
![Styled with CSS](https://img.shields.io/badge/Styling-Custom%20CSS-1572B6?logo=css3&logoColor=white)

---

## ✨ Features

### Core Functionality
- **Transaction Management** — Add, edit, delete income & expense records with category, date, and description
- **Smart Budgets** — Set monthly spending limits per category with real-time progress tracking
- **Dashboard Analytics** — Visual monthly spending trends and category distribution charts
- **Budget History** — Track budget performance over the last 6 months

### User Experience
- **Glassmorphism UI** — Modern dark theme with backdrop blur, gradient accents, and smooth animations
- **Toast Notifications** — Instant feedback on every action (save, delete, errors)
- **Skeleton Loading** — Shimmer placeholders while data loads
- **Responsive Design** — Fully responsive across desktop, tablet, and mobile
- **Icon System** — React Icons throughout for clean, consistent UI

### Authentication & Security
- **JWT Authentication** — Secure token-based auth with automatic refresh
- **Google OAuth** — One-click sign-in with Google
- **Protected Routes** — Private routes with auth guards

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, Django 4.2, Django REST Framework |
| **Frontend** | React 19, Vite 7, React Router DOM 7 |
| **Auth** | JWT (SimpleJWT), Google OAuth 2.0 |
| **Database** | SQLite (dev) / PostgreSQL (prod-ready) |
| **Styling** | Custom CSS with design tokens (70+ variables) |
| **Icons** | React Icons (HeroIcons, Tabler, Remix) |
| **Notifications** | React Hot Toast |
| **HTTP Client** | Axios with interceptors |

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── config/           # Django settings, URLs, WSGI/ASGI
│   ├── users/            # Auth (register, login, Google OAuth, JWT)
│   ├── transactions/     # Transaction CRUD + filtering + pagination
│   ├── budgets/          # Budget CRUD + status + monthly history
│   ├── analytics/        # Summary, monthly spending, category charts
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/   # Navbar, Sidebar, Modal, Forms, Table, etc.
│   │   ├── pages/        # Landing, Login, Signup, Dashboard, etc.
│   │   ├── context/      # AuthContext (global auth state)
│   │   ├── services/     # Axios API client with token refresh
│   │   ├── App.jsx       # Routes & layout
│   │   ├── App.css       # Complete design system
│   │   └── index.css     # Global tokens & animations
│   └── index.html
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # optional
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173/`.

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register/` | Register new user |
| POST | `/api/login/` | JWT login |
| GET | `/api/me/` | Current user profile |
| POST | `/api/change-password/` | Change password |
| GET | `/api/auth/google/` | Google OAuth redirect |
| GET/POST | `/api/transactions/` | List / create transactions |
| PUT/DELETE | `/api/transactions/:id/` | Update / delete transaction |
| GET | `/api/summary/` | Income, expense, balance summary |
| GET | `/api/analytics/monthly/` | Monthly expense breakdown |
| GET | `/api/analytics/category/` | Category expense breakdown |
| GET/POST | `/api/budgets/` | List / create budgets |
| PUT/DELETE | `/api/budgets/:id/` | Update / delete budget |
| GET | `/api/budgets/status/` | Current month budget status |
| GET | `/api/budgets/monthly-history/` | Budget history (last N months) |

---

## 🎨 Design Highlights

- **Custom Design System** — 70+ CSS custom properties for colors, spacing, radii, shadows, transitions
- **Inter Font** — Professional typography loaded from Google Fonts
- **Staggered Animations** — `fadeInUp`, `scaleIn`, `slideInLeft` with configurable delays
- **Bar Charts** — Pure CSS horizontal bars with shimmer animation overlay
- **Budget Progress Bars** — Gradient-filled with over-budget state (turns red)
- **Glassmorphic Cards** — Semi-transparent with backdrop blur & hover glow

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
