// app/memories/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import MoviesManager from "@/app/components/MoviesManager";
import { CartoonCard } from "@/app/components/CartoonUI";

// Define the memory classes
const memoryClasses = [
  { id: 'movies', name: 'Movies', svg: '🎬' }, // Using emojis for simplicity in code, replace with your SVGs
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

  if (selectedClass) {
    // Placeholder for other classes
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-4xl font-black">Coming Soon!</h1>
        <button 
          onClick={() => setSelectedClass(null)}
          className="border-4 border-black bg-white px-6 py-2 rounded-xl font-bold hover:bg-red-100"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center mb-16"
      >
        <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#23A6F0] to-[#FF90E8] drop-shadow-[4px_4px_0px_black] tracking-tight">
          MEMORY LAND
        </h1>
        <p className="text-xl md:text-2xl font-bold mt-4 text-gray-700">
          Where your brain keeps its toys 🧸
        </p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {memoryClasses.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <CartoonCard
              onClick={() => setSelectedClass(item.id)}
              className="aspect-square flex flex-col items-center justify-center gap-4 group bg-[#FFF]"
            >
              {/* If you have real SVG files, use <img src={`/icons/${item.svg}`} /> */}
              <div className="text-6xl group-hover:scale-125 transition-transform duration-300 filter drop-shadow-md">
                {item.svg}
              </div>
              <span className="text-xl font-black uppercase tracking-wider text-center group-hover:text-[#23A6F0] transition-colors">
                {item.name}
              </span>
              
              {/* Decorative dots */}
              <div className="absolute top-2 left-2 w-3 h-3 bg-black rounded-full opacity-20" />
              <div className="absolute top-2 right-2 w-3 h-3 bg-black rounded-full opacity-20" />
              <div className="absolute bottom-2 left-2 w-3 h-3 bg-black rounded-full opacity-20" />
              <div className="absolute bottom-2 right-2 w-3 h-3 bg-black rounded-full opacity-20" />
            </CartoonCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
