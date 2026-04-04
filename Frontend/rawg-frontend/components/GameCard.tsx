import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10"
        style={{
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        {/* Game Image */}
        <div className="relative w-full h-48 overflow-hidden">
          {game.background_image ? (
            <>
              <Image
                src={game.background_image}
                alt={game.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Gradient overlay on image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full bg-zinc-800/50 flex items-center justify-center">
              <span className="text-zinc-600 text-sm">No Image</span>
            </div>
          )}

          {/* Rating badge floating on image */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold"
            style={{
              background: "rgba(0,0,0,0.5)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(8px)",
              color: "#facc15",
            }}
          >
            ⭐ {Number(game.rating).toFixed(1)}
          </div>
        </div>

        {/* Card content */}
        <div className="p-4 relative">

          {/* Subtle inner glow on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at top, rgba(6,182,212,0.05) 0%, transparent 70%)",
            }}
          />

          {/* Game title */}
          <h2 className="text-white font-semibold text-sm truncate mb-3 leading-snug">
            {game.name}
          </h2>

          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {(game.genres ?? []).slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  color: "rgba(6, 182, 212, 0.9)",
                }}
              >
                {genre.name}
              </span>
            ))}
          </div>

          {/* Footer — release year */}
          {game.released && (
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-zinc-500 text-xs">
                {new Date(game.released).getFullYear()}
              </span>
            </div>
          )}
        </div>

        {/* Bottom border glow on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(6,182,212,0.5), transparent)",
          }}
        />
      </div>
    </Link>
  );
}