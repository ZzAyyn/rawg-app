"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import api from "@/lib/api";
import type { Genre, Platform } from "@/types";

export default function Navbar() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [showGenres, setShowGenres] = useState(false);
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  const genreRef = useRef<HTMLDivElement>(null);
  const platformRef = useRef<HTMLDivElement>(null);

  // Fetch genres and platforms for dropdowns
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

  // Sync state with URL params on load
  useEffect(() => {
    setSearchInput(searchParams.get("search") ?? "");
    setSelectedGenre(searchParams.get("genres") ?? "");
    setSelectedPlatform(searchParams.get("platforms") ?? "");
  }, [searchParams]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(e.target as Node)) {
        setShowGenres(false);
      }
      if (
        platformRef.current &&
        !platformRef.current.contains(e.target as Node)
      ) {
        setShowPlatforms(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (pathname !== "/home") router.push("/home");
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (selectedGenre) params.set("genres", selectedGenre);
    if (selectedPlatform) params.set("platforms", selectedPlatform);
    router.push(`/home?${params.toString()}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleGenreSelect = (slug: string) => {
    setSelectedGenre(slug);
    setShowGenres(false);
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (slug) params.set("genres", slug);
    if (selectedPlatform) params.set("platforms", selectedPlatform);
    router.push(`/home?${params.toString()}`);
  };

  const handlePlatformSelect = (id: string) => {
    setSelectedPlatform(id);
    setShowPlatforms(false);
    const params = new URLSearchParams();
    if (searchInput) params.set("search", searchInput);
    if (selectedGenre) params.set("genres", selectedGenre);
    if (id) params.set("platforms", id);
    router.push(`/home?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setSelectedGenre("");
    setSelectedPlatform("");
    router.push("/home");
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const isOnHomePage = pathname === "/home";
  const hasActiveFilters = selectedGenre || selectedPlatform || searchInput;

  return (
    <nav
      className="fixed left-4 right-4 top-4 z-50 rounded-2xl px-6 py-3"
      style={{
        background: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.04)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        {/* Logo */}
        <Link
          href="/home"
          className="text-cyan-400 text-lg font-bold tracking-tight flex-shrink-0 mr-2"
        >
          RawGVaulT
        </Link>

        {/* Search + Filters — only show on home page or always? */}
        <div className="flex-1 flex items-center gap-2">
          {/* Search input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-zinc-800/60 text-white placeholder-zinc-500 px-4 py-2 rounded-lg text-sm border focus:outline-none focus:border-cyan-500 transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.08)" }}
            />
            {/* Search icon */}
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
              🔎︎
            </span>
          </div>

          {/* Genres dropdown */}
          <div className="relative flex-shrink-0" ref={genreRef}>
            <button
              onClick={() => {
                setShowGenres((prev) => !prev);
                setShowPlatforms(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: selectedGenre
                  ? "rgba(6,182,212,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: selectedGenre
                  ? "1px solid rgba(6,182,212,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: selectedGenre ? "rgb(6,182,212)" : "rgb(161,161,170)",
              }}
            >
              {selectedGenre
                ? (genres.find((g) => g.slug === selectedGenre)?.name ??
                  "Genre")
                : "Genres"}
              <span className="text-xs">▾</span>
            </button>

            {/* Genres dropdown menu */}
            {showGenres && (
              <div
                className="absolute top-full mt-2 left-0 w-48 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{
                  background: "rgba(20,20,23,0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handleGenreSelect("")}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    All Genres
                  </button>
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() => handleGenreSelect(genre.slug)}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{
                        color:
                          selectedGenre === genre.slug
                            ? "rgb(6,182,212)"
                            : "rgb(161,161,170)",
                        background:
                          selectedGenre === genre.slug
                            ? "rgba(6,182,212,0.1)"
                            : "transparent",
                      }}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Platforms dropdown */}
          <div className="relative flex-shrink-0" ref={platformRef}>
            <button
              onClick={() => {
                setShowPlatforms((prev) => !prev);
                setShowGenres(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
              style={{
                background: selectedPlatform
                  ? "rgba(6,182,212,0.15)"
                  : "rgba(255,255,255,0.05)",
                border: selectedPlatform
                  ? "1px solid rgba(6,182,212,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
                color: selectedPlatform ? "rgb(6,182,212)" : "rgb(161,161,170)",
              }}
            >
              {selectedPlatform
                ? (platforms.find((p) => String(p.id) === selectedPlatform)
                    ?.name ?? "Platform")
                : "Platforms"}
              <span className="text-xs">▾</span>
            </button>

            {/* Platforms dropdown menu */}
            {showPlatforms && (
              <div
                className="absolute top-full mt-2 left-0 w-48 rounded-xl overflow-hidden z-50 shadow-2xl"
                style={{
                  background: "rgba(20,20,23,0.98)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="max-h-64 overflow-y-auto">
                  <button
                    onClick={() => handlePlatformSelect("")}
                    className="w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    All Platforms
                  </button>
                  {platforms.map((platform) => (
                    <button
                      key={platform.id}
                      onClick={() => handlePlatformSelect(String(platform.id))}
                      className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                      style={{
                        color:
                          selectedPlatform === String(platform.id)
                            ? "rgb(6,182,212)"
                            : "rgb(161,161,170)",
                        background:
                          selectedPlatform === String(platform.id)
                            ? "rgba(6,182,212,0.1)"
                            : "transparent",
                      }}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search button */}
          <button
            onClick={handleSearch}
            className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-4 py-2 rounded-lg transition-colors flex-shrink-0 font-medium"
          >
            Search
          </button>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-zinc-500 hover:text-white text-sm px-3 py-2 rounded-lg transition-colors flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Auth section */}
        <div className="flex items-center gap-3 flex-shrink-0 ml-2">
          {isLoading ? null : isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-cyan-400"
                  style={{
                    background: "rgba(6,182,212,0.15)",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-zinc-500 hover:text-white text-sm px-3 py-2 rounded-lg transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-zinc-400 hover:text-white text-sm transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
