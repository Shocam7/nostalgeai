// components/quiz/MainTab.tsx
'use client';

import { useState } from 'react';

interface MainTabProps {
  onAnswer: (answer: string[]) => void;
  answer?: string[];
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

const MainTab = ({ onAnswer, answer }: MainTabProps) => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(answer || []);

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
    <div className="flex flex-col items-center text-center max-w-4xl w-full">
      
      {/* Question Text */}
      <div className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 mb-4 leading-tight"
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
          What kind of memories would you like to capture?
        </h2>
        <p className="text-lg text-slate-600">
          Select all that apply - you can always change this later
        </p>
      </div>

      {/* Memory Classes Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-3xl">
        {memoryClasses.map((memoryClass) => (
          <button
            key={memoryClass.id}
            onClick={() => toggleClass(memoryClass.id)}
            className={`
              relative p-6 rounded-2xl transition-all duration-300 transform hover:scale-105
              border-2 shadow-lg hover:shadow-xl
              ${selectedClasses.includes(memoryClass.id)
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 border-amber-500 text-white shadow-amber-200'
                : 'bg-white border-gray-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
              }
            `}
          >
            {/* SVG Illustration */}
            <div className="mb-3 h-16 w-16 mx-auto flex items-center justify-center">
              <img 
                src={`/svg/${memoryClass.svg}`} 
                alt={`${memoryClass.name} illustration`} 
                className="w-full h-full object-contain"
              />
            </div>

            {/* Class Name */}
            <span className="text-sm font-medium block"
                  style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              {memoryClass.name}
            </span>

            {/* Selection Indicator */}
            {selectedClasses.includes(memoryClass.id) && (
              <div className="absolute top-2 right-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Selection Counter */}
      {selectedClasses.length > 0 && (
        <div className="mt-6 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
          {selectedClasses.length} {selectedClasses.length === 1 ? 'category' : 'categories'} selected
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-10 left-8 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-32 right-12 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-16 w-4 h-4 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default MainTab;
