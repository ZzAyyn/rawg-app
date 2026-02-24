'use client';

import Link from 'next/link';
import RippleGrid from '@/components/RippleGrid';

export default function LandingPage() {
  return (
    <main className="relative h-screen flex items-center justify-center overflow-hidden">
      
      <div className="absolute inset-0">
        <RippleGrid
          enableRainbow={false}
          gridColor="#48cae4"
          rippleIntensity={0.01}
          gridSize={10}
          gridThickness={15}
          mouseInteraction={false}
          mouseInteractionRadius={1.2}
          opacity={0.4}
        />
      </div>

      <div className="relative z-10 text-center px-6">
        <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
          RawG<span className="text-[#023e8a]">VaulT</span>
        </h1>
        <p className="text-zinc-400 text-lg mb-8 max-w-md mx-auto">
          Where greatness is discovered, all in one place.
        </p>
        <Link
          href="/home"
          className="bg-gray-900 hover:bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors duration-200 inline-block"
        >
          Browse Games →
        </Link>
      </div>

    </main>
  );
}