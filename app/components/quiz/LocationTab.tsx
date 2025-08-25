// components/quiz/LocationTab.tsx
'use client';

import { useState } from 'react';

interface LocationTabProps {
  onAnswer: (answer: string) => void;
  answer?: string;
}

const LocationTab = ({ onAnswer, answer }: LocationTabProps) => {
  const [location, setLocation] = useState(answer || '');

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    onAnswer(value);
  };

  return (
    <div className="flex flex-col items-center text-center max-w-2xl w-full">
      
      {/* SVG Illustration */}
      <div className="mb-8 w-64 h-64 flex items-center justify-center">
        <img 
          src="/svg/location.svg" 
          alt="Location illustration" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>

      {/* Question Text */}
      <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 mb-8 leading-tight"
          style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
        Where did you grow up?
      </h2>

      {/* Location Input */}
      <div className="w-full max-w-md">
        <div className="relative">
          <input
            type="text"
            value={location}
            onChange={handleLocationChange}
            placeholder="Enter your location"
            className="
              w-full px-6 py-4 text-lg text-center rounded-2xl 
              bg-gray-50 border-2 border-gray-200
              focus:border-amber-500 focus:bg-white
              focus:outline-none focus:ring-4 focus:ring-amber-500/20
              text-slate-700
              shadow-lg hover:shadow-xl
              transition-all duration-300
              placeholder:text-slate-400
            "
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
          />
          
          {/* Location Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        
        {/* Helper text */}
        <p className="text-sm text-slate-600 mt-3 text-center">
          This helps us understand your cultural context
        </p>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-16 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-40 left-20 w-4 h-4 bg-yellow-400/30 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default LocationTab;
