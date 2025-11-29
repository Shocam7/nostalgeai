// app/components/MovieUploadModal.tsx
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, FileVideo, Zap, Loader2 } from "lucide-react"; 
import { BatButton } from "./CartoonUI";
import { supabase } from "@/lib/supabaseClient";
import { TMDBMovie } from "@/lib/types";

interface Props {
  movie: TMDBMovie;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface GenStats {
  model: string;
  time: string;
}

export default function MovieUploadModal({ movie, isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // AI Generation States
  const [generating, setGenerating] = useState(false);
  const [genStats, setGenStats] = useState<GenStats | null>(null);
  const [timer, setTimer] = useState(0.0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  // Timer logic for the loader display (Feature 3 & 6)
  useEffect(() => {
    if (generating) {
      const startTime = Date.now();
      timerInterval.current = setInterval(() => {
        setTimer((Date.now() - startTime) / 1000);
      }, 100);
    } else {
      if (timerInterval.current) clearInterval(timerInterval.current);
    }
    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [generating]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 50 * 1024 * 1024) {
      setError("FILE SIZE EXCEEDS PROTOCOL LIMIT (50MB).");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
    // Reset generation stats on new file
    setGenStats(null);
    setTimer(0);
  };

  const validateDuration = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (duration < 3 || duration > 10) {
        setError("CLIP LENGTH INVALID. MUST BE 3-10 SECONDS.");
        setFile(null);
        setPreview(null);
      }
    }
  };

  // Logic for generating description and individuals (Features 1-7)
  const handleGenerate = async () => {
    if (!file) {
      setError("UPLOAD FOOTAGE BEFORE ANALYSIS.");
      return;
    }
    
    setGenerating(true);
    setError("");
    setGenStats(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Hits the Next.js API route that handles Gemini
      const response = await fetch("/api/analyze-evidence", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Analysis Failed");

      // Fill input boxes (Feature 2 & 7)
      setDescription(data.description);
      // Remove any trailing commas or empty spaces
      setPeople(data.individuals.replace(/^,|,$/g, '').trim()); 
      
      // Display model stats (Feature 6)
      setGenStats({
        model: data.model,
        time: data.duration
      });

    } catch (err: any) {
      console.error(err);
      setError("AI ANALYSIS FAILED: " + err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!file) return setError("NO FOOTAGE DETECTED.");
    setLoading(true);
    setError("");

    try {
      // Logic identical to previous version, just styled differently
      const { data: existingMemories } = await supabase
        .from("memory_movies")
        .select("id, folder, title")
        .eq("title", movie.title)
        .single();
        
      let memoryId = existingMemories?.id;
      let folderName = existingMemories?.folder;
      let memoryTitle = existingMemories?.title || movie.title;
      
      if (!memoryId) {
        const { data: newMemory, error: memError } = await supabase
          .from("memories")
          .insert({ class_id: "movies", title: movie.title, notes: movie.overview })
          .select().single();
        if (memError) throw memError;
        memoryId = newMemory.id;
        folderName = movie.title.toLowerCase().replace(/[^a-z0-9]/g, "-");
        
        const { error: movieError } = await supabase.from("memory_movies").insert({
          id: memoryId,
          title: movie.title,
          folder: folderName,
          release_year: new Date(movie.release_date).getFullYear(),
          popularity: movie.popularity,
          poster_img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          languages: [movie.original_language],
          cast_members: [],
        });
        if (movieError) throw movieError;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("memoryId", memoryId);
      formData.append("folderName", `movies/${folderName}`);

      const uploadRes = await fetch("/api/b2/upload", { method: "POST", body: formData });
      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");
      
      const { error: clipError } = await supabase.from("memory_clips").insert({
        memory_id: memoryId,
        memory_title: memoryTitle,
        memory_folder: folderName,
        clip_url: uploadData.key,
        description: description,
        people: people ? { names: people.split(",").map((s) => s.trim()) } : null,
      });
      if (clipError) throw clipError;
      await supabase.rpc('increment_clips_count', { row_id: memoryId });

      setLoading(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "SYSTEM MALFUNCTION.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#121212] w-full max-w-lg border-2 border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Bat-Header */}
          <div className="bg-[#FFD700] p-3 flex justify-between items-center">
            <h2 className="evidence text-xl font-black text-black font-['Bangers'] tracking-widest uppercase">
              NEW EVIDENCE ENTRY: {movie.title}
            </h2>
            <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-full">
              <X size={24} color="black" strokeWidth={3} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-5 text-gray-300">
            
            {/* Movie Details */}
            <div className="flex gap-4 items-start bg-[#1E1E1E] p-3 border-l-4 border-[#FFD700]">
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt="Poster"
                className="w-16 h-auto border border-gray-600"
              />
              <div>
                <p className="font-bold text-[#FFD700] uppercase text-sm">Target Subject</p>
                <p className="font-bold text-lg leading-tight text-white">{movie.title}</p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-mono">{movie.overview}</p>
              </div>
            </div>

            {/* Upload Zone */}
            <div className="space-y-2">
              <label className="block text-[#FFD700] text-xs font-bold uppercase tracking-widest">Footage Source</label>
              <div className="border-2 border-dashed border-gray-600 bg-black p-6 text-center hover:border-[#FFD700] transition-colors cursor-pointer relative group">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                />
                {!preview ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500 group-hover:text-[#FFD700]">
                    <FileVideo size={40} />
                    <span className="font-mono text-sm">UPLOAD SURVEILLANCE CLIP (3-10s)</span>
                  </div>
                ) : (
                  <div className="relative z-0">
                    {file?.type.startsWith("video") ? (
                      <video
                        ref={videoRef}
                        src={preview}
                        controls
                        onLoadedMetadata={validateDuration}
                        className="w-full border border-[#333]"
                      />
                    ) : (
                      <img src={preview} alt="Preview" className="w-full border border-[#333]" />
                    )}
                    <p className="text-xs font-mono mt-2 text-[#FFD700]">{file?.name}</p>
                  </div>
                )}
              </div>
              {error && <p className="text-red-500 font-mono text-xs animate-pulse">:: ERROR: {error} ::</p>}
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex justify-between items-end mb-1">
                  <label className="block text-[#FFD700] text-xs font-bold uppercase tracking-widest">Incident Report</label>
                  
                  {/* GENERATE BUTTON (Feature 1 & 3) */}
                  {file && (
                    <button
                      onClick={handleGenerate}
                      disabled={generating}
                      className="flex items-center gap-2 bg-[#FFD700] text-black px-3 py-1 text-xs font-bold uppercase hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {generating ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          <span>{timer.toFixed(1)}s</span>
                        </>
                      ) : (
                        <>
                          <Zap size={12} fill="black" />
                          <span>Generate</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                <textarea
                  className="w-full bg-black border border-gray-600 p-3 text-white focus:border-[#FFD700] focus:outline-none font-mono text-sm"
                  rows={4} // Increased rows for better description display
                  placeholder="Describe the event..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                
                {/* GEN STATS BOX (Feature 6) */}
                {genStats && (
                  <div className="w-full bg-black border border-gray-600 p-1 px-2 mt-1">
                    <p className="text-[10px] text-gray-400 font-mono flex justify-between uppercase">
                      <span>Model: {genStats.model}</span>
                      <span>Latency: {genStats.time} s</span>
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-[#FFD700] text-xs font-bold uppercase tracking-widest">Identified Individuals</label>
                <input
                  type="text"
                  className="w-full bg-black border border-gray-600 p-3 text-white focus:border-[#FFD700] focus:outline-none font-mono text-sm"
                  placeholder="e.g. Joker, Penguin..."
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#111] border-t border-[#333] flex gap-3">
            <BatButton variant="danger" onClick={onClose} className="flex-1 text-sm">
              ABORT
            </BatButton>
            <BatButton variant="primary" onClick={handleSave} loading={loading} className="flex-1 text-sm">
              <Save size={16} /> ARCHIVE DATA
            </BatButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
          }
