"use client";
import { useAuth } from "@/contexts/AuthContext";
import { Game } from "@/types";
import { useEffect, useState, useCallback } from "react";
import GameCard from "./GameCard";
import api from "@/lib/api";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

interface Recommendation {
  game: Game;
  score: number;
  explanation: string;
}

export default function RecommendedForYou() {
  const { isAuthenticated } = useAuth();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      slidesToScroll: 1,
    },
    [Autoplay({ delay: 3000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchRecommendations = async () => {
      try {
        const response = await api.get("/recommendations");
        setRecommendations(response.data);
      } catch (e) {
        setError("Failed to load recommendations.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  const maxScore = Math.max(...recommendations.map((r) => r.score));

  return (
    <section className="py-10">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-3 mb-6">
        <h2 className="text-3xl font-light text-white">Recommended <span className="text-cyan-400 font-extralight">For YOU</span></h2>
        <p className="text-zinc-400 text-sm mt-1">
          Personalised picks based on your taste
        </p>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}

      {/* Carousel */}
      {!isLoading && !error && recommendations.length > 0 && (
        <>
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-6 px-6">
              {recommendations.map((rec, index) => {
                const isActive = index === selectedIndex;
                const matchPercent = Math.min(
                  Math.round((rec.score / maxScore) * 99),
                  99
                );

                return (
                  <div
                    key={rec.game.id}
                    className="flex-none flex flex-col gap-3"
                    style={{
                      width: "360px",
                      opacity: isActive ? 1 : 0.35,
                      transform: isActive ? "scale(1)" : "scale(0.93)",
                      transition: "opacity 0.4s ease, transform 0.4s ease",
                    }}
                  >
                    <GameCard game={rec.game} />
                    
                    <div
                      className="flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        opacity: isActive ? 1 : 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <p className="text-xs text-zinc-400">
                        {rec.explanation}
                      </p>
                      <div
                        className="flex items-center gap-1.5 ml-3 px-2 py-1 rounded-full flex-shrink-0"
                        style={{
                          background: "rgba(6, 182, 212, 0.1)",
                          border: "1px solid rgba(6, 182, 212, 0.2)",
                        }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span className="text-xs font-bold text-cyan-400">
                          {matchPercent}% match
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {recommendations.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: selectedIndex === index ? "24px" : "6px",
                  height: "6px",
                  background:
                    selectedIndex === index
                      ? "rgb(6, 182, 212)"
                      : "rgba(255,255,255,0.15)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}