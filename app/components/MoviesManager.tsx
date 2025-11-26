"use client";

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

  useEffect(() => {
    fetchTrending();
  }, []);

  return (
    <div className="batman-theme movies-manager-screen min-h-screen p-4 pb-20">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8 border-b-2 border-[#333] pb-6 control-panel">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 font-black text-[#FFD700] hover:text-white transition-colors"
        >
          <ArrowLeft size={28} /> SYSTEM_EXIT
        </button>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl drop-shadow-[4px_4px_0px_#000]">
            GOTHAM ARCHIVES
          </h1>
          <p className="text-gray-400 font-['Rajdhani'] tracking-[0.3em]">
            SECURE DATABASE ACCESS // LEVEL 9
          </p>
        </div>

        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* CONTROL PANEL */}
      <div className="control-panel bg-[#111] border-2 border-[#333] p-6 mb-8 shadow-2xl relative">

        {/* Decorative Bolts */}
        <div className="absolute top-2 left-2 bolt" />
        <div className="absolute top-2 right-2 bolt" />
        <div className="absolute bottom-2 left-2 bolt" />
        <div className="absolute bottom-2 right-2 bolt" />

        <div className="flex flex-col gap-6">

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-3 text-gray-500 group-focus-within:text-[#FFD700]" />
              <input
                type="text"
                placeholder="DECRYPT MOVIE TITLE..."
                className="w-full bg-black border-2 border-[#333] p-3 pl-10 font-mono focus:border-[#FFD700] focus:outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <BatButton variant="primary" type="submit">SCAN</BatButton>
          </form>

          {/* FILTER PANEL */}
          <div className="filter-panel flex flex-col md:flex-row gap-4 items-end p-4 border border-[#333] rounded-sm">

            <div className="flex items-center gap-2 text-[#FFD700] mb-2 md:mb-0 md:mr-4">
              <Filter size={18} /> FILTERS:
            </div>

            <div className="grid grid-cols-3 gap-4 flex-1 w-full">
              <BatSelect label="Release Year" options={years} value={filterYear} onChange={(e: any) => setFilterYear(e.target.value)} />
              <BatSelect label="Region" options={regions} value={filterRegion} onChange={(e: any) => setFilterRegion(e.target.value)} />
              <BatSelect label="Language" options={languages} value={filterLang} onChange={(e: any) => setFilterLang(e.target.value)} />
            </div>

            <BatButton onClick={handleFilter} variant="secondary" className="w-full md:w-auto h-full">
              APPLY
            </BatButton>
          </div>

        </div>
      </div>

      {/* MOVIE GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin text-[#FFD700]">
            <Database size={64} />
          </div>
          <p className="decrypting-text font-mono">DECRYPTING SECURE FILES...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {movies.map((movie) => (
            <div key={movie.id} onClick={() => setSelectedMovie(movie)}>
              <BatCard className="poster-card h-full flex flex-col p-0 cursor-pointer">
                
                {/* Poster */}
                <div className="relative aspect-[2/3] w-full border-b-2 border-[#333]">
                  <img
                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/placeholder.png"}
                    alt={movie.title}
                    className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity"
                  />

                  {/* Year Badge */}
                  <div className="year-badge absolute top-0 right-0 px-2 py-1 font-black text-xs">
                    {new Date(movie.release_date).getFullYear()}
                  </div>
                </div>

                {/* Title */}
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

      {/* MODAL */}
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
                  
