import React, { useState, useEffect } from 'react';
import SkipDropdown from '../ui/SkipDropdown';
import { supabase } from '../../lib/supabaseClient';

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
  // Add other fields as needed for different categories
}

// Updated prompts for selection-based interface
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
  // Add more categories as needed
};

const SubTab = ({ 
  categoryId, 
  categoryName, 
  gradient, 
  currentYear, 
  onSave, 
  onSkipMemory, 
  onSkipYear, 
  onSkipEntirely,
  isAnimatingIn,
  isAnimatingOut 
}: SubTabProps) => {
  const [availableItems, setAvailableItems] = useState<DatabaseItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<DatabaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const prompts = selectionPrompts[categoryId as keyof typeof selectionPrompts] || [
    `Select your ${categoryName.toLowerCase()} from ${currentYear}:`
  ];

  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  // Fetch items from database
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Map category names to table names (adjust as needed)
        const tableName = categoryId === 'movies' ? 'movies' : 
                         categoryId === 'tv' ? 'tv_shows' :
                         categoryId === 'music' ? 'songs' :
                         categoryId === 'games' ? 'games' :
                         categoryId; // fallback to categoryId

        const { data, error: fetchError } = await supabase
          .from(tableName)
          .select('*')
          .eq('year', currentYear)
          .order('popularity', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setAvailableItems(data || []);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId, currentYear]);

  // Filter items based on search query
  const filteredItems = availableItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleItemSelection = (item: DatabaseItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    
    if (isSelected) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleSave = () => {
    // Convert selected items to strings for the onSave callback
    const memoryStrings = selectedItems.map(item => item.title);
    onSave(memoryStrings);
  };

  const isItemSelected = (item: DatabaseItem) => {
    return selectedItems.some(selected => selected.id === item.id);
  };

  return (
    <div className={`bg-gradient-to-br ${gradient.from} ${gradient.to} h-full w-full flex flex-col`}>
      
      {/* Header */}
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 pb-6 min-h-0">
        
        {/* Title Section */}
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

        {/* Search Section */}
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

        {/* Items List - Scrollable */}
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
                    className={`bg-white/15 backdrop-blur-md rounded-xl p-4 border transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] cursor-pointer animate-in slide-in-from-bottom-3 duration-300 ${
                      selected 
                        ? 'border-white/50 bg-white/25 ring-2 ring-white/30' 
                        : 'border-white/20 hover:bg-white/20'
                    }`}
                    style={{
                      animationDelay: `${index * 50}ms`
                    }}
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
      </div>

      {/* Fixed Footer with Save Button */}
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
