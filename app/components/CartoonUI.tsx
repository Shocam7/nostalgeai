// components/CartoonUI.tsx
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BatCard = ({ children, className, onClick }: any) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0px 0px 20px rgba(255, 215, 0, 0.4)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={cn(
      "bg-[#1E1E1E] border-2 border-[#333] relative overflow-hidden group",
      "shadow-[4px_4px_0px_0px_rgba(255,215,0,1)]", // Hard yellow shadow
      "hover:border-[#FFD700] hover:shadow-[6px_6px_0px_0px_rgba(255,215,0,1)] transition-all duration-200",
      className
    )}
  >
    {/* Tech lines decoration */}
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity" />
    {children}
  </motion.div>
);

export const BatButton = ({ children, onClick, variant = "primary", disabled, loading, className }: any) => {
  const variants = {
    primary: "bg-[#FFD700] text-black hover:bg-[#E5C100]",
    secondary: "bg-[#2C3E50] text-[#FFD700] border-[#FFD700] hover:bg-[#34495E]",
    danger: "bg-[#C0392B] text-white hover:bg-[#E74C3C]",
    success: "bg-[#27AE60] text-white hover:bg-[#2ECC71]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "font-black font-['Rajdhani'] uppercase py-2 px-6 border-2 border-black",
        "clip-path-polygon-[0_0,100%_0,95%_100%,5%_100%]", // Slight angular shape
        "flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {loading ? "PROCESSING..." : children}
    </motion.button>
  );
};

export const BatSelect = ({ value, onChange, options, label }: any) => (
  <div className="flex flex-col gap-1 w-full">
    {label && <span className="text-[#FFD700] text-xs font-bold uppercase tracking-widest">{label}</span>}
    <select
      value={value}
      onChange={onChange}
      className="bg-black text-white border-2 border-[#333] p-2 focus:border-[#FFD700] focus:outline-none font-['Rajdhani'] font-bold uppercase"
    >
      <option value="">ALL</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
