// components/MovieUploadModal.tsx
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Film, Save } from "lucide-react";
import { CartoonButton } from "./CartoonUI";
import { supabase } from "@/lib/supabaseClient";
import { TMDBMovie } from "@/lib/types";

interface Props {
  movie: TMDBMovie;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function MovieUploadModal({ movie, isOpen, onClose, onSuccess }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [people, setPeople] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (max 50MB for example)
    if (selected.size > 50 * 1024 * 1024) {
      setError("File too big! Keep it under 50MB.");
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setError("");
  };

  const validateDuration = () => {
    if (videoRef.current) {
      const duration = videoRef.current.duration;
      if (duration < 3 || duration > 10) {
        setError("Clips must be between 3 and 10 seconds!");
        setFile(null);
        setPreview(null);
      }
    }
  };

  const handleSave = async () => {
    if (!file) return setError("Please choose a file!");
    setLoading(true);
    setError("");

    try {
      // 1. Check if Memory exists, else create it
      const { data: existingMemories } = await supabase
        .from("memory_movies")
        .select("id, folder, title")
        .eq("title", movie.title)
        .single();

      let memoryId = existingMemories?.id;
      let folderName = existingMemories?.folder;
      let memoryTitle = existingMemories?.title || movie.title;

      if (!memoryId) {
        // Create generic memory
        const { data: newMemory, error: memError } = await supabase
          .from("memories")
          .insert({
            class_id: "movies",
            title: movie.title,
            notes: movie.overview,
          })
          .select()
          .single();

        if (memError) throw memError;
        memoryId = newMemory.id;
        folderName = movie.title.toLowerCase().replace(/[^a-z0-9]/g, "-");

        // Create movie specific memory
        const { error: movieError } = await supabase.from("memory_movies").insert({
          id: memoryId,
          title: movie.title,
          folder: folderName,
          release_year: new Date(movie.release_date).getFullYear(),
          popularity: movie.popularity,
          poster_img: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          languages: [movie.original_language],
          region: "US", // Defaulting for now
          cast_members: [], // Would fetch credits in a real full app
        });

        if (movieError) throw movieError;
      }

      // 2. Upload to Backblaze via API Route
      const formData = new FormData();
      formData.append("file", file);
      formData.append("memoryId", memoryId);

      const uploadRes = await fetch("/api/b2/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadData.success) throw new Error(uploadData.error || "Upload failed");

      // 3. Insert Clip Record
      const { error: clipError } = await supabase.from("memory_clips").insert({
        memory_id: memoryId,
        memory_title: memoryTitle,
        memory_folder: folderName,
        clip_url: uploadData.key, // Key returned from B2
        description: description,
        people: people ? { names: people.split(",").map((s) => s.trim()) } : null,
      });

      if (clipError) throw clipError;

      // 4. Update memory count
      await supabase.rpc('increment_clips_count', { row_id: memoryId }); // Optional: if you have an RPC

      setLoading(false);
      onSuccess();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong!");
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
        className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.5, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#FFF4E0] w-full max-w-lg rounded-3xl border-[6px] border-black shadow-[15px_15px_0px_0px_rgba(255,144,232,1)] overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="bg-[#FF90E8] p-4 border-b-4 border-black flex justify-between items-center">
            <h2 className="text-2xl font-black text-black uppercase tracking-tighter">
              Add Clip: {movie.title}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <X size={28} strokeWidth={3} />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Movie Info */}
            <div className="flex gap-4 items-start bg-white p-3 rounded-xl border-2 border-black border-dashed">
              <img
                src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                alt="Poster"
                className="rounded-lg border-2 border-black"
              />
              <div>
                <p className="font-bold text-lg leading-tight">{movie.title}</p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{movie.overview}</p>
              </div>
            </div>

            {/* File Upload */}
            <div className="space-y-2">
              <label className="block font-bold text-lg">🎥 Upload Clip</label>
              <div className="border-4 border-black border-dashed rounded-xl bg-blue-50 p-6 text-center hover:bg-blue-100 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {!preview ? (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <Upload size={40} />
                    <span className="font-bold">Tap to upload (3-10s video)</span>
                  </div>
                ) : (
                  <div className="relative">
                    {file?.type.startsWith("video") ? (
                      <video
                        ref={videoRef}
                        src={preview}
                        controls
                        onLoadedMetadata={validateDuration}
                        className="w-full rounded-lg border-2 border-black"
                      />
                    ) : (
                      <img src={preview} alt="Preview" className="w-full rounded-lg border-2 border-black" />
                    )}
                    <p className="text-xs font-bold mt-2 text-green-600">{file?.name}</p>
                  </div>
                )}
              </div>
              {error && <p className="text-red-600 font-bold animate-pulse">{error}</p>}
            </div>

            {/* Inputs */}
            <div className="space-y-2">
              <label className="block font-bold">📝 Description</label>
              <textarea
                className="w-full border-4 border-black rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-[#23A6F0]"
                rows={2}
                placeholder="What happened in this scene?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block font-bold">👥 People (comma separated)</label>
              <input
                type="text"
                className="w-full border-4 border-black rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-[#23A6F0]"
                placeholder="Batman, Joker, Robin..."
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-gray-100 border-t-4 border-black flex gap-3">
            <CartoonButton variant="danger" onClick={onClose} className="flex-1">
              Cancel
            </CartoonButton>
            <CartoonButton variant="success" onClick={handleSave} loading={loading} className="flex-1">
              <Save size={20} /> Save Memory
            </CartoonButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
          }
