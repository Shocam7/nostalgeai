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
    <div className="flex flex-col h-full w-full">
      
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
          {memoryClasses.map((memoryClass) => (
            <button
              key={memoryClass.id}
              onClick={() => toggleClass(memoryClass.id)}
              className={`
                relative p-8 rounded-2xl transition-all duration-300 transform hover:scale-105
                border-2 shadow-lg hover:shadow-xl aspect-square
                ${selectedClasses.includes(memoryClass.id)
                  ? 'bg-gradient-to-br from-teal-600 to-cyan-600 border-teal-500 text-white shadow-teal-200'
                  : 'bg-white border-gray-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50'
                }
              `}
            >
              {/* SVG Illustration */}
              <div className="mb-4 h-20 w-20 mx-auto flex items-center justify-center">
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
          ))}
        </div>

        {/* Selection Counter */}
        {selectedClasses.length > 0 && (
          <div className="mt-8 text-center">
            <div className="inline-block px-4 py-2 bg-teal-100 text-teal-800 rounded-full text-sm font-medium">
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
