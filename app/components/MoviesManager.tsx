// components/MoviesManager.tsx
import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft, Database } from "lucide-react";
import { BatCard, BatButton, BatSelect } from "./CartoonUI";
import MovieUploadModal from "./MovieUploadModal";
import { TMDBMovie } from "@/lib/types";

// --- Static Data for Filters ---
const years = Array.from({ length: 75 }, (_, i) => {
  const y = new Date().getFullYear() - i;
  return { value: y, label: y };
});

const regions = [
  { value: "US", label: "USA" },
  { value: "IN", label: "India" },
  { value: "GB", label: "United Kingdom" },
  { value: "FR", label: "France" },
  { value: "KR", label: "South Korea" },
  { value: "JP", label: "Japan" },
];

const languages = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
];

export default function MoviesManager({ onBack }: { onBack: () => void }) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Filter States
  const [filterYear, setFilterYear] = useState("");
  const [filterRegion, setFilterRegion] = useState("");
  const [filterLang, setFilterLang] = useState("");

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tmdb/trending");
      const data = await res.json();
      setMovies(data.results || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return fetchTrending();
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${search}`);
      const data = await res.json();
      setMovies(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();
      if (filterYear) params.append("year", filterYear);
      if (filterRegion) params.append("region", filterRegion);
      if (filterLang) params.append("languages", filterLang);

      const res = await fetch(`/api/tmdb/filter?${params.toString()}`);
      const data = await res.json();
      setMovies(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="batman-theme min-h-screen p-4 pb-20 bg-[url('/bat-grid.png')] bg-fixed">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8 border-b-2 border-[#333] pb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-black text-[#FFD700] hover:text-white transition-colors"
        >
          <ArrowLeft size={28} /> SYSTEM_EXIT
        </button>
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl text-[#FFD700] drop-shadow-[4px_4px_0px_#000]">
            GOTHAM ARCHIVES
          </h1>
          <p className="text-gray-400 font-['Rajdhani'] tracking-[0.3em]">SECURE DATABASE ACCESS // LEVEL 9</p>
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Control Panel */}
      <div className="bg-[#111] border-2 border-[#333] p-6 mb-8 shadow-2xl relative">
        {/* Decorative bolts */}
        <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-[#333]" />
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#333]" />
        <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-[#333]" />
        <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-[#333]" />

        <div className="flex flex-col gap-6">
          {/* Search Row */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-[#FFD700]" />
              <input
                type="text"
                placeholder="DECRYPT MOVIE TITLE..."
                className="w-full bg-black border-2 border-[#333] p-3 pl-10 text-white font-mono focus:border-[#FFD700] focus:outline-none focus:shadow-[0_0_15px_rgba(255,215,0,0.3)]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <BatButton type="submit" variant="primary">SCAN</BatButton>
          </form>

          {/* Filter Row */}
          <div className="flex flex-col md:flex-row gap-4 items-end bg-[#0a0a0a] p-4 border border-[#333] rounded-sm">
            <div className="flex items-center gap-2 text-[#FFD700] mb-2 md:mb-0 md:mr-4">
               <Filter size={18} /> FILTERS:
            </div>
            <div className="grid grid-cols-3 gap-4 flex-1 w-full">
              <BatSelect label="Release Year" options={years} value={filterYear} onChange={(e: any) => setFilterYear(e.target.value)} />
              <BatSelect label="Region" options={regions} value={filterRegion} onChange={(e: any) => setFilterRegion(e.target.value)} />
              <BatSelect label="Language" options={languages} value={filterLang} onChange={(e: any) => setFilterLang(e.target.value)} />
            </div>
            <BatButton onClick={handleFilter} variant="secondary" className="w-full md:w-auto h-full">APPLY</BatButton>
          </div>
        </div>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin text-[#FFD700]">
             <Database size={64} />
          </div>
          <p className="text-[#FFD700] font-mono animate-pulse">DECRYPTING SECURE FILES...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
              <BatCard className="h-full flex flex-col p-0 cursor-pointer">
                <div className="relative aspect-[2/3] w-full border-b-2 border-[#333]">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />
                  {/* Comic Badge */}
                  <div className="absolute top-0 right-0 bg-[#FFD700] text-black px-2 py-1 font-black text-xs border-l-2 border-b-2 border-black">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                </div>
                <div className="p-3 bg-[#151515]">
                  <h3 className="text-white font-bold text-sm leading-tight line-clamp-2 uppercase tracking-wide">
                    {movie.title}
                  </h3>
                </div>
              </BatCard>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedMovie && (
        <MovieUploadModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          onSuccess={() => {
            alert("EVIDENCE SECURED SUCCESSFULLY.");
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
}
