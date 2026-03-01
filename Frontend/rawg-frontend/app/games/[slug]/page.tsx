"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Game, Review } from "@/types";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

export default function GameDetailsPage() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();

  const [game, setGame] = useState<Game | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);

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
        setError("Game not found.");
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
        setReviews(response.data.data ?? response.data);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setReviews([]);
        } else {
          console.error("Failed to load reviews", e);
        }
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [slug]);

  const handleReviewSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setReviewError(null);
    setReviewSuccess(false);

    try {
      await api.post("/reviews", {
        rawg_id: game?.id,
        name: game?.name,
        slug: game?.slug,
        background_image: game?.background_image,
        rating,
        review_text: reviewText,
      });

      setReviewSuccess(true);
      setReviewText("");
      setRating(5);

      const response = await api.get(`/games/${slug}/reviews`);
      setReviews(response.data.data ?? response.data);
    } catch (e: any) {
      const errors = e?.response?.data?.errors;
      if (errors) {
        const firstError = Object.values(errors)[0] as string[];
        setReviewError(firstError[0]);
      } else {
        setReviewError(
          e?.response?.data?.message ?? "Failed to submit review.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingGames) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-2 border-cyan-500 animate-spin"></div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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

      <div className="mb-12">
        <h2 className="text-white text-xl font-semibold mb-6">
          Leave a Review
        </h2>
      </div>

      {!isAuthenticated ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
          <p className="text-zinc-400 mb-4">Login to leave a review.</p>
          <a
            href="/login"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors inline-block"
          >
            Sign in
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleReviewSubmit}
          className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col gap-5"
        >
          {reviewSuccess && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
              Review submitted successfully!
            </div>
          )}

          {reviewError && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
              {reviewError}
            </div>
          )}
          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">
              Rating:{" "}
              <span className="text-white font-semibold">{rating} / 10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="accent-cyan-600"
            />
            <div className="flex justify-between text-zinc-600 text-xs">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-zinc-400 text-sm">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              required
              rows={4}
              minLength={10}
              maxLength={1000}
              placeholder="What did you think of this game?"
              className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-800 transition-colors resize-none"
            />
            <span className="text-zinc-600 text-xs text-right">
              {reviewText.length} / 1000
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-cyan-800 hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
          >
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-12">
        <h2 className="text-white text-xl font-semibold mb-6">
          Reviews {reviews.length > 0 && `(${reviews.length})`}
        </h2>

        {isLoadingReviews && (
          <div className="flex justify-center py-8">
            <div className="border-2 border-cyan-500 border-t-transparent animate-spin" />
          </div>
        )}

        {!isLoadingReviews && reviews.length === 0 && (
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
                  {review.review_text}
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
