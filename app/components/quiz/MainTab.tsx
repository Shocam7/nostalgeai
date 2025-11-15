'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MainTabProps {
  onAnswer: (answer: string[]) => void;
  answer?: string[];
  currentYear: number | null;
  birthYear: number | null;
  onStartFromBirth: () => void;
  startFromBirth: boolean;
  memoryGradients: Record<string, any>;
  animatingCategoryId: string | null;
}

const memoryClasses = [
  { id: 'movies', name: 'Movies', svg: 'movie.svg' },
  { id: 'tv', name: 'TV Shows', svg: 'tv.svg' },
  { id: 'toons', name: 'Toons', svg: 'toons.svg' },
  { id: 'music', name: 'Music', svg: 'music.svg' },
  { id: 'goals', name: 'Goals', svg: 'goals.svg' },
  { id: 'trips', name: 'Trips', svg: 'travel.svg' },
  { id: 'academics', name: 'Academics', svg: 'academics.svg' },
  { id: 'games', name: 'Video Games', svg: 'games.svg' },
  { id: 'toys', name: 'Toys', svg: 'toy.svg' },
  { id: 'sports', name: 'Sports', svg: 'sports.svg' },
  { id: 'relations', name: 'Relations', svg: 'relations.svg' },
  { id: 'hobbies', name: 'Hobbies', svg: 'hobby.svg' },
  { id: 'purchases', name: 'Purchases', svg: 'buy.svg' },
  { id: 'achievements', name: 'Achievements', svg: 'achieve.svg' },
  { id: 'failures', name: 'Failures', svg: 'fail.svg' },
  { id: 'aesthetic', name: 'Aesthetic', svg: 'nature.svg' }
];

const MainTab = ({ onAnswer, answer, currentYear, birthYear, onStartFromBirth, startFromBirth, memoryGradients, animatingCategoryId }: MainTabProps) => {
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
    <div className="h-full">
      
      {/* Content */}
      <div>
        
        {/* Memory Classes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {memoryClasses.map((memoryClass, index) => {
            const gradient = memoryGradients[memoryClass.id];
            const isSelected = selectedClasses.includes(memoryClass.id);
            const isAnimating = animatingCategoryId === memoryClass.id;
            
            return (
              <motion.button
                key={memoryClass.id}
                layoutId={`memory-${memoryClass.id}`}
                onClick={() => toggleClass(memoryClass.id)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isAnimating ? 1.1 : (isSelected ? 1.05 : 1),
                  zIndex: isAnimating ? 50 : 1
                }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                whileHover={{ scale: isAnimating ? 1.1 : 1.08 }}
                whileTap={{ scale: isAnimating ? 1.1 : 0.95 }}
                className={`
                  group relative p-6 rounded-2xl transition-all duration-300
                  border-2 shadow-lg hover:shadow-xl aspect-square
                  ${isSelected
                    ? `bg-gradient-to-br ${gradient?.from} ${gradient?.to} ${gradient?.border} text-white shadow-2xl` 
                    : 'bg-white border-gray-200 text-slate-700 hover:border-gray-300 hover:bg-gray-50'
                  }
                  ${isAnimating ? 'ring-4 ring-white/50' : ''}
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* SVG Illustration */}
                <div className="mb-4 h-16 w-16 mx-auto flex items-center justify-center">
                  <motion.img 
                    src={`/svg/${memoryClass.svg}`} 
                    alt={`${memoryClass.name} illustration`} 
                    className={`w-full h-full object-contain transition-all duration-300 ${
                      isSelected ? 'brightness-0 invert' : 'opacity-70 group-hover:opacity-100'
                    }`}
                    whileHover={{ rotate: isSelected ? 0 : 5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
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

                {/* Animating overlay */}
                {isAnimating && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Selection Counter */}
        {selectedClasses.length > 0 && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 text-teal-800 rounded-full text-sm font-medium shadow-sm">
              <motion.svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <span style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                {selectedClasses.length} {selectedClasses.length === 1 ? 'category' : 'categories'} selected
              </span>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {selectedClasses.length === 0 && (
          <motion.div 
            className="text-center text-gray-500 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="max-w-md mx-auto">
              <motion.svg 
                className="w-16 h-16 mx-auto mb-4 opacity-50" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                animate={{ 
                  y: [0, -5, 0],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </motion.svg>
              <p className="text-lg mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                Select categories to begin
              </p>
              <p className="text-sm opacity-75">
                Choose the types of memories you'd like to capture from this year
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default MainTab;
