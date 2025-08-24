import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NostalgeAI - Step Down Memory Lane",
  description: "Explore your memories with AI",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-amber-200 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-orange-200 rounded-full blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-yellow-200 rounded-full blur-2xl"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-amber-300 rounded-full blur-xl"></div>
      </div>

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-800 dark:text-amber-200" 
            style={{fontFamily: 'Cinzel, Georgia, serif'}}>
          NostalgeAI
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-8 relative z-10">
        
        {/* Central Text */}
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-slate-800 dark:text-slate-200 leading-tight mb-4"
              style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            Do you want to step down the{' '}
            <span className="text-amber-700 dark:text-amber-400 font-semibold">
              memory lane
            </span>
            ?
          </h2>
        </div>

        {/* Dive In Button */}
        <div className="relative group">
          <button className="relative bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-semibold text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-out min-w-[200px] backdrop-blur-sm border border-amber-500/20"
                  style={{fontFamily: 'Crimson Text, Times New Roman, serif'}}>
            
            {/* Button Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center gap-3">
              <span>Dive in</span>
              <svg 
                className="w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Ripple Effect */}
            <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-110 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out"></div>
          </button>
          
          {/* Button Shadow */}
          <div className="absolute inset-0 bg-amber-600/30 rounded-full blur-xl scale-110 group-hover:scale-125 transition-transform duration-300 -z-10"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-12 opacity-30">
          <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute top-1/3 right-16 opacity-40">
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse delay-300"></div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 opacity-25">
          <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-700"></div>
        </div>

      </div>

      {/* Floating Memory Icons */}
      <div className="absolute top-20 right-1/4 opacity-20 animate-float">
        <svg className="w-8 h-8 text-amber-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      </div>
      
      <div className="absolute bottom-1/4 right-12 opacity-15 animate-float delay-500">
        <svg className="w-10 h-10 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
        </svg>
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Crimson+Text:wght@400;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
