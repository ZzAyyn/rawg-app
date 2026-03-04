"use client";

import { useState, useEffect, Fragment } from "react";
import api from "@/lib/api";
import type { Game, Genre, Platform } from "@/types";
import GameCard from "@/components/GameCard";
import TrueFocus from "@/components/TrueFocus";

export default function Home() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [gamesError, setGamesError] = useState<string | null>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

  const [searchInput, setSearchInput] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    genre: "",
    platform: "",
    page: 1,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(totalCount / pageSize);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [genresRes, platformsRes] = await Promise.all([
          api.get("/genres"),
          api.get("/platforms"),
        ]);
        setGenres(genresRes.data.results);
        setPlatforms(platformsRes.data.results);
      } catch (err) {
        console.error("Failed to load filters", err);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchGames = async () => {
      setIsLoadingGames(true);
      setGamesError(null);

      try {
        const params: Record<string, string | number> = {};
        if (appliedFilters.search) params.search = appliedFilters.search;
        if (appliedFilters.genre) params.genres = appliedFilters.genre;
        if (appliedFilters.platform) params.platforms = appliedFilters.platform;
        params.page = appliedFilters.page;
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
  }, [appliedFilters]);

  const handleSearch = () => {
    setAppliedFilters({
      search: searchInput,
      genre: selectedGenre,
      platform: selectedPlatform,
      page: 1,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleClear = () => {
    setSearchInput("");
    setSelectedGenre("");
    setSelectedPlatform("");
    setAppliedFilters({ search: "", genre: "", platform: "", page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setAppliedFilters((prev) => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-7">
        <TrueFocus
          sentence="Browse Games"
          manualMode={false}
          blurAmount={5}
          borderColor="#00FFFF"
          animationDuration={0.5}
          pauseBetweenAnimations={1}
        />
      </div>

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

        {(appliedFilters.search ||
          appliedFilters.genre ||
          appliedFilters.platform) && (
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

      {!isLoadingGames && !gamesError && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {appliedFilters.page > 2 && (
            <button
              onClick={() => handlePageChange(1)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm rounded-lg transition-colors"
              title="First page"
            >
              «
            </button>
          )}

          <button
            onClick={() => handlePageChange(appliedFilters.page - 1)}
            disabled={appliedFilters.page === 1}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            ‹ Prev
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <span className="text-zinc-500 text-sm">Page</span>
            <span className="text-white font-semibold text-sm">
              {appliedFilters.page}
            </span>
            <span className="text-zinc-500 text-sm">of</span>
            <span className="text-zinc-400 text-sm">{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(appliedFilters.page + 1)}
            disabled={appliedFilters.page === totalPages}
            className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
          >
            Next ›
          </button>

          {/* Last page */}
          {appliedFilters.page < totalPages - 1 && (
            <button
              onClick={() => handlePageChange(totalPages)}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-sm rounded-lg transition-colors"
              title="Last page"
            >
              »
            </button>
          )}
        </div>
      )}
    </main>
  );
}
