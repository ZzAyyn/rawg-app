"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Game, Review } from "@/types";
import Image from "next/image";
import { spawn } from "child_process";

export default function GameDetailsPage() {
  const { slug } = useParams();

  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // implementation to fetch game details
  useEffect(() => {
    if (!slug) {
      return;
    }

    const fetchGame = async () => {
      try {
        const response = await api.get(`/games/${slug}`);
        setGame(response.data);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setReviews([]);
        } else {
          console.error('Failed to load reviews', e);
        }
      } finally {
        setIsLoadingGames(false);
      }
    };

    fetchGame();
  }, [slug]);

  // implementation to fetch reviews for each game
  useEffect(() => {
    if (!slug) {
      return;
    }

    const fetchReviews = async () => {
      try {
        const response = await api.get(`/games/${slug}/reviews`);
        setReviews(response.data.data);
      } catch (e) {
        console.error("Failed to load reviews", e);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [slug]);

  if (isLoadingGames) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-cyan-500 animate-spin"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex justify-center items-centerm min-h-screen">
        <p className="text-red-400">{error ?? "Something went wrong."}</p>
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-12">
      {game.background_image && (
        <div className="relative w-full h-72 rounded-2xl overflow-hidden mb-8">
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent"></div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-white text-4xl font-bold mb-3">{game.name}</h1>

        <div className="flex flex-wrap gap-4 text-sm mb-4">
          <span className="text-yellow-400">
            ⭐ {game.rating.toFixed(1)} / 5
          </span>
          {game.metacritic && (
            <span className="bg-green-600 text-white px-2 py-0.5 rounded font-semibold">
              Metacritic: {game.metacritic}
            </span>
          )}
          {game.released && (
            <span className="text-zinc-400">
              Released: {new Date(game.released).toLocaleDateString()}
            </span>
          )}
        </div>

        <div>
          {game.genres.map((genre) => (
            <span
              key={genre.id}
              className="bg-zinc-700 text-zinc-300 text-xs px-3 py-1 rounded-full"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <div>
          {game.platforms.map(({ platform }) => (
            <span
              key={platform.id}
              className="bg-zinc-800 text-zinc-400 text-xs px-3 py-1 rounded-full border border-zinc-700"
            >
              {platform.name}
            </span>
          ))}
        </div>
      </div>

      {game.description_raw && (
        <div className="mb-12">
          <h2 className="text-white text-xl font-semibold mb-3">About</h2>
          <p className="text-zinc-400 leading-relaxed">
            {game.description_raw.slice(0, 600)}
            {game.description_raw.length > 600 && "..."}
          </p>
        </div>
      )}

      <div>
        <h2 className="text-white text-xl font-semibold mb-6">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {isLoadingReviews && (
          <div className="flex justify-center py-8">
            <div className="border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        )}

        {isLoadingReviews && reviews.length === 0 && (
          <p className="text-zinc-500">No reviews found.</p>
        )}

        {!isLoadingReviews && reviews.length > 0 && (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">
                    {review.user?.name ?? "Anonymous"}
                  </span>
                  <span className="text-yellow-400 font-semibold">
                    {review.rating} / 10
                  </span>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {review.body}
                </p>
                <p className="text-zinc-600 text-xs mt-3">
                  {new Date(review.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
