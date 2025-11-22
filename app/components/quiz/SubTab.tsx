import React, { useState, useEffect, useRef } from 'react';
import SkipDropdown from '../ui/SkipDropdown';
import { supabase } from '../../../lib/supabaseClient';

interface SubTabProps {
  categoryId: string;
  categoryName: string;
  gradient: {
    from: string;
    to: string;
    border: string;
    shadow: string;
  };
  currentYear: number;
  userCountryCode: string;
  onSave: (memories: string[]) => void;
  onSkipMemory: () => void;
  onSkipYear: () => void;
  onSkipEntirely: () => void;
  isAnimatingIn: boolean;
  isAnimatingOut: boolean;
}

interface DatabaseItem {
  id: number;
  title: string;
  year: number;
  popularity?: number;
  people?: string[];
  preferred_age?: string;
  poster_path?: string;
}

const selectionPrompts = {
  movies: [
    "Which movies did you watch this year?",
    "Select the films that left a lasting impression:",
    "Pick the movies you enjoyed in",
    "Choose the films you remember from"
  ],
  tv: [
    "Which TV shows were you following?",
    "Select the series you watched:",
    "Pick the shows that defined your year:",
    "Choose the TV content you enjoyed in"
  ],
  music: [
    "Which songs were on repeat?",
    "Select the artists you discovered:",
    "Pick the music that defined your year:",
    "Choose the songs you loved in"
  ],
  games: [
    "Which games were you playing?",
    "Select your gaming highlights:",
    "Pick the games you enjoyed most:",
    "Choose the games that defined your year in"
  ]
};

