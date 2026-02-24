import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.slug}`}>
      <div className="bg-zinc-900 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-200 cursor-pointer">
    
        <div className="relative w-full h-48">
          {game.background_image ? (
            <Image
              src={game.background_image}
              alt={game.name}
              fill
              className="object-cover"
            />
          ) : (
   
            <div className="w-full h-full bg-zinc-800 flex items-center justify-center">
              <span className="text-zinc-600 text-sm">No Image</span>
            </div>
          )}
        </div>

 
        <div className="p-4">
          <h2 className="text-white font-semibold text-sm truncate">
            {game.name}
          </h2>

          <div className="flex items-center justify-between mt-2">

            <span className="text-yellow-400 text-xs">
              ⭐ {game.rating.toFixed(1)}
            </span>


            {game.released && (
              <span className="text-zinc-500 text-xs">
                {new Date(game.released).getFullYear()}
              </span>
            )}
          </div>


          <div className="flex flex-wrap gap-1 mt-2">
            {game.genres.slice(0, 2).map((genre) => (
              <span
                key={genre.id}
                className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 rounded-full"
              >
                {genre.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
