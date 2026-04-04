'use client';

import Link from 'next/link';
import SoftAurora from '@/components/SoftAurora';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative h-screen flex items-center justify-center overflow-hidden">

      <div className="fixed inset-0 -z-10">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={1}
          color1="#00ffff"
          color2="#06b6d4"
          noiseFrequency={2.5}
          noiseAmplitude={1}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.25}
        />
      </div>

      <div
        className="fixed inset-0 -z-10"
        style={{
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
        }}
      />

      <div
        className="relative z-10 text-center px-6 flex flex-col items-center"
        style={{
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.8s ease, transform 0.8s ease",
        }}
      >

        <div
          className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-cyan-400"
            style={{ boxShadow: "0 0 6px rgb(34,211,238)" }}
          />
          Game Discovery Platform
        </div>


        <h1 className="text-7xl font-bold text-white mb-4 tracking-tight leading-none">
          RawG
          <span
            style={{
              background: "linear-gradient(135deg, #06b6d4, #00ffff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            VaulT
          </span>
        </h1>

        <p className="text-zinc-400 text-lg mb-3 max-w-md mx-auto leading-relaxed">
          Where greatness is discovered, all in one place.
        </p>

        <p className="text-zinc-600 text-sm mb-10 max-w-sm mx-auto">
          Explore thousands of games, track your favourites, and get personalised recommendations.
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="/home"
            className="relative px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #00ffff)",
              boxShadow: "0 0 40px rgba(6,182,212,0.5)",
            }}
          >
            Browse Games
          </Link>

          <Link
            href="/register"
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              backdropFilter: "blur(8px)",
            }}
          >
            Create Account
          </Link>
        </div>

        <div
          className="flex items-center gap-8 mt-16 px-8 py-4 rounded-2xl"
          style={{
            background: "rgba(6,182,212,0.05)",
            border: "1px solid rgba(6,182,212,0.15)",
            backdropFilter: "blur(12px)",
          }}
        >
          {[
            { label: "Games", value: "500+" },
            { label: "Genres", value: "20+" },
            { label: "Platforms", value: "15+" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)",
        }}
      />
    </main>
  );
}