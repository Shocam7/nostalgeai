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
    <div className="min-h-full">
      
      {/* Skip 5 Years Notice */}
      {currentYear && birthYear && currentYear === birthYear + 5 && !startFromBirth && (
        <div className="mb-8 text-center">
          <div className="inline-block px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm">
            <p className="text-amber-800 max-w-md" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              <span className="font-medium">We skipped your first 5 years.</span>
              {' '}
              <button 
                onClick={onStartFromBirth}
                className="underline hover:no-underline font-semibold text-amber-900 hover:text-amber-700 transition-colors duration-200"
              >
                Click here
              </button>
              {' '}if you have memories from that time.
            </p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 leading-tight mb-4"
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
          What kind of memories would you like to capture?
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto"
           style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
          Select the categories that resonate with your experiences from this year
        </p>
      </div>

      {/* Memory Classes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {memoryClasses.map((memoryClass) => {
          const gradient = memoryGradients[memoryClass.id];
          const isSelected = selectedClasses.includes(memoryClass.id);
          
          return (
            <button
              key={memoryClass.id}
              onClick={() => toggleClass(memoryClass.id)}
              className={`
                group relative p-6 rounded-2xl transition-all duration-300 transform 
                border-2 shadow-lg hover:shadow-xl aspect-square
                ${isSelected
                  ? `bg-gradient-to-br ${gradient.from} ${gradient.to} ${gradient.border} text-white scale-105 shadow-2xl` 
                  : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50 hover:scale-105'
                }
              `}
            >
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}

              {/* SVG Illustration */}
              <div className="mb-4 h-16 w-16 mx-auto flex items-center justify-center">
                <img 
                  src={`/svg/${memoryClass.svg}`} 
                  alt={`${memoryClass.name} illustration`} 
                  className={`w-full h-full object-contain transition-all duration-300 ${
                    isSelected ? 'brightness-0 invert' : 'opacity-70 group-hover:opacity-100'
                  }`}
                />
              </div>

              {/* Class Name */}
              <span className={`text-sm font-medium block transition-all duration-300 ${
                isSelected ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
              }`}
                    style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                {memoryClass.name}
              </span>

              {/* Hover effect overlay */}
              {!isSelected && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100/20 to-gray-200/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection Counter */}
      {selectedClasses.length > 0 && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 rounded-full text-sm font-medium shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              {selectedClasses.length} {selectedClasses.length === 1 ? 'category' : 'categories'} selected
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedClasses.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          <div className="max-w-md mx-auto">
            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-lg mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              Select categories to begin
            </p>
            <p className="text-sm opacity-75">
              Choose the types of memories you'd like to capture from this year
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainTab;
