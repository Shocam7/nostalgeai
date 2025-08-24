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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200" 
            style={{fontFamily: 'Cinzel, Georgia, serif'}}>
          NostalgeAI
        </h1>
        
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-amber-200/50 dark:bg-amber-800/30 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentTab + 1) / 5) * 100}%` }} // Assuming 5 total tabs
          ></div>
        </div>
        <p className="text-sm text-amber-700 dark:text-amber-300 mt-2 text-center">
          Step {currentTab + 1} of 5
        </p>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-8 relative z-10" style={{ minHeight: 'calc(100vh - 200px)' }}>
        {renderCurrentTab()}
      </div>

      {/* Next Button */}
      <div className="fixed bottom-6 right-6 z-20">
        <button 
          onClick={handleNext}
          disabled={!isCurrentTabCompleted()}
          className={`
            px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg
            ${isCurrentTabCompleted() 
              ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer hover:shadow-xl' 
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
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
  );
};

export default Quiz;
