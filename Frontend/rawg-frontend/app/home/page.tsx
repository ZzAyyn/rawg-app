'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { Game } from '@/types';
import GameCard from '@/components/GameCard';

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get('/games');
        setGames(response.data.results);
      } catch (err) {
        setError('Failed to load games. Is your Laravel server running?');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-400 text-center py-20">{error}</p>;
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-white text-2xl font-bold mb-8">Browse Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </main>
  );
}