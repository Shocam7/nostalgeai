import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
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
  { id: 'toons', name: 'Toons', svg: 'toons.svg' },
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
  const [memoryGradients, setMemoryGradients] = useState<Record<string, typeof gradientOptions[0]>>({});
  const [showResults, setShowResults] = useState(false);
  const [animatingCategoryId, setAnimatingCategoryId] = useState<string | null>(null);

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
        setAnimatingCategoryId(selectedCategories[0]);
        
        // Start animation sequence
        setTimeout(() => {
          setInSubTab(true);
        }, 800); // Allow time for the expansion animation
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
        const nextCategoryId = currentCategories[currentCategoryIndex + 1];
        setAnimatingCategoryId(nextCategoryId);
        setCategoryIndex(prev => prev + 1);
      } else {
        setInSubTab(false);
        setAnimatingCategoryId(null);
        moveToNextYear();
      }
    }
  };

  const handleSkipMemory = () => {
    handleSubTabSave([]);
  };

  const handleSkipYear = () => {
    setInSubTab(false);
    setAnimatingCategoryId(null);
    moveToNextYear();
  };

  const handleSkipEntirely = () => {
    setInSubTab(false);
    setAnimatingCategoryId(null);
    setShowResults(true);
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
            memoryGradients={memoryGradients}
            animatingCategoryId={animatingCategoryId}
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
          setAnimatingCategoryId(null);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-white overflow-hidden">
      
      {/* SubTab Overlay with Animation */}
      <AnimatePresence>
        {inSubTab && currentCategories[currentCategoryIndex] && (
          <motion.div
            layoutId={`memory-${currentCategories[currentCategoryIndex]}`}
            initial={{ scale: 0.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 200,
              duration: 0.8
            }}
            className="fixed inset-0 z-[100]"
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
              isAnimatingIn={false}
              isAnimatingOut={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <motion.div 
        className={`h-full flex flex-col ${inSubTab ? 'pointer-events-none' : ''}`}
        animate={{ opacity: inSubTab ? 0.3 : 1, scale: inSubTab ? 0.95 : 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        
        {/* Fixed Header */}
        <div className="flex-none bg-white z-10 border-b border-gray-100">
          
          {/* Top Navigation */}
          <div className="flex items-center justify-between p-6">
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
                <span className="text-xl text-gray-500 font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {currentYear}
                </span>
              </div>
            )}

            {/* Skip Dropdown - only show after LocationTab */}
            {currentTab > 1 && !inSubTab && (
              <SkipDropdown
                mode="main"
                onSkipYear={handleSkipYear}
                onSkipEntirely={handleSkipEntirely}
              />
            )}
          </div>

          {/* Progress Bar */}
          <div className="px-6 mb-6">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div 
                className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((currentTab + 1) / totalTabs) * 100}%` }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
              />
            </div>
          </div>

          {/* Tab Content Header (Skip 5 Years + Title for MainTab) */}
          {currentTab === 2 && (
            <div className="px-6 pb-6">
              {/* Skip 5 Years Notice */}
              {currentYear && answers[0] && currentYear === new Date(answers[0]).getFullYear() + 5 && !startFromBirth && (
                <motion.div 
                  className="mb-6 text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="inline-block px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl shadow-sm">
                    <p className="text-amber-800 max-w-md" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                      <span className="font-medium">We skipped your first 5 years.</span>
                      {' '}
                      <button 
                        onClick={handleStartFromBirth}
                        className="underline hover:no-underline font-semibold text-amber-900 hover:text-amber-700 transition-colors duration-200"
                      >
                        Click here
                      </button>
                      {' '}if you have memories from that time.
                    </p>
                  </div>
                </motion.div>
              )}
              
              {/* Main Title */}
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <h2 className="text-3xl sm:text-4xl font-medium text-slate-800 leading-tight"
                    style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  What kind of memories would you like to capture?
                </h2>
              </motion.div>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="max-w-4xl mx-auto py-6">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {renderCurrentTab()}
            </motion.div>
          </div>
        </div>

        {/* Fixed Footer with Next Button */}
        <div className="flex-none bg-white/95 backdrop-blur-sm border-t border-gray-200 px-6 py-4 z-40">
          <div className="max-w-md mx-auto">
            <motion.button 
              onClick={handleNext}
              disabled={!isCurrentTabCompleted()}
              whileHover={isCurrentTabCompleted() ? { scale: 1.02 } : {}}
              whileTap={isCurrentTabCompleted() ? { scale: 0.98 } : {}}
              className={`
                w-full px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg
                ${isCurrentTabCompleted() 
                  ? 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white cursor-pointer hover:shadow-xl' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
            >
              {getButtonText()}
              <svg 
                className={`w-5 h-5 ml-2 inline transition-transform duration-200`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Decorative elements */}
      {!inSubTab && (
        <>
          <motion.div 
            className="absolute top-10 left-8 w-3 h-3 bg-amber-400/30 rounded-full"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-32 right-12 w-2 h-2 bg-orange-400/30 rounded-full"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{ 
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </>
      )}
    </div>
  );
};

export default Quiz;