const SubTab = ({ 
  categoryId, 
  categoryName, 
  gradient, 
  currentYear, 
  userCountryCode,
  onSave, 
  onSkipMemory, 
  onSkipYear, 
  onSkipEntirely,
  isAnimatingIn,
  isAnimatingOut 
}: SubTabProps) => {
  const [availableItems, setAvailableItems] = useState<DatabaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<DatabaseItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  
  const prompts = selectionPrompts[categoryId as keyof typeof selectionPrompts] || [
    `Select your ${categoryName.toLowerCase()} from ${currentYear}:`
  ];

  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];
  const isMovieCategory = categoryId === 'movies';

  const fetchMoviesFromTMDB = async (year: number) => {
    try {

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-16 w-2 h-2 bg-white/25 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default SubTab;console.log('🎬 Fetching movies for year:', year, 'region:', userCountryCode);
      
      const response = await fetch(
        `/api/tmdb-proxy?year=${year}&region=${userCountryCode}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch movies from proxy');
      }

      const data = await response.json();
      const movies = data.results || [];

      console.log(`✅ Fetched ${movies.length} movies for region ${userCountryCode}`);
      return movies;
    } catch (error) {
      console.error('Error fetching from TMDB:', error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        if (categoryId === 'movies') {
          const movies = await fetchMoviesFromTMDB(currentYear);
          setAvailableItems(movies);
        } else {
          const tableName = categoryId === 'tv' ? 'tv_shows' :
                           categoryId === 'music' ? 'songs' :
                           categoryId === 'games' ? 'games' :
                           categoryId;

          const { data, error: fetchError } = await supabase
            .from(tableName)
            .select('*')
            .eq('year', currentYear)
            .order('popularity', { ascending: false });

          if (fetchError) {
            throw fetchError;
          }

          setAvailableItems(data || []);
        }
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId, currentYear]);

  const filteredItems = availableItems
    .filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const handleSwipeLeft = () => {
    setSwipeDirection('left');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }, 400);
  };

  const handleSwipeRight = () => {
    const currentItem = filteredItems[currentIndex];
    if (currentItem) {
      setSelectedItems(prev => [...prev, currentItem]);
    }
    setSwipeDirection('right');
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setSwipeDirection(null);
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }, 400);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const deltaX = e.touches[0].clientX - startPosRef.current.x;
    const deltaY = e.touches[0].clientY - startPosRef.current.y;
    setDragOffset({ x: deltaX, y: deltaY });
    setRotation(deltaX * 0.1);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > 100) {
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > 100) {
      if (dragOffset.x > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    } else {
      setDragOffset({ x: 0, y: 0 });
      setRotation(0);
    }
  };

  const toggleItemSelection = (item: DatabaseItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const isItemSelected = (item: DatabaseItem) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  const handleSave = () => {
    const memoryStrings = selectedItems.map(item => item.title);
    onSave(memoryStrings);
  };

  const renderCardStack = () => {
    if (currentIndex >= filteredItems.length) {
      return (
        <div className="flex-1 flex items-center justify-center pb-32">
          <div className="text-center text-white max-w-md">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <svg className="w-20 h-20 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-medium mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                All Done!
              </h3>
              <p className="text-white/80 text-lg leading-relaxed" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                You've reviewed all available movies for {currentYear}
              </p>
            </div>
          </div>
        </div>
      );
    }

    const currentCard = filteredItems[currentIndex];
    const nextCard = filteredItems[currentIndex + 1];
    const afterNextCard = filteredItems[currentIndex + 2];

    return (
      <div className="flex-1 flex items-center justify-center px-6 relative pb-32">
        <div className="relative w-full max-w-md h-[500px]">
          {afterNextCard && (
            <div 
              className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              style={{
                transform: 'scale(0.88) translateY(16px)',
                zIndex: 1,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {afterNextCard.poster_path ? (
                <>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${afterNextCard.poster_path}`}
                    alt={afterNextCard.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </>
              ) : (
                <div className="absolute inset-0 bg-white/10 backdrop-blur-md flex items-center justify-center p-8">
                  <h3 className="text-2xl font-medium text-white text-center leading-tight"
                      style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                    {afterNextCard.title}
                  </h3>
                </div>
              )}
            </div>
          )}
          
          {nextCard && (
            <div 
              className="absolute inset-0 rounded-3xl border border-white/20 shadow-2xl overflow-hidden"
              style={{
                transform: 'scale(0.94) translateY(8px)',
                zIndex: 2,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              {nextCard.poster_path ? (
                <>
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${nextCard.poster_path}`}
                    alt={nextCard.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                </>
              ) : (
                <div className="absolute inset-0 bg-white/15 backdrop-blur-md flex items-center justify-center p-8">
                  <h3 className="text-3xl font-medium text-white text-center leading-tight"
                      style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                    {nextCard.title}
                  </h3>
                </div>
              )}
            </div>
          )}

          <div 
            ref={cardRef}
            className="absolute inset-0 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing select-none overflow-hidden"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg) scale(${isDragging ? 1.05 : 1})`,
              transition: isDragging ? 'none' : swipeDirection ? 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 3,
              opacity: swipeDirection ? 0 : 1
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {currentCard.poster_path ? (
              <img 
                src={`https://image.tmdb.org/t/p/w500${currentCard.poster_path}`}
                alt={currentCard.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-white/20 backdrop-blur-md border border-white/30" />
                <div className="relative flex items-center justify-center h-full p-8">
                  <h3 className="text-4xl font-medium text-white leading-tight text-center"
                      style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                    {currentCard.title}
                  </h3>
                </div>
              </>
            )}

            <div 
              className="absolute top-8 left-8 px-6 py-3 bg-red-500/80 backdrop-blur-sm rounded-2xl border-4 border-red-400 transform -rotate-12 transition-opacity duration-200"
              style={{
                opacity: dragOffset.x < -50 ? 1 : 0,
                zIndex: 10
              }}
            >
              <span className="text-white font-bold text-2xl" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                SKIP
              </span>
            </div>
            
            <div 
              className="absolute top-8 right-8 px-6 py-3 bg-green-500/80 backdrop-blur-sm rounded-2xl border-4 border-green-400 transform rotate-12 transition-opacity duration-200"
              style={{
                opacity: dragOffset.x > 50 ? 1 : 0,
                zIndex: 10
              }}
            >
              <span className="text-white font-bold text-2xl" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                SAVE
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-6 pb-6">
          <button 
            onClick={handleSwipeLeft}
            className="w-16 h-16 rounded-full bg-red-500/80 hover:bg-red-500 backdrop-blur-sm border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button 
            onClick={handleSwipeRight}
            className="w-16 h-16 rounded-full bg-green-500/80 hover:bg-green-500 backdrop-blur-sm border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-110 active:scale-95 flex items-center justify-center"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>
    );
  };

  const renderListView = () => {
    return (
      <>
        <div className="max-w-2xl mx-auto w-full mb-6 flex-shrink-0">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryName.toLowerCase()}...`}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200"
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          {loading ? (
            <div className="text-center text-white/60 mt-16">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white/70 rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  Loading {categoryName.toLowerCase()}...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center text-red-200 mt-16">
              <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {error}
                </p>
              </div>
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-3 pb-6">
              {filteredItems.map((item, index) => {
                const selected = isItemSelected(item);
                return (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItemSelection(item)}
                    className={`bg-white/15 backdrop-blur-md rounded-xl p-4 border transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer ${
                      selected 
                        ? 'border-white/50 bg-white/25 ring-2 ring-white/30' 
                        : 'border-white/20 hover:bg-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                          selected 
                            ? 'bg-white border-white' 
                            : 'border-white/40'
                        }`}>
                          {selected && (
                            <svg className="w-3 h-3 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-medium leading-snug"
                              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                            {item.title}
                          </h3>
                          {item.popularity && (
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 text-yellow-300 fill-current" viewBox="0 0 24 24">
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                                <span className="text-white/70 text-sm ml-1">
                                  {item.popularity}/10
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-white/60 mt-16 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-lg font-medium mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {searchQuery ? 'No matches found' : `No ${categoryName.toLowerCase()} available`}
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : `No ${categoryName.toLowerCase()} data available for ${currentYear}`
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <div className={`bg-gradient-to-br ${gradient.from} ${gradient.to} h-full w-full flex flex-col`}>
      <div className="flex items-center justify-between p-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-white font-medium text-sm" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              {currentYear} • {categoryName}
            </span>
          </div>
        </div>
        
        <SkipDropdown
          mode="sub"
          onSkipMemory={onSkipMemory}
          onSkipYear={onSkipYear}
          onSkipEntirely={onSkipEntirely}
          className="relative z-50"
        />
      </div>

      <div className="flex-1 flex flex-col px-6 pb-6 min-h-0">
        {!isMovieCategory && (
          <div className="text-center mb-8 flex-shrink-0">
            <h2 className="text-3xl sm:text-4xl font-medium text-white leading-tight mb-4"
                style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              {categoryName} in {currentYear}
            </h2>
            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed"
               style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              {selectedPrompt} {currentYear}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white/60">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md mx-auto">
                <div className="animate-spin w-8 h-8 border-2 border-white/30 border-t-white/70 rounded-full mx-auto mb-4"></div>
                <p className="text-lg font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  Loading {categoryName.toLowerCase()}...
                </p>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-red-200">
              <div className="bg-red-900/20 backdrop-blur-sm rounded-2xl p-8 border border-red-500/20 max-w-md mx-auto">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg font-medium mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {error}
                </p>
              </div>
            </div>
          </div>
        ) : isMovieCategory ? renderCardStack() : renderListView()}
      </div>

      <div className="bg-black/20 backdrop-blur-sm border-t border-white/20 px-6 py-4 flex-shrink-0">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSave}
            className="w-full px-8 py-4 bg-white/25 hover:bg-white/35 text-white font-semibold text-lg rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] backdrop-blur-sm border border-white/30 hover:border-white/40"
            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
          >
            <span className="flex items-center justify-center gap-2">
              Save & Continue
              <svg 
                className="w-5 h-5 transform transition-transform duration-200" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </button>
          
          {selectedItems.length > 0 && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80 text-sm font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {selectedItems.length} {selectedItems.length === 1 ? 'item' : 'items'} selected
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-3 h-3 bg-white/30 rounded-full animate-pulse"></div>
      <div className="absolute top-40 right-16 w-2 h-2 bg-white/25 rounded-full animate-pulse delay-1000"></div>
      <div className="absolute bottom-32 left-20 w-4 h-4 bg-white/20 rounded-full animate-pulse delay-500"></div>
    </div>
  );
};

export default SubTab;
