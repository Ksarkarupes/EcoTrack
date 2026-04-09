"use client";

import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Home() {
  const router = useRouter();

  // Animation variants with explicit TypeScript typing
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.15, 
        delayChildren: 0.3 
      }
    }
  };

  const item: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      } 
    }
  };

  return (
    <main className="relative h-screen w-full flex flex-col items-center justify-center bg-[#000000] overflow-hidden selection:bg-emerald-500/30">
      
      {/* Premium Background Glows - Apple Aesthetic */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Brand Icon with Glassmorphism */}
        <motion.div 
          variants={item} 
          className="mb-8 p-5 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl"
        >
          <Leaf className="text-emerald-400" size={42} strokeWidth={1.5} />
        </motion.div>

        {/* Nike-Style Mega Heading */}
        <motion.h1 
          variants={item}
          className="text-7xl md:text-9xl font-black tracking-tighter text-white mb-6 leading-[0.85]"
        >
          ECO<span className="text-zinc-700">TRACK.</span>
        </motion.h1>

        {/* High-Fidelity Body Copy */}
        <motion.p 
          variants={item}
          className="text-zinc-400 text-lg md:text-2xl font-medium max-w-[500px] leading-snug mb-14 tracking-tight"
        >
          Quantify your impact. <br /> 
          <span className="text-zinc-100">The intelligence layer for a sustainable future.</span>
        </motion.p>

        {/* Bouncy Action Buttons with Spring Physics */}
        <motion.div variants={item} className="flex flex-col sm:flex-row gap-5 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/auth/login")}
            className="px-12 py-6 bg-white text-black text-xl font-bold rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-zinc-100 transition-colors"
          >
            Get Started
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)", y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/auth/register")}
            className="px-12 py-6 border-2 border-zinc-800 text-white text-xl font-bold rounded-full transition-all backdrop-blur-sm"
          >
            Create Account
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Subtle Footer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 text-zinc-700 font-mono text-[10px] tracking-[0.3em] uppercase pointer-events-none"
      >
        Design Driven • Data Focused • 2026
      </motion.div>
    </main>
  );
}