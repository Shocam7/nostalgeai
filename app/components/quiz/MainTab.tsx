// components/quiz/MainTab.tsx
'use client';

import { useState, useMemo } from 'react';

interface MainTabProps {
  onAnswer: (answer: string[]) => void;
  answer?: string[];
  currentYear: number | null;
  birthYear: number | null;
  onStartFromBirth: () => void;
  startFromBirth: boolean;
}

const memoryClasses = [
  { id: 'movies', name: 'Movies', svg: 'movie.svg' },
  { id: 'tv', name: 'TV Shows', svg: 'tv.svg' },
  { id: 'music', name: 'Music', svg: 'music.svg' },
  { id: 'goals', name: 'Goals', svg: 'goals.svg' },
  { id: 'trips', name: 'Trips', svg: 'travel.svg' },
  { id: 'academics', name: 'Academics', svg: 'academics.svg' },
  { id: 'games', name: 'Games', svg: 'games.svg' },
  { id: 'sports', name: 'Sports', svg: 'sports.svg' },
  { id: 'relations', name: 'Relations', svg: 'relations.svg' },
  { id: 'hobbies', name: 'Hobbies', svg: 'hobby.svg' },
  { id: 'purchases', name: 'Purchases', svg: 'buy.svg' },
  { id: 'achievements', name: 'Achievements', svg: 'achieve.svg' },
  { id: 'failures', name: 'Failures', svg: 'fail.svg' },
  { id: 'aesthetic', name: 'Aesthetic', svg: 'nature.svg' }
];

// Predefined gradient combinations
const gradientOptions = [
  { from: 'from-red-500', to: 'to-pink-600', border: 'border-red-500', shadow: 'shadow-red-200' },
  { from: 'from-blue-500', to: 'to-indigo-600', border: 'border-blue-500', shadow: 'shadow-blue-200' },
  { from: 'from-green-500', to: 'to-emerald-600', border: 'border-green-500', shadow: 'shadow-green-200' },
  { from: 'from-yellow-500', to: 'to-orange-600', border: 'border-yellow-500', shadow: 'shadow-yellow-200' },
  { from: 'from-purple-500', to: 'to-violet-600', border: 'border-purple-500', shadow: 'shadow-purple-200' },
  { from: 'from-pink-500', to: 'to-rose-600', border: 'border-pink-500', shadow: 'shadow-pink-200' },
  { from: 'from-cyan-500', to: 'to-blue-600', border: 'border-cyan-500', shadow: 'shadow-cyan-200' },
  { from: 'from-lime-500', to: 'to-green-600', border: 'border-lime-500', shadow: 'shadow-lime-200' },
  { from: 'from-orange-500', to: 'to-red-600', border: 'border-orange-500', shadow: 'shadow-orange-200' },
  { from: 'from-teal-500', to: 'to-cyan-600', border: 'border-teal-500', shadow: 'shadow-teal-200' },
  { from: 'from-indigo-500', to: 'to-purple-600', border: 'border-indigo-500', shadow: 'shadow-indigo-200' },
  { from: 'from-rose-500', to: 'to-pink-600', border: 'border-rose-500', shadow: 'shadow-rose-200' },
  { from: 'from-emerald-500', to: 'to-teal-600', border: 'border-emerald-500', shadow: 'shadow-emerald-200' },
  { from: 'from-violet-500', to: 'to-purple-600', border: 'border-violet-500', shadow: 'shadow-violet-200' }
];

// Function to generate a consistent random number based on a string seed
const seededRandom = (seed: string): number => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
};

// Get user session ID (generates fresh on every page load)
const getUserSessionId = (): string => {
  if (typeof window !== 'undefined') {
    // Generate a new session ID every time (no persistence across reloads)
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
  return `default-session-${Math.random().toString(36).substr(2, 9)}`;
};

const MainTab = ({ onAnswer, answer, currentYear, birthYear, onStartFromBirth, startFromBirth }: MainTabProps) => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(answer || []);
  
  // Generate consistent gradients for each memory class based on user session
  const memoryGradients = useMemo(() => {
    const sessionId = getUserSessionId();
    const gradients: Record<string, typeof gradientOptions[0]> = {};
    
    memoryClasses.forEach((memoryClass) => {
      const seed = `${sessionId}-${memoryClass.id}`;
      const randomIndex = seededRandom(seed) % gradientOptions.length;
      gradients[memoryClass.id] = gradientOptions[randomIndex];
    });
    
    return gradients;
  }, []); // Empty dependency array ensures this only runs once per component mount

  const toggleClass = (classId: string) => {
    let newSelection;
    if (selectedClasses.includes(classId)) {
      newSelection = selectedClasses.filter(id => id !== classId);
    } else {
      newSelection = [...selectedClasses, classId];
    }
    setSelectedClasses(newSelection);
    onAnswer(newSelection);
  };

  return (
    <div className="flex flex-col h-full w-full">
      
      {/* Skip 5 Years Notice */}
      {currentYear && birthYear && currentYear === birthYear + 5 && !startFromBirth && (
        <div className="mb-6 text-center">
          <div className="inline-block px-6 py-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-sm text-amber-800" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              Yes, we know we skipped 5 years of your life.{' '}
              <button 
                onClick={onStartFromBirth}
                className="underline hover:no-underline font-semibold text-amber-900 hover:text-amber-700 transition-colors"
              >
                Click here
              </button>
              {' '}if you remember that time.
            </p>
          </div>
        </div>
      )}
      
      {/* Sticky Header */}
      <div className="sticky top-0 bg-white z-20 pb-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 leading-tight"
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            What kind of memories would you like to capture?
          </h2>
        </div>
      </div>

      {/* Scrollable Memory Classes Grid */}
      <div className="flex-1 overflow-y-auto pb-6">
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg mx-auto">
          {memoryClasses.map((memoryClass) => {
            const gradient = memoryGradients[memoryClass.id];
            const isSelected = selectedClasses.includes(memoryClass.id);
            
            return (
              <button
                key={memoryClass.id}
                onClick={() => toggleClass(memoryClass.id)}
                className={`
                  relative p-8 rounded-2xl transition-all duration-300 transform hover:scale-105
                  border-2 shadow-lg hover:shadow-xl aspect-square
                  ${isSelected
                    ? `bg-gradient-to-br ${gradient.from} ${gradient.to} ${gradient.border} text-white ${gradient.shadow}`
                    : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                `}
              >
                {/* SVG Illustration */}
                <div className="mb-3 h-24 w-24 mx-auto flex items-center justify-center">
                  <img 
                    src={`/svg/${memoryClass.svg}`} 
                    alt={`${memoryClass.name} illustration`} 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Class Name */}
                <span className="text-base font-medium block"
                      style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {memoryClass.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selection Counter */}
        {selectedClasses.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
              {selectedClasses.length} {selectedClasses.length === 1 ? 'category' : 'categories'} selected
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      <div className="absolute top-10 left-8 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-12 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
    </div>
  );
};

export default MainTab;
