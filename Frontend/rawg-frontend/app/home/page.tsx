'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Game, Genre, Platform } from '@/types';
import GameCard from '@/components/GameCard';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');

  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    genre: '',
    platform: '',
  });

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          api.get('/genres'),
          api.get('/platforms'),
        ]);
        setGenres(genresRes.data.results);
        setPlatforms(platformsRes.data.results);
      } catch (err) {
        console.error('Failed to load filters', err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      setGamesError(null);

      try {
        const params: Record<string, string> = {};
        if (appliedFilters.search) params.search = appliedFilters.search;
        if (appliedFilters.genre) params.genres = appliedFilters.genre;
        if (appliedFilters.platform) params.platforms = appliedFilters.platform;

        const response = await api.get('/games', { params });
        setGames(response.data.results);
      } catch (err) {
        setGamesError('Failed to load games.');
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGames();
  }, [appliedFilters]); 

  const handleSearch = () => {
    setAppliedFilters({
      search: searchInput,
      genre: selectedGenre,
      platform: selectedPlatform,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleClear = () => {
    setSearchInput('');
    setSelectedGenre('');
    setSelectedPlatform('');
    setAppliedFilters({ search: '', genre: '', platform: '' });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-white text-2xl font-bold mb-8">Browse Games</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">

        <input
          type="text"
          placeholder="Search games..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-zinc-800 text-white placeholder-zinc-500 px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
        />

        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="">All Genres</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>
              {genre.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors"
        >
          <option value="">All Platforms</option>
          {platforms.map((platform) => (
            <option key={platform.id} value={String(platform.id)}>
              {platform.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Search
        </button>

        {(appliedFilters.search || appliedFilters.genre || appliedFilters.platform) && (
          <button
            onClick={handleClear}
            className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {isLoadingGames && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {gamesError && (
        <p className="text-red-400 text-center py-20">{gamesError}</p>
      )}

      {!isLoadingGames && !gamesError && games.length === 0 && (
        <p className="text-zinc-500 text-center py-20">No games found.</p>
      )}

      {!isLoadingGames && !gamesError && games.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </main>
  );
}