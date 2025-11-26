// app/memories/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MoviesManager from "@/app/components/MoviesManager";
import { BatCard } from "@/app/components/CartoonUI";

const memoryClasses = [
  { id: 'movies', name: 'Movies', svg: '🎬' },
  { id: 'tv', name: 'TV Shows', svg: '📺' },
  { id: 'toons', name: 'Toons', svg: '🐰' },
  { id: 'music', name: 'Music', svg: '🎵' },
  { id: 'goals', name: 'Goals', svg: '🎯' },
  { id: 'trips', name: 'Trips', svg: '✈️' },
  { id: 'academics', name: 'Academics', svg: '📚' },
  { id: 'games', name: 'Video Games', svg: '🎮' },
  { id: 'toys', name: 'Toys', svg: '🧸' },
  { id: 'sports', name: 'Sports', svg: '🏀' },
  { id: 'relations', name: 'Relations', svg: '❤️' },
  { id: 'hobbies', name: 'Hobbies', svg: '🎨' },
  { id: 'purchases', name: 'Purchases', svg: '🛍️' },
  { id: 'achievements', name: 'Achievements', svg: '🏆' },
  { id: 'failures', name: 'Failures', svg: '💀' },
  { id: 'aesthetic', name: 'Aesthetic', svg: '✨' }
];

export default function MemoriesPage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);

  if (selectedClass === "movies") {
    return <MoviesManager onBack={() => setSelectedClass(null)} />;
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* Header Title */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16 relative"
      >
        {/* Bat Symbol Shape (CSS approximation or SVG) */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-64 h-32 bg-yellow-500/10 blur-3xl rounded-full" />
        
        <h1 className="text-6xl md:text-9xl text-[#FFD700] drop-shadow-[5px_5px_0px_#000] tracking-wider z-10 relative">
          BAT-ARCHIVE
        </h1>
        <p className="text-xl md:text-2xl mt-2 text-gray-400 font-['Rajdhani'] uppercase tracking-[0.5em] border-t border-gray-700 pt-2">
          Wayne Enterprises Secure Storage
        </p>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {memoryClasses.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <BatCard
              onClick={() => setSelectedClass(item.id)}
              className="aspect-square flex flex-col items-center justify-center gap-4 bg-[#151515]"
            >
              <div className="text-6xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] grayscale group-hover:grayscale-0 transition-all duration-300">
                {item.svg}
              </div>
              <span className="text-xl font-bold font-['Bangers'] tracking-widest text-gray-500 group-hover:text-[#FFD700] uppercase transition-colors">
                {item.name}
              </span>
            </BatCard>
          </motion.div>
        ))}
      </div>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 w-full h-2 bg-[#FFD700]" />
    </div>
  );
}
