"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/lib/api";
import type { Game } from "@/types";
import GameCard from "@/components/GameCard";
import RecommendedForYou from "@/components/RecommendationForUser";

export default function Home() {
  const searchParams = useSearchParams();
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Read filters directly from URL
  const search = searchParams.get("search") ?? "";
  const genre = searchParams.get("genres") ?? "";
  const platform = searchParams.get("platforms") ?? "";

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      setGamesError(null);

      try {
        const params: Record<string, string | number> = {};
        if (search) params.search = search;
        if (genre) params.genres = genre;
        if (platform) params.platforms = platform;
        params.page = currentPage;
        params.page_size = pageSize;

        const response = await api.get("/games", { params });
        setGames(response.data.results);
        setTotalCount(response.data.count);
      } catch (err) {
        setGamesError("Failed to load games.");
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGames();
  }, [search, genre, platform, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">

      <RecommendedForYou />

      <div>
        <h2 className="text-3xl font-light text-white">Featured & Trending Games</h2>
        <p className="text-zinc-400 text-sm mt-1 mb-5">
          See what the world is exploring
        </p>
      </div>


      {isLoadingGames && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-cyan-500 animate-spin" />
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

      {!isLoadingGames && !gamesError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {currentPage > 2 && (
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm rounded-lg transition-colors"
            >
              «
            </button>
          )}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            ‹ Prev
          </button>
          <div className="flex items-center gap-1.5 px-2">
            <span className="text-zinc-500 text-sm">Page</span>
            <span className="text-white font-semibold text-sm">{currentPage}</span>
            <span className="text-zinc-500 text-sm">of</span>
            <span className="text-zinc-400 text-sm">{totalPages}</span>
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            Next ›
          </button>
          {currentPage < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm rounded-lg transition-colors"
            >
              »
            </button>
          )}
        </div>
      )}
    </main>
  );
}