export interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface Profile {
    id: number;
    user_id: number;
    bio: string | null;
    avatar: string | null;
    location: string | null;
    website: string | null;
}

export interface Genre {
    id: number;
    name: string;
    slug: string;
}

export interface Platform {
    id: number;
    name: string;
    slug: string;
}

export interface PlatformWrapper {
    platform: Platform;
}

export interface Game {
    id: number;
    slug: string;
    name: string;
    released: string | null;
    background_image: string | null;
    rating: number;
    metacritic: number | null;
    genres: Genre[];
    platforms: PlatformWrapper[];
    description_raw?: string;
}

export interface Review {
    id: number;
    user_id: number;
    game_id: number;
    rating: number;
    body: string;
    created_at: string;
    user?: { id: number; name: string };
}

export interface Favourite {
    id: number;
    user_id: number;
    game_id: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

