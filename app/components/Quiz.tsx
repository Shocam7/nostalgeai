import React, { useState } from 'react';
import BirthDateTab from './quiz/BirthDateTab';
import LocationTab from './quiz/LocationTab';
import MainTab from './quiz/MainTab';
import SubTab from './quiz/SubTab';
import SkipDropdown from './ui/SkipDropdown';
import ResultsPage from './ResultsPage';

interface QuizProps {
  onBack: () => void;
}

interface MemoryData {
  [year: number]: {
    categories: {
      [categoryId: string]: string[];
    };
  };
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

const Quiz = ({ onBack }: QuizProps) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [startFromBirth, setStartFromBirth] = useState(false);
  const [memoryData, setMemoryData] = useState<MemoryData>({});
  
  // SubTab states
  const [inSubTab, setInSubTab] = useState(false);
  const [currentCategories, setCurrentCategories] = useState<string[]>([]);
  const [currentCategoryIndex, setCategoryIndex] = useState(0);
  const [subTabAnimating, setSubTabAnimating] = useState({ in: false, out: false });
  const [memoryGradients, setMemoryGradients] = useState<Record<string, typeof gradientOptions[0]>>({});
  const [showResults, setShowResults] = useState(false);

  // Initialize gradients
  React.useEffect(() => {
    const sessionId = getUserSessionId();
    const gradients: Record<string, typeof gradientOptions[0]> = {};
    
    memoryClasses.forEach((memoryClass) => {
      const seed = `${sessionId}-${memoryClass.id}`;
      const randomIndex = seededRandom(seed) % gradientOptions.length;
      gradients[memoryClass.id] = gradientOptions[randomIndex];
    });
    
    setMemoryGradients(gradients);
  }, []);

  const totalTabs = 3; // BirthDate + Location + Main tabs

  const handleNext = () => {
    if (currentTab === 0) {
      setCurrentTab(1);
    } else if (currentTab === 1) {
      const birthDate = answers[0];
      if (birthDate) {
        const birthYear = new Date(birthDate).getFullYear();
        const startYear = startFromBirth ? birthYear : birthYear + 5;
        setCurrentYear(startYear);
      }
      setCurrentTab(2);
    } else if (currentTab === 2) {
      const selectedCategories = answers[2] as string[];
      if (selectedCategories && selectedCategories.length > 0 && !inSubTab) {
        setCurrentCategories(selectedCategories);
        setCategoryIndex(0);
        setInSubTab(true);
        setSubTabAnimating({ in: true, out: false });
      } else {
        moveToNextYear();
      }
    }
  };

