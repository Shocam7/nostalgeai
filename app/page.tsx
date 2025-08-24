import EmojiBackground from './components/EmojiBackground';

export const metadata = {
  title: "NostalgeAI - Step Down Memory Lane",
  description: "Explore your memories with AI",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 relative overflow-hidden">
      {/* WhatsApp-style Emoji Collage Background */}
      <EmojiBackground />

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

      </div>
    </div>
  );
                          }
