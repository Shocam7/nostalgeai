import React from 'react';

interface MemoryResult {
  year: number;
  categories: {
    [categoryId: string]: string[];
  };
}

interface ResultsPageProps {
  memories: MemoryResult[];
  onBack: () => void;
  onStartOver: () => void;
}

const memoryClassNames = {
  movies: 'Movies',
  tv: 'TV Shows',
  music: 'Music',
  goals: 'Goals',
  trips: 'Trips',
  academics: 'Academics',
  games: 'Games',
  sports: 'Sports',
  relations: 'Relations',
  hobbies: 'Hobbies',
  purchases: 'Purchases',
  achievements: 'Achievements',
  failures: 'Failures',
  aesthetic: 'Aesthetic'
};

const ResultsPage = ({ memories, onBack, onStartOver }: ResultsPageProps) => {
  const totalMemories = memories.reduce((total, yearData) => {
    return total + Object.values(yearData.categories).reduce((yearTotal, categoryMemories) => {
      return yearTotal + categoryMemories.length;
    }, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 hover:bg-white rounded-full text-slate-700 hover:text-slate-800 transition-all duration-200 shadow-sm hover:shadow-md backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back</span>
        </button>
        
        <button 
          onClick={onStartOver}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-full text-white transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span className="font-medium">Start Over</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-12 relative z-10">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mb-4"
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            Your Memory Journey
          </h1>
          <p className="text-lg text-slate-600 mb-2"
             style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            A collection of {totalMemories} memories across {memories.length} years
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200"></div>
            
            {memories.map((yearData, index) => (
              <div key={yearData.year} className="relative mb-16 last:mb-8">
                {/* Year Marker */}
                <div className="absolute left-0 top-6 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <span className="text-sm font-bold text-slate-700"
                        style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                    {yearData.year}
                  </span>
                </div>

                {/* Year Content */}
                <div className="ml-24">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-100">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6"
                        style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                      {yearData.year} Memories
                    </h2>
                    
                    {Object.entries(yearData.categories).map(([categoryId, memories]) => (
                      <div key={categoryId} className="mb-6 last:mb-0">
                        <h3 className="text-lg font-semibold text-slate-700 mb-3 flex items-center"
                            style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mr-3"></div>
                          {memoryClassNames[categoryId as keyof typeof memoryClassNames]} 
                          <span className="ml-2 text-sm text-slate-500 font-normal">
                            ({memories.length})
                          </span>
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {memories.map((memory, memoryIndex) => (
                            <div key={memoryIndex} 
                                 className="px-4 py-2 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg text-sm text-slate-700 border border-slate-200 hover:shadow-sm transition-shadow duration-200">
                              {memory}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="max-w-2xl mx-auto mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center"
                style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
              Journey Summary
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {memories.length}
                </div>
                <div className="text-sm text-slate-600">Years Captured</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {Object.keys(memories.reduce((acc, year) => ({...acc, ...year.categories}), {})).length}
                </div>
                <div className="text-sm text-slate-600">Categories</div>
              </div>
              
              <div className="text-center sm:col-span-1 col-span-2">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {totalMemories}
                </div>
                <div className="text-sm text-slate-600">Total Memories</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;