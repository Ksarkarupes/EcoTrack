"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Target, User, ArrowRight, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/api";

export default function OnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [limit, setLimit] = useState("500");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const handleFinish = async () => {
    if (!fullName || !limit) return;
    setLoading(true);
    try {
      await api.post("/user/build", {
        fullName: fullName,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        monthlyCarbonLimit: parseFloat(limit)
      });
      
      // Update storage so Dashboard greeting is instant
      localStorage.setItem("username", fullName);
      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to build profile", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 overflow-hidden selection:bg-emerald-500/30">
      {/* Visual Depth Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        variants={container} initial="hidden" animate="show"
        className="w-full max-w-lg z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-12 rounded-[3.5rem] shadow-2xl">
          
          <motion.div variants={item} className="mb-12">
            <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
              <Sparkles className="text-emerald-400" size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">
              ALMOST <br /> <span className="text-zinc-600">THERE.</span>
            </h1>
            <p className="text-zinc-500 font-medium mt-4">Personalize your sustainability experience.</p>
          </motion.div>

          <div className="space-y-10">
            {/* Name Section */}
            <motion.div variants={item}>
              <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <User size={12} /> Your Full Name
              </p>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Koustav Sarkar"
                className="w-full bg-transparent border-b-2 border-zinc-800 pb-4 text-3xl font-bold outline-none focus:border-emerald-500 transition-colors placeholder:text-zinc-800"
              />
            </motion.div>

            {/* Limit Section */}
            <motion.div variants={item}>
              <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                <Target size={12} /> Monthly CO2 Target
              </p>
              <div className="flex items-baseline gap-4">
                <input
                  type="number"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  className="w-full bg-transparent text-7xl font-black text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-2xl font-black text-zinc-700 italic uppercase">KG</span>
              </div>
              <div className="mt-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  <span className="text-emerald-400 font-bold">Pro Tip:</span> 500kg is a great starting point for an eco-conscious lifestyle.
                </p>
              </div>
            </motion.div>

            {/* Action Button */}
            <motion.button
              variants={item}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleFinish}
              disabled={loading || !fullName}
              className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 mt-4 hover:shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>START JOURNEY <ArrowRight size={24} /></>}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}