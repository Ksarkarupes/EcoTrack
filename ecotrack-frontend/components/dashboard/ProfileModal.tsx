"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Target, Check, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/api";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
}

export default function ProfileModal({ isOpen, onClose, currentName }: ProfileModalProps) {
  const [fullName, setFullName] = useState(currentName);
  const [limit, setLimit] = useState("500");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync state with current name when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(currentName);
      setSuccess(false);
    }
  }, [isOpen, currentName]);

  const handleUpdate = async () => {
    if (!fullName || !limit) return;
    setLoading(true);
    try {
      await api.post("/user/build", {
        fullName: fullName,
        profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
        monthlyCarbonLimit: parseFloat(limit)
      });
      
      // Update local storage so the greeting changes instantly
      localStorage.setItem("username", fullName);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        // Force a small refresh or state update to reflect the name change
        window.location.reload(); 
      }, 1500);
    } catch (err) {
      console.error("Profile update failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]" 
          />

          {/* Panel */}
          <motion.div 
            initial={{ x: "100%" }} 
            animate={{ x: 0 }} 
            exit={{ x: "100%" }} 
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/5 z-[70] p-10 flex flex-col shadow-2xl"
          >
            <div className="flex justify-between items-center mb-16">
              <div>
                <h2 className="text-4xl font-black tracking-tighter uppercase text-white">Identity.</h2>
                <p className="text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase mt-1">Refine your profile</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-12 flex-1">
              {/* Display Name */}
              <div className="group">
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                  <User size={12} /> Full Name
                </p>
                <input 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-transparent border-b border-zinc-800 pb-4 text-2xl font-bold text-white outline-none focus:border-white transition-all placeholder:text-zinc-800" 
                />
              </div>

              {/* Monthly Limit */}
              <div className="group">
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-4 flex items-center gap-2">
                  <Target size={12} /> Carbon Target (KG)
                </p>
                <div className="flex items-baseline gap-3">
                  <input 
                    type="number"
                    value={limit} 
                    onChange={(e) => setLimit(e.target.value)}
                    className="w-full bg-transparent text-7xl font-black text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
                  />
                  <span className="text-2xl font-black text-zinc-700 italic uppercase">KG</span>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] flex gap-4 items-start">
                <Sparkles className="text-emerald-500 shrink-0" size={20} />
                <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                  Updating your target will immediately recalibrate your dashboard metrics and progress intensity.
                </p>
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleUpdate}
              disabled={loading || success || !fullName}
              className={`w-full py-6 rounded-[2.5rem] font-black text-lg transition-all shadow-xl flex items-center justify-center gap-3 ${
                success ? "bg-emerald-500 text-white" : "bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : success ? (
                <div className="flex items-center gap-2">
                  <Check size={24} strokeWidth={3} />
                  <span>UPDATED</span>
                </div>
              ) : (
                "SAVE CHANGES"
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}