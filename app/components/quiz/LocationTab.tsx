// components/quiz/LocationTab.tsx
'use client';

import { useState, useRef, useEffect } from 'react';

interface LocationTabProps {
  onAnswer: (answer: string) => void;
  answer?: string;
}

interface LocationSuggestion {
  id: string;
  display_name: string;
  lat?: string;
  lon?: string;
  importance?: number;
}

const LocationTab = ({ onAnswer, answer }: LocationTabProps) => {
  const [location, setLocation] = useState(answer || "");
  const [autoFilled, setAutoFilled] = useState(false);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);

  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fallback to hardcoded popular locations when API fails
  const fallbackSuggestions = [
    'New York, NY, USA',
    'London, UK',
    'Paris, France', 
    'Tokyo, Japan',
    'Sydney, Australia',
    'Toronto, Canada',
    'Berlin, Germany',
    'Mumbai, India',
    'São Paulo, Brazil',
    'Mexico City, Mexico',
    'Los Angeles, CA, USA',
    'Chicago, IL, USA',
    'Houston, TX, USA',
    'Barcelona, Spain',
    'Amsterdam, Netherlands',
    'Singapore',
    'Dubai, UAE',
    'Hong Kong',
    'Buenos Aires, Argentina',
    'Stockholm, Sweden'
  ];

  const searchWithPhoton = async (query: string): Promise<LocationSuggestion[]> => {
    try {
      const response = await fetch(
        `https://photon.komoot.io/api/?` +
          new URLSearchParams({
            q: query,
            limit: '4',
            lang: 'en',
          })
      );

      if (!response.ok) {
        throw new Error(`Photon API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Photon returns GeoJSON format
      if (!data.features || !Array.isArray(data.features)) {
        return [];
      }

      return data.features
        .filter((item: any) => item.properties && item.properties.name)
        .slice(0, 4)
        .map((item: any, index: number) => {
          const props = item.properties;
          const coords = item.geometry?.coordinates;
          
          // Build display name from available properties
          let displayName = props.name;
          if (props.city && props.city !== props.name) {
            displayName += `, ${props.city}`;
          }
          if (props.state) {
            displayName += `, ${props.state}`;
          }
          if (props.country) {
            displayName += `, ${props.country}`;
          }
          
          return {
            id: props.osm_id?.toString() || `photon-${index}`,
            display_name: displayName,
            lat: coords ? coords[1]?.toString() : undefined,
            lon: coords ? coords[0]?.toString() : undefined,
            importance: 1.0 - (index * 0.1) // Simple importance based on order
          };
        });
    } catch (error) {
      console.warn('Photon API failed:', error);
      throw error;
    }
  };

  const searchWithFallback = (query: string): LocationSuggestion[] => {
    const filtered = fallbackSuggestions
      .filter(location => 
        location.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 4)
      .map((location, index) => ({
        id: `fallback-${index}`,
        display_name: location
      }));

    return filtered;
  };

  const searchPlaces = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Try Photon API first
      const photonResults = await searchWithPhoton(query);
      
      if (photonResults.length > 0) {
        setSuggestions(photonResults);
        setShowSuggestions(true);
        setIsLoading(false); // Stop loading when results are found
        return;
      }
    } catch (error) {
      console.warn('Photon API failed, using fallback:', error);
    }

    // Fallback to hardcoded suggestions
    try {
      const fallbackResults = searchWithFallback(query);
      
      if (fallbackResults.length > 0) {
        setSuggestions(fallbackResults);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        if (query.length > 2) {
          setError('No locations found. You can still type your location manually.');
        }
      }
    } catch (error) {
      console.error('Even fallback failed:', error);
      setError('Search temporarily unavailable. Please type your location manually.');
      setSuggestions([]);
      setShowSuggestions(false);
    }
    
    // Always stop loading at the end
    setIsLoading(false);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setError(null);

    // Clear previous timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Set new debounce timer
    debounceRef.current = setTimeout(() => {
      searchPlaces(value);
    }, 300);
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.display_name);
    onAnswer(suggestion.display_name);
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Update answer when location changes and no suggestions are shown
  useEffect(() => {
    if (location && !showSuggestions) {
      onAnswer(location);
    }
  }, [location, showSuggestions, onAnswer]);




  


// Simplify the auto-fill useEffect:
useEffect(() => {
  async function detect() {
    try {
      const res = await fetch("/api/geo-lookup");
      const data = await res.json();

      // Only auto-fill if input is empty
      if (data.displayName && location.trim() === "") {
        setLocation(data.displayName);
        onAnswer(data.displayName);
        console.log('📍 Auto-filled location:', data.displayName);
      }
    } catch (e) {
      console.warn("Geo lookup error:", e);
    }
  }

  detect();
}, []); // Run only once on mount

  
  








  

  const formatDisplayName = (displayName: string): string => {
    const parts = displayName.split(', ');
    if (parts.length > 3) {
      return `${parts[0]}, ${parts[parts.length - 2]}, ${parts[parts.length - 1]}`;
    }
    return displayName;
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
      <h2
        className="text-3xl sm:text-4xl font-medium text-slate-800 mb-8 leading-tight"
        style={{ fontFamily: 'Crimson Text, Times New Roman, serif' }}
      >
        Where did you grow up?
      </h2>

      {/* Location Input */}
      <div className="w-full max-w-md relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={location}
            onChange={handleLocationChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
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
            style={{ fontFamily: 'Crimson Text, Times New Roman, serif' }}
            autoComplete="off"
          />

          {/* Location Icon */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600"></div>
            ) : (
              <svg
                className="w-6 h-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            )}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[60] max-h-60 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="
                  w-full px-6 py-3 text-left hover:bg-gray-50 transition-colors duration-200
                  first:rounded-t-2xl last:rounded-b-2xl
                  border-b border-gray-100 last:border-b-0
                  focus:outline-none focus:bg-amber-50
                "
              >
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-gray-400 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span
                    className="text-slate-700 text-sm"
                    style={{ fontFamily: 'Crimson Text, Times New Roman, serif' }}
                  >
                    {formatDisplayName(suggestion.display_name)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-amber-50 border border-amber-200 rounded-2xl shadow-xl z-[60]">
            <div className="px-6 py-4 text-center text-amber-700 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* No results message */}
        {showSuggestions &&
          suggestions.length === 0 &&
          !isLoading &&
          !error &&
          location.length > 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl z-[60]">
              <div className="px-6 py-4 text-center text-gray-500 text-sm">
                No locations found. You can continue typing your location.
              </div>
            </div>
          )}

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
