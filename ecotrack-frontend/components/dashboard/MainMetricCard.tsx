"use client";

import { motion, Variants } from "framer-motion";
import { Sparkles, Leaf } from "lucide-react";

// Match this with your AlertResponse DTO from Spring Boot
interface AlertData {
  total: number;
  limit: number;
  percentage: number;
  status: "SAFE" | "WARNING" | "EXCEEDED" | "INFO";
  message: string;
}

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
  },
};

export default function MainMetricCard({ data }: { data: AlertData | null }) {
  // Logic to determine visual "stress" based on carbon limit
  const isWarning = data?.status === "WARNING" || data?.status === "EXCEEDED";
  const glowBorder = isWarning 
    ? "border-orange-500/40 shadow-[0_0_40px_rgba(249,115,22,0.1)]" 
    : "border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.05)]";

  return (
    <motion.div 
      variants={itemVariants}
      className={`relative h-full bg-zinc-900/40 backdrop-blur-3xl border ${glowBorder} p-10 rounded-[3rem] overflow-hidden group`}
    >
      {/* Decorative Background Icon */}
      <div className="absolute -right-10 -bottom-10 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
        <Leaf size={300} strokeWidth={1} />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-16">
          <div className="flex flex-col gap-1">
            <span className="px-4 py-1.5 bg-white/5 rounded-full text-[10px] font-black tracking-[0.2em] text-zinc-400 border border-white/5 uppercase">
              Monthly Footprint
            </span>
          </div>
          <motion.div 
            animate={isWarning ? { scale: [1, 1.2, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Sparkles className={isWarning ? "text-orange-400" : "text-emerald-400"} size={24} />
          </motion.div>
        </div>
        
        <div className="flex items-baseline gap-4 mb-2">
          <h2 className="text-8xl md:text-9xl font-black tracking-tighter leading-none">
            {data?.total?.toFixed(1) || "0.0"}
          </h2>
          <div className="flex flex-col">
             <span className="text-2xl text-zinc-600 font-bold uppercase tracking-widest leading-none">kg CO₂</span>
             <span className="text-zinc-500 text-xs font-medium mt-1">/ {data?.limit || 0} limit</span>
          </div>
        </div>
        
        {/* Bouncy Progress Bar */}
        <div className="w-full bg-white/5 h-5 rounded-full mt-10 overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(data?.percentage || 0, 100)}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 30, delay: 0.5 }}
            className={`h-full ${isWarning ? 'bg-orange-500' : 'bg-emerald-500'} transition-colors duration-500`}
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <p className={`text-sm font-semibold tracking-tight ${isWarning ? 'text-orange-200/70' : 'text-emerald-200/70'}`}>
            {data?.message || "Analyzing your data..."}
          </p>
          <span className="text-[10px] font-mono text-zinc-600 font-bold">
            {data?.percentage?.toFixed(0) || 0}% UTILIZED
          </span>
        </div>
      </div>
    </motion.div>
  );
}