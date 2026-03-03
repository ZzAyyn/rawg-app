"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { Profile, Favourite, Review } from "@/types";
import api from "@/lib/api";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";

type Tab = "profile" | "favourites" | "reviews";

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  // Profile related usestates
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Favourites related usestates
  const [favourites, setFavourites] = useState<Favourite[]>([]);
  const [isLoadingFavourites, setIsLoadingFavourites] = useState(true);

  // Reviews related usestates ig
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editRating, setEditRating] = useState<number>(5);
  const [editText, setEditText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // useEffect to fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/profile");
        setProfile(response.data);
        setBio(response.data.bio ?? "");
        setLocation(response.data.location ?? "");
        setWebsite(response.data.website ?? "");
      } catch {
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, []);

  // useEffect to fetch favourites by the user
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const response = await api.get("/favourites");
        setFavourites(response.data);
      } catch {
        console.error("Failed to load favourites.");
      } finally {
        setIsLoadingFavourites(false);
      }
    };

    fetchFavourites();
  }, []);

  // useEffect to fetch Reviews by the user
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/my-reviews");
        setReviews(response.data);
      } catch {
        console.error("Failed to load reviews.");
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  // Save Profile
  const handleSaveProfile = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileError(null);
    setProfileSuccess(false);

    try {
      const response = await api.post("/profile", { bio, location, website });
      setProfile(response.data);
      setProfileSuccess(true);
    } catch (e: any) {
      setProfileError(e?.response?.data?.message ?? "Failed to save profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleRemoveFavourite = async (rawgId: number) => {
    try {
      await api.delete(`/favourites/${rawgId}`);
      setFavourites((prev) => prev.filter((f) => f.game?.rawg_id !== rawgId));
    } catch (e){
      console.error("Failed to remove favourite", e);
    }
  };

  const handleEditReview = (review: Review) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditText(review.review_text);
  };

  const handleUpdateReview = async (reviewId: number) => {
    setIsUpdating(true);
    try {
      const response = await api.put(`/reviews/${reviewId}`, {
        rating: editRating,
        review_text: editText,
      });

      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? response.data : r)),
      );
      setEditingReviewId(null);
    } catch (e: any) {
      console.error("Failed to update review", e);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch {
      console.error("Failed to delete review");
    }
  };

  return (
    <div>
      <ProtectedRoute>
        <main className="max-w-4xl mx-auto px-6 py-12">
          <div className="mb-8">
            <h1 className="text-white text-3xl font-bold">Dashboard</h1>
            <p className="text-zinc-400 mt-1">Welcome back, {user?.name}</p>
          </div>

          <div className="flex gap-2 mb-8 border-b border-zinc-800 pb-0">
            {(["profile", "favourites", "reviews"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  activeTab === tab
                    ? "text-cyan-400 border-cyan-400"
                    : "text-zinc-500 border-transparent hover:text-zinc-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'profile' && (
            <div>
              {isLoadingProfile ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-cyan-500 animate-spin" />
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-5 max-w-lg">
                  {profileSuccess && (
                    <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-lg">
                      Profile saved successfully!
                    </div>
                  )}

                  {profileError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-lg">
                      {profileError}
                    </div>
                  )}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-sm">Name</label>
                    <input 
                      type="text"
                      value={user?.name ?? ''}
                      disabled
                      className="bg-zinc-800/50 text-zinc-500 px-4 py-2.5 rounded-lg border border-zinc-700 cursor-not-allowed" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-sm">Email</label>
                    <input 
                      type="text"
                      value={user?.email ?? ''}
                      disabled
                      className="bg-zinc-800/50 text-zinc-500 px-4 py-2.5 rounded-lg border border-zinc-700 cursor-not-allowed" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-sm">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      placeholder="Tell us about yourself..."
                      className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors resize-none" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-sm">Location</label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Russia"
                      className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors" 
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 text-sm">Website</label>
                    <input 
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="bg-zinc-800 text-white placeholder-zinc-600 px-4 py-2.5 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors" 
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}      
                  </button>
                </form>
              )}
            </div>
          )}

          {activeTab === 'favourites' && (
            <div>
              {isLoadingFavourites ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-cyan-500 animate-spin"/>
                </div>
              ) : favourites.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500 mb-4">No favourites yet.</p>
                  <Link
                    href="/home"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                  >
                    Browse Games
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {favourites.map((favourite) => (
                    <div
                      key={favourite.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        {favourite.game?.background_image && (
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={favourite.game.background_image}
                              alt={favourite.game?.name ?? 'Game'}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <p className="text-white font-medium">
                            {favourite.game?.name ?? `Game #${favourite.game_id}`}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveFavourite(favourite.game?.rawg_id ?? favourite.game_id)}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors"
                      >
                        Remove
                      </button>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {isLoadingReviews ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-cyan-500 animate-spin"/>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-zinc-500 mb-4">You haven't reviewed any games yet.</p>
                  <Link
                    href="/home"
                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg transition-colors inline-block"
                  >
                    Browse Games
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-zinc-900 border border-zinc-800 rounded-xl p-5"
                    >
                      <p className="text-zinc-500 text-xs mb-2">
                        {review.game?.name ?? `Game #${review.game_id}`}
                      </p>

                      {editingReviewId === review.id ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-zinc-400 text-sm">
                              Rating: <span className="text-white font-semibold">{editRating} / 10</span>
                            </label>
                            <input 
                              type="range"
                              min={1}
                              max={10}
                              value={editRating}
                              onChange={(e) => setEditRating(Number(e.target.value))}
                              className="accent-cyan-500"
                            />
                          </div>

                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={3}
                            className="bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                          />

                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateReview(review.id)}
                              disabled={isUpdating}
                              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-sm px-4 py-2 rounded-lg transition-colors"
                            >
                              {isUpdating ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingReviewId(null)}
                              className="text-zinc-400 hover:text-zinc-200 text-sm px-4 py-2 rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>


                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span>{review.rating} / 10</span>
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleEditReview(review)}
                                className="text-zinc-400 hover:text-white text-sm transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review.id)}
                                className="text-red-400 hover:text-red-300 text-sm transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <p className="text-zinc-300 text-sm leading-relaxed">{review.review_text}</p>
                          <p className="text-zinc-300 text-sm leading-relaxed">{new Date(review.created_at).toLocaleDateString()}</p>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </ProtectedRoute>
    </div>
  );
}