  const moveToNextYear = () => {
    if (currentYear) {
      const nextYear = currentYear + 1;
      const currentYearNow = new Date().getFullYear();
      if (nextYear <= currentYearNow) {
        setCurrentYear(nextYear);
        const newAnswers = { ...answers };
        delete newAnswers[2];
        setAnswers(newAnswers);
      } else {
        setShowResults(true);
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

  // SubTab handlers
  const handleSubTabSave = (memories: string[]) => {
    if (currentYear && currentCategories[currentCategoryIndex]) {
      const categoryId = currentCategories[currentCategoryIndex];
      setMemoryData(prev => ({
        ...prev,
        [currentYear]: {
          ...prev[currentYear],
          categories: {
            ...prev[currentYear]?.categories,
            [categoryId]: memories
          }
        }
      }));

      if (currentCategoryIndex < currentCategories.length - 1) {
        setSubTabAnimating({ in: false, out: true });
        setTimeout(() => {
          setCategoryIndex(prev => prev + 1);
          setSubTabAnimating({ in: true, out: false });
        }, 300);
      } else {
        setSubTabAnimating({ in: false, out: true });
        setTimeout(() => {
          setInSubTab(false);
          setSubTabAnimating({ in: false, out: false });
          moveToNextYear();
        }, 300);
      }
    }
  };

  const handleSkipMemory = () => {
    handleSubTabSave([]);
  };

  const handleSkipYear = () => {
    setSubTabAnimating({ in: false, out: true });
    setTimeout(() => {
      setInSubTab(false);
      setSubTabAnimating({ in: false, out: false });
      moveToNextYear();
    }, 300);
  };

  const handleSkipEntirely = () => {
    setSubTabAnimating({ in: false, out: true });
    setTimeout(() => {
      setInSubTab(false);
      setSubTabAnimating({ in: false, out: false });
      setShowResults(true);
    }, 300);
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
    
    if (currentTab === 0 || currentTab === 1) {
      return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';
    }
    
    if (currentTab === 2) {
      return Array.isArray(currentAnswer) && currentAnswer.length > 0;
    }
    
    return false;
  };

  const getButtonText = () => {
    if (currentTab === 0 || currentTab === 1) {
      return 'Next';
    } else if (currentTab === 2) {
      const selectedCategories = answers[2] as string[];
      if (selectedCategories && selectedCategories.length > 0) {
        return 'Start Memories';
      }
      const currentYearNow = new Date().getFullYear();
      if (currentYear && currentYear >= currentYearNow) {
        return 'Complete';
      }
      return 'Next Year';
    }
    return 'Next';
  };

  // Show results page
  if (showResults) {
    const resultsData = Object.entries(memoryData).map(([year, data]) => ({
      year: parseInt(year),
      categories: data.categories
    }));

    return (
      <ResultsPage
        memories={resultsData}
        onBack={() => setShowResults(false)}
        onStartOver={() => {
          setCurrentTab(0);
          setAnswers({});
          setCurrentYear(null);
          setStartFromBirth(false);
          setMemoryData({});
          setShowResults(false);
          setInSubTab(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white relative">
      
      {/* SubTab Overlay - Fixed positioning with proper z-index */}
      {inSubTab && currentCategories[currentCategoryIndex] && (
        <div 
          className={`fixed inset-0 z-[100] transition-all duration-300 ease-out ${
            subTabAnimating.in ? 'opacity-100 scale-100' : 
            subTabAnimating.out ? 'opacity-0 scale-95' : 
            'opacity-100 scale-100'
          }`}
          style={{ 
            transform: subTabAnimating.out ? 'scale(0.95)' : 'scale(1)',
            transition: 'all 0.3s ease-out'
          }}
        >
          <SubTab
            categoryId={currentCategories[currentCategoryIndex]}
            categoryName={memoryClasses.find(c => c.id === currentCategories[currentCategoryIndex])?.name || ''}
            gradient={memoryGradients[currentCategories[currentCategoryIndex]] || gradientOptions[0]}
            currentYear={currentYear!}
            onSave={handleSubTabSave}
            onSkipMemory={handleSkipMemory}
            onSkipYear={handleSkipYear}
            onSkipEntirely={handleSkipEntirely}
            isAnimatingIn={subTabAnimating.in}
            isAnimatingOut={subTabAnimating.out}
          />
        </div>
      )}
      
      {/* Main Content - Hide when SubTab is active */}
      <div className={`${inSubTab ? 'hidden' : 'block'}`}>
        
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
              <div className="px-4 py-2 bg-gradient-to-r from-amber-100 to-orange-100 rounded-full shadow-sm">
                <span className="text-xl text-amber-800 font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {currentYear}
                </span>
              </div>
            </div>
          )}

          {/* Skip Dropdown - only show after LocationTab */}
          {currentTab > 1 && (
            <SkipDropdown
              mode="main"
              onSkipYear={handleSkipYear}
              onSkipEntirely={handleSkipEntirely}
            />
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-6 mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${((currentTab + 1) / totalTabs) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="px-6 pb-32">
          <div className="max-w-4xl mx-auto">
            {renderCurrentTab()}
          </div>
        </div>

        {/* Fixed Footer with Next Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4 z-40">
          <div className="max-w-md mx-auto">
            <button 
              onClick={handleNext}
              disabled={!isCurrentTabCompleted()}
              className={`
                w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg
                ${isCurrentTabCompleted() 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
            >
              {getButtonText()}
              <svg 
                className={`w-5 h-5 ml-2 inline transition-transform duration-200 ${
                  isCurrentTabCompleted() ? 'translate-x-0' : ''
                }`} 
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

      {/* Decorative elements - only show when not in SubTab */}
      {!inSubTab && (
        <>
          <div className="absolute top-10 left-8 w-3 h-3 bg-amber-400/30 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-12 w-2 h-2 bg-orange-400/30 rounded-full animate-pulse delay-1000"></div>
        </>
      )}
    </div>
  );
};

export default Quiz;
