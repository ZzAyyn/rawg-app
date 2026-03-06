# RGVT - Game Discovery Platform

A full-stack game discovery platform built with Laravel and Next.js, similar to RAWG.io. Users can browse games, search and filter by genre/platform, write reviews, and manage their favourite games.

## Tech Stack

- **Backend:** Laravel 12, MySQL, Laravel Sanctum
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Axios
- **External API:** RAWG Video Games Database API (used for seeding only)

## Prerequisites

Make sure you have the following installed:
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL
- RAWG API key (free at https://rawg.io/apiv2)

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/ZzAyyn/rawg-app
cd rawg-app
```

### 2. Backend Setup (Laravel)
```bash
cd Backend/rawg-backend
composer install
cp .env.example .env
php artisan key:generate
```

Update `.env` with your database and RAWG API credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rawg_app
DB_USERNAME=root
DB_PASSWORD=your_mysql_password

RAWG_API_KEY=your_rawg_api_key
RAWG_BASE_URL=https://api.rawg.io/api
```

Create the MySQL database:
```sql
CREATE DATABASE rawg_app;
```

Run migrations and seed the database:
```bash
php artisan migrate
php artisan db:seed
```

> ⚠️ Seeding fetches ~500 games from the RAWG API including full game details. This may take 8-10 minutes. Do not interrupt the process.

Start the backend server:
```bash
php artisan serve
```

Backend will run on http://localhost:8000

### 3. Frontend Setup (Next.js)
```bash
cd Frontend/rawg-frontend
npm install
```

Create a `.env.local` file in the frontend root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Features

- Browse ~500 games served from local MySQL database
- Search games by name
- Filter by genre and platform
- Paginated game listing
- Game detail page with rating, description, genres and platforms
- User authentication (register, login, logout)
- Add/remove games to favourites
- Write, edit and delete game reviews (1-10 rating scale)
- User dashboard with profile editing, favourites and reviews management
- Protected routes — dashboard requires authentication

## Project Structure
```
rawg-app/
├── Backend/
│   └── rawg-backend/        # Laravel 12 API
│       ├── app/
│       │   ├── Http/Controllers/Api/
│       │   ├── Models/
│       │   └── Services/
│       ├── database/
│       │   ├── migrations/
│       │   └── seeders/
│       └── routes/
│           └── api.php
└── Frontend/
    └── rawg-frontend/       # Next.js 16
        ├── app/             # Pages (App Router)
        ├── components/      # Reusable UI components
        ├── contexts/        # React Context (Auth)
        ├── lib/             # Axios API client
        └── types/           # TypeScript interfaces
```

## Database

The app uses MySQL. Games are seeded from the RAWG API into the local database using `php artisan db:seed`. The RAWG API is **only used during seeding** — all game data is served from the local database during normal usage.

### Entity Relationships

- **One-to-One:** User ↔ Profile
- **One-to-Many:** User → Reviews, User → Favourites
- **Many-to-Many:** User ↔ Games (through favourites table)

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register a new user |
| POST | `/api/login` | Login |
| GET | `/api/games` | List all games (search, filter, paginate) |
| GET | `/api/games/{id}` | Get game details |
| GET | `/api/genres` | List all genres |
| GET | `/api/platforms` | List all platforms |
| GET | `/api/games/{id}/reviews` | Get reviews for a game |

### Protected (requires Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/logout` | Logout |
| GET | `/api/profile` | Get user profile |
| POST | `/api/profile` | Create/update profile |
| GET | `/api/favourites` | Get user favourites |
| POST | `/api/favourites` | Add to favourites |
| DELETE | `/api/favourites/{id}` | Remove from favourites |
| GET | `/api/my-reviews` | Get user reviews |
| POST | `/api/reviews` | Create a review |
| PUT | `/api/reviews/{id}` | Update a review |
| DELETE | `/api/reviews/{id}` | Delete a review |