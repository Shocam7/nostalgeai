// components/CartoonUI.tsx
import { motion } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CartoonCard = ({ children, className, onClick }: any) => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: -2 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "bg-white border-4 border-black rounded-3xl p-4 cursor-pointer relative overflow-hidden",
      "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(35,166,240,1)] transition-shadow",
      className
    )}
  >
    {children}
  </motion.div>
);

export const CartoonButton = ({ children, onClick, variant = "primary", disabled, loading }: any) => {
  const colors = {
    primary: "bg-[#23A6F0] text-white hover:bg-[#1a8cd4]",
    secondary: "bg-[#FF90E8] text-black hover:bg-[#ff7be2]",
    danger: "bg-[#FF4D4D] text-white hover:bg-[#ff3333]",
    success: "bg-[#00CC66] text-white hover:bg-[#00b359]"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        "font-bold py-3 px-6 rounded-2xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        "flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        colors[variant as keyof typeof colors]
      )}
    >
      {loading ? "Working..." : children}
    </motion.button>
  );
};
