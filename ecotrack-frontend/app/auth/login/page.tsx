"use client";

import { useState } from "react";
import api from "@/lib/api";
import { setTokens } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Lock, User, Loader2 } from "lucide-react";

// Interface to check user profile status via your existing endpoint
interface SummaryResponse {
  totalEmission: number;
  monthlyLimit: number;
  exceeded: boolean;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    },
  };

  const handleLogin = async () => {
    setError("");
    if (!username || !password) {
      setError("Credentials required");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Authenticate with the backend
      const res = await api.post("/auth/login", { username, password });
      
      // 2. Save tokens to localStorage/Cookies
      setTokens(res.data.accessToken, res.data.refreshToken);
      
      // 3. Intelligent Onboarding Check
      // We hit /analytics/summary to see if the user has a setup profile
      try {
        const summaryRes = await api.get<SummaryResponse>("/analytics/summary");
        
        // If monthlyLimit is greater than 0, they are a returning user
        if (summaryRes.data && summaryRes.data.monthlyLimit > 0) {
          localStorage.setItem("username", username); // Set fallback name
          router.push("/dashboard");
        } else {
          // If limit is 0 or null, they are a new user or incomplete profile
          router.push("/onboarding");
        }
      } catch (checkErr) {
        // If the summary fails (common for brand new users with 0 records), 
        // redirect to onboarding to be safe.
        router.push("/onboarding");
      }

    } catch (err) {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden selection:bg-emerald-500/30">
      {/* Background Decorative Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[420px] px-6"
      >
        <div className="bg-zinc-900/40 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          
          <div className="text-center mb-10">
            <motion.h2 variants={itemVariants} className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">
              Welcome back.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-zinc-500 font-medium italic">
              Synchronizing your green footprint...
            </motion.p>
          </div>

          <div className="space-y-4">
            <motion.div variants={itemVariants} className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                className="w-full bg-white/[0.03] border border-white/5 text-white pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all placeholder:text-zinc-600"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                className="w-full bg-white/[0.03] border border-white/5 text-white pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-all placeholder:text-zinc-600"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }} 
                className="text-red-400 text-sm font-medium px-2"
              >
                {error}
              </motion.p>
            )}

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full bg-white text-black font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors mt-6 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tight"
              onClick={handleLogin}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  Enter Dashboard <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </div>

          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              New to the platform?{" "}
              <span
                className="text-white cursor-pointer hover:underline underline-offset-4 decoration-emerald-500 font-bold"
                onClick={() => router.push("/auth/register")}
              >
                Join for free
              </span>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}