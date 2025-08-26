import React, { useState, useEffect } from 'react';
import SkipDropdown from '../ui/SkipDropdown';

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

// Sample memory prompts for each category
const memoryPrompts = {
  movies: [
    "What movies did you watch this year?",
    "Any films that left a lasting impression?",
    "Movies you watched with friends or family?",
    "Cinema experiences you remember?"
  ],
  tv: [
    "What TV shows were you following?",
    "Any series you binge-watched?",
    "Shows you discussed with others?",
    "TV moments that stuck with you?"
  ],
  music: [
    "What songs were on repeat?",
    "Artists you discovered this year?",
    "Concerts or music events you attended?",
    "Albums that defined your year?"
  ],
  goals: [
    "What goals did you set for yourself?",
    "Resolutions you made?",
    "Personal challenges you took on?",
    "Aspirations you were working towards?"
  ],
  trips: [
    "Where did you travel this year?",
    "Day trips or adventures you took?",
    "Places you explored for the first time?",
    "Travel memories that stand out?"
  ],
  academics: [
    "What were you studying?",
    "Academic achievements or challenges?",
    "Subjects that interested you most?",
    "Learning experiences outside school?"
  ],
  games: [
    "What games were you playing?",
    "Gaming achievements or milestones?",
    "Games you played with others?",
    "Gaming memories that stood out?"
  ],
  sports: [
    "What sports were you involved in?",
    "Athletic achievements or challenges?",
    "Sports events you participated in or watched?",
    "Physical activities you enjoyed?"
  ],
  relations: [
    "New relationships you formed?",
    "Important conversations you had?",
    "People who influenced you this year?",
    "Relationship milestones or changes?"
  ],
  hobbies: [
    "What hobbies did you pursue?",
    "Creative projects you worked on?",
    "Skills you developed?",
    "Hobby-related achievements?"
  ],
  purchases: [
    "Significant purchases you made?",
    "Items you saved up for?",
    "Purchases you were excited about?",
    "Things you bought that mattered to you?"
  ],
  achievements: [
    "What were you proud of this year?",
    "Goals you accomplished?",
    "Recognition you received?",
    "Personal victories, big or small?"
  ],
  failures: [
    "Challenges you faced?",
    "Things that didn't go as planned?",
    "Lessons learned from setbacks?",
    "Mistakes that taught you something?"
  ],
  aesthetic: [
    "Beautiful moments you witnessed?",
    "Art, nature, or scenes that moved you?",
    "Aesthetic experiences that inspired you?",
    "Visual memories that stayed with you?"
  ]
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
  const [memories, setMemories] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  
  const prompts = memoryPrompts[categoryId as keyof typeof memoryPrompts] || [
    `What ${categoryName.toLowerCase()} memories do you have from ${currentYear}?`
  ];

  const selectedPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  const handleAddMemory = () => {
    if (currentInput.trim()) {
      setMemories([...memories, currentInput.trim()]);
      setCurrentInput('');
    }
  };

  const handleRemoveMemory = (index: number) => {
    setMemories(memories.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddMemory();
    }
  };

  const handleSave = () => {
    onSave(memories);
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
            {selectedPrompt}
          </p>
        </div>

        {/* Memory Input Section */}
        <div className="max-w-2xl mx-auto w-full mb-6 flex-shrink-0">
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Share a ${categoryName.toLowerCase()} memory from ${currentYear}...`}
              className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/70 resize-none focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 backdrop-blur-sm transition-all duration-200"
              rows={3}
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
            />
            <div className="flex justify-end mt-4">
              <button
                onClick={handleAddMemory}
                disabled={!currentInput.trim()}
                className="px-6 py-2 bg-white/30 hover:bg-white/40 disabled:bg-white/10 disabled:text-white/40 text-white font-medium rounded-xl transition-all duration-200 backdrop-blur-sm border border-white/20 hover:border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}
              >
                Add Memory
              </button>
            </div>
          </div>
        </div>

        {/* Memories List - Scrollable */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          {memories.length > 0 ? (
            <div className="max-w-2xl mx-auto space-y-3 pb-6">
              {memories.map((memory, index) => (
                <div 
                  key={index} 
                  className="bg-white/15 backdrop-blur-md rounded-xl p-4 border border-white/20 group hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] animate-in slide-in-from-bottom-3 duration-300"
                  style={{
                    animationDelay: `${index * 100}ms`
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-white/60 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white leading-relaxed"
                           style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                          {memory}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveMemory(index)}
                      className="text-white/60 hover:text-white transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
                      title="Remove memory"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-white/60 mt-16 max-w-md mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-lg font-medium mb-2" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  No memories yet
                </p>
                <p className="text-sm opacity-80 leading-relaxed">
                  Start typing above to capture your memories from this category. You can always save with no memories if you prefer to skip.
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
          
          {memories.length > 0 && (
            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/20">
                <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-white/80 text-sm font-medium" style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                  {memories.length} {memories.length === 1 ? 'memory' : 'memories'} added
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