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
    return mode === 'sub' ? 'Skip Memory' : 'Skip Year';
  };

  const menuItems = mode === 'sub' 
    ? [
        { label: 'Skip Memory', action: onSkipMemory, description: 'Skip current category' },
        { label: 'Skip Year', action: onSkipYear, description: 'Skip entire year' },
        { label: 'Skip Entirely', action: onSkipEntirely, description: 'Skip all remaining years' }
      ]
    : [
        { label: 'Skip Year', action: onSkipYear, description: 'Skip entire year' },
        { label: 'Skip Entirely', action: onSkipEntirely, description: 'Skip all remaining years' }
      ];

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full text-slate-600 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm border border-slate-200"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="font-medium text-sm">{getDefaultLabel()}</span>
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
        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {menuItems.map((item, index) => (
            item.action && (
              <button
                key={index}
                onClick={() => handleSkipAction(item.action!)}
                className="w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors duration-150 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-slate-800 text-sm group-hover:text-slate-900">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {item.description}
                    </div>
                  </div>
                  <svg 
                    className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors mt-0.5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default SkipDropdown;
