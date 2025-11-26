// components/MoviesManager.tsx
import { useState, useEffect } from "react";
import { Search, Filter, ArrowLeft } from "lucide-react";
import { CartoonCard } from "./CartoonUI";
import MovieUploadModal from "./MovieUploadModal";
import { TMDBMovie } from "@/lib/types";

export default function MoviesManager({ onBack }: { onBack: () => void }) {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null);

  // Filters
  const [year, setYear] = useState("");

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
      const res = await fetch(`/api/tmdb/filter?year=${year}`);
      const data = await res.json();
      setMovies(data.results || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="min-h-screen p-4 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-black text-xl hover:text-[#23A6F0] transition-colors"
        >
          <ArrowLeft size={32} /> Back to Hub
        </button>
        <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B6B] to-[#FFC900] drop-shadow-[2px_2px_0px_black]">
          MOVIE MANIA
        </h1>
      </div>

      {/* Controls */}
      <div className="bg-white border-4 border-black rounded-3xl p-4 mb-8 shadow-[8px_8px_0px_0px_#23A6F0]">
        <div className="flex flex-col md:flex-row gap-4">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full border-4 border-black rounded-xl p-3 font-bold focus:outline-none focus:bg-yellow-50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              type="submit"
              className="bg-[#FF90E8] border-4 border-black rounded-xl p-3 hover:scale-105 transition-transform"
            >
              <Search size={24} />
            </button>
          </form>

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Year"
              className="w-24 border-4 border-black rounded-xl p-3 font-bold"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
            <button
              onClick={handleFilter}
              className="bg-[#6BCB77] border-4 border-black rounded-xl p-3 hover:scale-105 transition-transform"
            >
              <Filter size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-black border-r-4 border-t-4 border-l-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
              <CartoonCard className="h-full flex flex-col p-0 pb-4 group">
                <div className="relative aspect-[2/3] w-full overflow-hidden border-b-4 border-black">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black rounded-full px-2 font-bold text-xs">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-black text-lg leading-tight line-clamp-2">{movie.title}</h3>
                </div>
              </CartoonCard>
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
            alert("Memory Saved Successfully! 🎉");
            setSelectedMovie(null);
          }}
        />
      )}
    </div>
  );
}
