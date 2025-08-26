import React, { useState, useRef, useEffect } from 'react';

interface SkipDropdownProps {
  mode: 'main' | 'sub';
  onSkipMemory?: () => void;
  onSkipYear: () => void;
  onSkipEntirely: () => void;
  className?: string;
}

const SkipDropdown = ({ mode, onSkipMemory, onSkipYear, onSkipEntirely, className = '' }: SkipDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSkipAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const getDefaultLabel = () => {
    return mode === 'sub' ? 'Skip Options' : 'Skip Options';
  };

  const menuItems = mode === 'sub' 
    ? [
        { 
          label: 'Skip Memory', 
          action: onSkipMemory, 
          description: 'Skip this category and continue',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8" />
            </svg>
          )
        },
        { 
          label: 'Skip Year', 
          action: onSkipYear, 
          description: 'Skip all categories for this year',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        { 
          label: 'Skip Entirely', 
          action: onSkipEntirely, 
          description: 'Skip to results page',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ]
    : [
        { 
          label: 'Skip Year', 
          action: onSkipYear, 
          description: 'Skip all categories for this year',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        { 
          label: 'Skip Entirely', 
          action: onSkipEntirely, 
          description: 'Skip to results page',
          icon: (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        }
      ];

  const buttonStyles = mode === 'sub' 
    ? "bg-white/20 hover:bg-white/30 text-white border-white/30 hover:border-white/40"
    : "bg-white/90 hover:bg-white text-slate-600 hover:text-slate-800 border-slate-200";

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm border ${buttonStyles}`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
        <span className="font-medium text-sm" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
          {getDefaultLabel()}
        </span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <div 
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          <div className={`absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 transform transition-all duration-200 origin-top-right ${
            isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}>
            <div className="px-3 pb-2 mb-2 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-700" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                Skip Options
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose how you'd like to proceed
              </p>
            </div>
            
            {menuItems.map((item, index) => (
              item.action && (
                <button
                  key={index}
                  onClick={() => handleSkipAction(item.action!)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-all duration-150 group flex items-start gap-3 rounded-lg mx-2"
                >
                  <div className="text-slate-400 group-hover:text-slate-600 transition-colors duration-150 mt-0.5">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm group-hover:text-slate-900 transition-colors duration-150">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {item.description}
                    </div>
                  </div>
                  <div className="text-slate-300 group-hover:text-slate-500 transition-colors duration-150 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              )
            ))}
            
            {/* Cancel option */}
            <div className="mt-2 pt-2 border-t border-slate-100 mx-2">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-all duration-150 group flex items-center gap-3 rounded-lg text-sm text-slate-500 hover:text-slate-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Cancel</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SkipDropdown;
