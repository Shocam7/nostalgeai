// components/quiz/BirthDateTab.tsx
'use client';

import { useState } from 'react';

interface BirthDateTabProps {
  onAnswer: (answer: string) => void;
  answer?: string;
}

const BirthDateTab = ({ onAnswer, answer }: BirthDateTabProps) => {
  const [birthDate, setBirthDate] = useState(answer || '');

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setBirthDate(date);
    onAnswer(date);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-2xl w-full">
      
      {/* SVG Illustration */}
      <div className="mb-8 w-64 h-64 flex items-center justify-center">
        {/* Baby SVG - Using inline SVG since we can't import external files */}
        <svg 
          width="256" 
          height="256" 
          viewBox="0 0 400 300" 
          className="w-full h-full"
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Baby illustration - simplified version */}
          <defs>
            <linearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf87" />
              <stop offset="100%" stopColor="#f4a261" />
            </linearGradient>
            <linearGradient id="clothesGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e63946" />
              <stop offset="100%" stopColor="#d62828" />
            </linearGradient>
          </defs>
          
          {/* Baby body */}
          <ellipse cx="200" cy="220" rx="45" ry="35" fill="url(#clothesGradient)" />
          
          {/* Baby head */}
          <circle cx="200" cy="140" r="55" fill="url(#skinGradient)" />
          
          {/* Hair */}
          <path d="M160 105 Q200 85 240 105 Q235 95 200 90 Q165 95 160 105 Z" fill="#8b4513" />
          
          {/* Eyes */}
          <circle cx="185" cy="135" r="4" fill="#2c3e50" />
          <circle cx="215" cy="135" r="4" fill="#2c3e50" />
          <circle cx="186" cy="133" r="1.5" fill="white" />
          <circle cx="216" cy="133" r="1.5" fill="white" />
          
          {/* Nose */}
          <ellipse cx="200" cy="145" rx="3" ry="2" fill="#e9967a" />
          
          {/* Mouth */}
          <path d="M195 155 Q200 158 205 155" stroke="#d2691e" strokeWidth="2" fill="none" />
          
          {/* Arms */}
          <ellipse cx="160" cy="200" rx="12" ry="25" fill="url(#skinGradient)" transform="rotate(-20 160 200)" />
          <ellipse cx="240" cy="200" rx="12" ry="25" fill="url(#skinGradient)" transform="rotate(20 240 200)" />
          
          {/* Hands */}
          <circle cx="155" cy="220" r="8" fill="url(#skinGradient)" />
          <circle cx="245" cy="220" r="8" fill="url(#skinGradient)" />
          
          {/* Legs */}
          <ellipse cx="185" cy="255" rx="10" ry="20" fill="url(#skinGradient)" />
          <ellipse cx="215" cy="255" rx="10" ry="20" fill="url(#skinGradient)" />
          
          {/* Feet */}
          <ellipse cx="185" cy="275" rx="8" ry="5" fill="#2c3e50" />
          <ellipse cx="215" cy="275" rx="8" ry="5" fill="#2c3e50" />
          
          {/* Rosy cheeks */}
          <circle cx="170" cy="150" r="6" fill="#ff9999" opacity="0.6" />
          <circle cx="230" cy="150" r="6" fill="#ff9999" opacity="0.6" />
        </svg>
      </div>

      {/* Question Text */}
      <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 dark:text-slate-200 mb-8 leading-tight"
          style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
        When were you born?
      </h2>

      {/* Date Input */}
      <div className="w-full max-w-md">
        <div className="relative">
          <input
            type="date"
            value={birthDate}
            onChange={handleDateChange}
            className="
              w-full px-6 py-4 text-lg text-center rounded-2xl 
              bg-white/80 dark:bg-slate-800/80 
              border-2 border-amber-300/50 dark:border-amber-600/50
              focus:border-amber-500 dark:focus:border-amber-400 
              focus:outline-none focus:ring-4 focus:ring-amber-500/20
              text-slate-700 dark:text-slate-200
              backdrop-blur-sm
              shadow-lg hover:shadow-xl
              transition-all duration-300
              placeholder:text-slate-400
            "
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
            max={new Date().toISOString().split('T')[0]} // Can't select future dates
          />
          
          {/* Calendar Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 text-center">
          This helps us personalize your memory journey
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-16 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default BirthDateTab;
