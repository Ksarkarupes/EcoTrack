"use client";

import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion, Variants } from "framer-motion";
import { Mail, User, Lock, Loader2, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
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

  const handleRegister = async () => {
    setError("");
    if (!email || !username || !password) {
      setError("All fields are required");
      return;
    }

    setIsLoading(true);
    try {
      await api.post("/auth/register", { email, username, password });
      router.push("/auth/login");
    } catch (err: unknown) {
      setIsLoading(false);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.response?.data || "Registration failed");
      } else {
        setError("Something went wrong");
      }
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-[#000000] overflow-hidden selection:bg-blue-500/30">
      {/* 1. Background Glows */}
      <div className="absolute top-[-15%] left-[-5%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-5%] w-[50%] h-[50%] bg-emerald-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 2. Motion Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[440px] px-6"
      >
        {/* 3. Glassmorphism Card */}
        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          
          {/* Header Section */}
          <div className="text-center mb-10">
            <motion.div variants={itemVariants} className="inline-flex p-3 bg-blue-500/10 rounded-2xl mb-4 border border-blue-500/20">
                <Sparkles className="text-blue-400" size={24} />
            </motion.div>
            <motion.h2 variants={itemVariants} className="text-4xl font-black tracking-tighter text-white mb-2">
              JOIN THE CORE.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-zinc-500 font-medium tracking-tight">
              Start tracking your impact today.
            </motion.p>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <motion.div variants={itemVariants} className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                type="email"
                className="w-full bg-white/[0.03] border border-white/5 text-white pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-zinc-600"
                placeholder="Email Address"
                onChange={(e) => setEmail(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                className="w-full bg-white/[0.03] border border-white/5 text-white pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-zinc-600"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={20} />
              <input
                className="w-full bg-white/[0.03] border border-white/5 text-white pl-12 pr-4 py-4 rounded-[1.5rem] outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all placeholder:text-zinc-600"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
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
              className="w-full bg-white text-black font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors mt-6 disabled:opacity-50"
              onClick={handleRegister}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </motion.button>
          </div>

          {/* Footer Section */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <p className="text-zinc-500 text-sm font-medium">
              Already a member?{" "}
              <span
                className="text-white cursor-pointer hover:underline underline-offset-4 decoration-blue-500"
                onClick={() => router.push("/auth/login")}
              >
                Sign in
              </span>
            </p>
          </motion.div>

        </div> {/* End Glass Card */}
      </motion.div> {/* End Motion Div */}
    </main> 
  );
}