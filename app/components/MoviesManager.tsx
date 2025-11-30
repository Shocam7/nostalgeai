// app/components/MoviesManager.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Search, Filter, ArrowLeft, Database } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BatCard, BatButton, BatSelect } from "./CartoonUI";
import MovieUploadModal from "./MovieUploadModal";
import { TMDBMovie } from "@/lib/types";

/* --- Static Data for Filters --- */
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

  // Pagination + transition states
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 20;

  // Transition overlay
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<number | null>(null);

  // Fetch functions
  const fetchTrending = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tmdb/trending");
      const data = await res.json();
      setMovies(data.results || []);
      setCurrentPage(1); // reset pagination
    } catch (e) {
      console.error(e);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return fetchTrending();
    setLoading(true);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(search)}`);
      const data = await res.json();
      setMovies(data.results || []);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setMovies([]);
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
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrending();
    // cleanup transition timeout on unmount
    return () => {
      if (transitionTimeout.current) window.clearTimeout(transitionTimeout.current);
    };
  }, []);

  // SORT BY POPULARITY (default) -- memoized for perf
  const sortedMovies = useMemo(() => {
    return [...movies].sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
  }, [movies]);

  const totalPages = Math.max(1, Math.ceil(sortedMovies.length / moviesPerPage));
  const indexOfLast = currentPage * moviesPerPage;
  const indexOfFirst = indexOfLast - moviesPerPage;
  const currentMovies = sortedMovies.slice(indexOfFirst, indexOfLast);

  // Transition helper: full-screen smoke burst, then update page
  const triggerPageChangeWithSmoke = (nextPage: number) => {
    // if already on that page, do nothing
    if (nextPage === currentPage) return;

    // start transition overlay
    setIsTransitioning(true);

    // after a short delay, change the page so new items will fade in with smoke clearing
    // timings tuned to be cinematic:
    // - smoke builds for 450ms, then we switch page at 450ms
    // - overlay finishes fade at 1200ms
    if (transitionTimeout.current) window.clearTimeout(transitionTimeout.current);

    transitionTimeout.current = window.setTimeout(() => {
      setCurrentPage(nextPage);
      // finish transition after a bit more
      transitionTimeout.current = window.setTimeout(() => {
        setIsTransitioning(false);
      }, 750);
    }, 450);
  };

  // Bat (Nolan-style) SVG — simplified, sharp silhouette
  const NolanBatSVG = ({ size = 36 }: { size?: number }) => (
    <svg viewBox="0 0 64 32" width={size} height={(size * 32) / 64} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M2 20c6-6 12-8 20-8 2 0 4-2 6-4s3-4 6-4 4 2 6 4 4 4 6 4c8 0 14 2 20 8-8 0-12-4-20-4-2 0-4 2-6 4s-3 4-6 4-4-2-6-4-4-4-6-4C14 16 10 20 2 20z"
        fill="#000"
      />
      <ellipse cx="32" cy="16" rx="30" ry="12" fill="#FFD700" opacity="0.95" />
      <path
        d="M6 20c6-6 12-8 20-8 2 0 4-2 6-4s3-4 6-4 4 2 6 4 4 4 6 4c8 0 14 2 20 8-8 0-12-4-20-4-2 0-4 2-6 4s-3 4-6 4-4-2-6-4-4-4-6-4C14 16 10 20 6 20z"
        fill="#000"
        opacity="0.95"
      />
    </svg>
  );

  return (
    <div className="batman-theme movies-manager-screen min-h-screen p-4 pb-20 relative">

      {/* FULL-SCREEN SMOKE OVERLAY (AnimatePresence + motion) */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            key="smoke-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center"
            aria-hidden
          >
            {/* layered smoke shapes */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: [0.95, 1.02, 0.98, 1.0] }}
              transition={{ duration: 0.9, times: [0, 0.5, 0.8, 1] }}
              className="absolute inset-0"
            >
              {/* radial yellow wash */}
              <div
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(255,215,0,0.12) 0%, rgba(0,0,0,0.85) 40%)",
                }}
                className="absolute inset-0"
              />
              {/* big blurred smoke */}
              <div className="absolute -top-20 -left-20 w-[140vw] h-[140vh] opacity-95 blur-[36px] mix-blend-multiply"
                   style={{
                     background: "radial-gradient(circle at 30% 40%, rgba(0,0,0,0.9), rgba(0,0,0,0.95) 30%, rgba(255,215,0,0.04) 60%)"
                   }}
              />
              <div className="absolute -bottom-10 -right-10 w-[100vw] h-[90vh] opacity-90 blur-[48px]"
                   style={{
                     background: "radial-gradient(circle at 80% 70%, rgba(0,0,0,0.95), rgba(255,215,0,0.02))"
                   }}
              />
            </motion.div>

            {/* Centered Quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
              className="relative z-[100000] text-center px-6"
            >
              <p className="text-2xl md:text-4xl font-black uppercase tracking-wider text-[#FFD700] drop-shadow-[0_0_12px_#000]">
                Theatricality and deception are powerful agents.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
        <>
          <motion.div
            key={`grid-page-${currentPage}-${movies.length}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6"
          >
            {currentMovies.map((movie) => (
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
                      {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
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
          </motion.div>

          {/* PAGINATION — Nolan Bat symbols for prev/next */}
          <div className="flex justify-center items-center gap-6 mt-10 text-white font-mono">
            <button
              onClick={() => triggerPageChangeWithSmoke(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1 || isTransitioning}
              aria-label="Previous page"
              className="flex items-center gap-2 p-2 rounded-md hover:scale-105 transition-transform disabled:opacity-40"
            >
              <div className="w-14 h-8 flex items-center justify-center">
                {/* Nolan-style bat as black silhouette on yellow oval */}
                <NolanBatSVG size={42} />
              </div>
              <span className="hidden md:inline-block text-sm">PREV</span>
            </button>

            <div className="text-[#FFD700]">
              Page {currentPage} / {totalPages}
            </div>

            <button
              onClick={() => triggerPageChangeWithSmoke(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages || isTransitioning}
              aria-label="Next page"
              className="flex items-center gap-2 p-2 rounded-md hover:scale-105 transition-transform disabled:opacity-40"
            >
              <span className="hidden md:inline-block text-sm">NEXT</span>
              <div className="w-14 h-8 flex items-center justify-center">
                <NolanBatSVG size={42} />
              </div>
            </button>
          </div>
        </>
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
    
