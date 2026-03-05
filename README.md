# RawGVaulT - Game Discovery Platform

A full-stack game discovery platform built with Laravel and Next.js, similar to RAWG.io. Users can browse games, search and filter by genre/platform, write reviews, and manage their favourite games.

## Tech Stack

- **Backend:** Laravel 12, MySQL, Laravel Sanctum
- **Frontend:** Next.js 16, TypeScript, Tailwind CSS, Axios
- **External API:** RAWG Video Games Database API

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

Then run migrations and start the server:
```bash
php artisan migrate
php artisan serve
```

Backend will run on http://localhost:8000

### 3. Frontend Setup (Next.js)
```bash
cd Frontend/rawg-frontend
npm install
```

Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Start the development server:
```bash
npm run dev
```

Frontend will run on http://localhost:3000

## Features

- Browse games fetched live from the RAWG API
- Search games by name
- Filter by genre and platform
- Paginated game listing
- Game detail page with screenshots, ratings, and description
- User authentication (register, login, logout)
- Add/remove games to favourites
- Write, edit and delete game reviews
- User dashboard with profile, favourites and reviews management

## Database

The app uses MySQL. Games are fetched live from the RAWG API and only stored locally when a user interacts with them (favouriting or reviewing).