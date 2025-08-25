// components/Quiz.tsx
'use client';

import { useState } from 'react';
import BirthDateTab from './quiz/BirthDateTab';
import LocationTab from './quiz/LocationTab';
import MainTab from './quiz/MainTab';

interface QuizProps {
  onBack: () => void;
}

const Quiz = ({ onBack }: QuizProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [startFromBirth, setStartFromBirth] = useState(false);

  const totalTabs = 3; // BirthDate + Location + Main tabs

  const handleNext = () => {
    if (currentTab === 0) {
      // Moving from BirthDate to LocationTab
      setCurrentTab(1);
    } else if (currentTab === 1) {
      // Moving from LocationTab to MainTab
      const birthDate = answers[0];
      if (birthDate) {
        const birthYear = new Date(birthDate).getFullYear();
        const startYear = startFromBirth ? birthYear : birthYear + 5;
        setCurrentYear(startYear);
      }
      setCurrentTab(2);
    } else if (currentTab === 2) {
      // Moving to next year
      if (currentYear) {
        const nextYear = currentYear + 1;
        const currentYearNow = new Date().getFullYear();
        if (nextYear <= currentYearNow) {
          setCurrentYear(nextYear);
          // Clear previous year's answers to show fresh selection
          const newAnswers = { ...answers };
          delete newAnswers[2];
          setAnswers(newAnswers);
        } else {
          // Quiz complete - could navigate to results or next section
          console.log('Quiz completed!');
        }
      }
    }
  };

  const handleStartFromBirth = () => {
    const birthDate = answers[0];
    if (birthDate) {
      const birthYear = new Date(birthDate).getFullYear();
      setCurrentYear(birthYear);
      setStartFromBirth(true);
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
      case 1:
        return (
          <LocationTab 
            onAnswer={(answer) => handleAnswer(1, answer)}
            answer={answers[1]}
          />
        );
      case 2:
        return (
          <MainTab 
            onAnswer={(answer) => handleAnswer(2, answer)}
            answer={answers[2]}
            currentYear={currentYear}
            birthYear={answers[0] ? new Date(answers[0]).getFullYear() : null}
            onStartFromBirth={handleStartFromBirth}
            startFromBirth={startFromBirth}
          />
        );
      default:
        return null;
    }
  };

  const isCurrentTabCompleted = () => {
    const currentAnswer = answers[currentTab];
    
    // For BirthDate tab (index 0)
    if (currentTab === 0) {
      return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
    }
    
    // For Location tab (index 1)
    if (currentTab === 1) {
      return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
    }
    
    // For Main tab (index 2) - at least one memory class should be selected
    if (currentTab === 2) {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    
    return false;
  };

  const getButtonText = () => {
    if (currentTab === 0 || currentTab === 1) {
      return 'Next';
    } else if (currentTab === 2) {
      const currentYearNow = new Date().getFullYear();
      if (currentYear && currentYear >= currentYearNow) {
        return 'Complete';
      }
      return 'Next Year';
    }
    return 'Next';
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-amber-700 hover:text-amber-800 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        
        {/* Current Year Display */}
        {currentTab === 2 && currentYear && (
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="px-4 py-1">
              <span className="text-sm text-gray-500" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                {currentYear}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-6 mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-amber-600 to-orange-600 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentTab + 1) / totalTabs) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col px-8 relative z-10 flex-1" style={{ height: 'calc(100vh - 240px)' }}>
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
            {getButtonText()}
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
