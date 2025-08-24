// components/Quiz.tsx
'use client';

import { useState } from 'react';
import BirthDateTab from './quiz/BirthDateTab';

interface QuizProps {
  onBack: () => void;
}

const Quiz = ({ onBack }: QuizProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleNext = () => {
    if (currentTab < 0) { // Will add more tabs later
      setCurrentTab(currentTab + 1);
    }
  };

  const handleAnswer = (tabIndex: number, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [tabIndex]: answer
    }));
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 0:
        return (
          <BirthDateTab 
            onAnswer={(answer) => handleAnswer(0, answer)}
            answer={answers[0]}
          />
        );
      default:
        return null;
    }
  };

  const isCurrentTabCompleted = () => {
    return answers[currentTab] !== undefined && answers[currentTab] !== null && answers[currentTab] !== '';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-start p-6 relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-amber-700 hover:text-amber-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentTab + 1) / 5) * 100}%` }} // Assuming 5 total tabs
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-8 relative z-10" style={{ minHeight: 'calc(100vh - 240px)' }}>
        {renderCurrentTab()}
      </div>

      {/* Fixed Footer with Next Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 z-50 safe-area-inset-bottom">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleNext}
            disabled={!isCurrentTabCompleted()}
            className={`
              w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg
              ${isCurrentTabCompleted() 
                ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer hover:shadow-xl transform hover:scale-[1.02]' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
          >
            Next
            <svg 
              className="w-5 h-5 ml-2 inline transform transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
