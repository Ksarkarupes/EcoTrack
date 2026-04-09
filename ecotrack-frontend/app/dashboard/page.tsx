"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { LogOut, User, Plus, Zap, Clock } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

import MainMetricCard from "@/components/dashboard/MainMetricCard";
import TrendChart from "@/components/dashboard/TrendChart";
import InsightPanel from "@/components/dashboard/InsightPanel";
import RecentActivity from "@/components/dashboard/RecentActivity";
import AddRecordModal from "@/components/dashboard/AddRecordModal";
import HistoryModal from "@/components/dashboard/HistoryModal";
import ProfileModal from "@/components/dashboard/ProfileModal";

type RecordType = "TRANSPORT" | "DIET" | "ENERGY" | "WASTE";

interface EditData {
  id: string | number;
  type: RecordType;
  activity: string;
  value: number;
}

interface AlertData {
  total: number;
  limit: number;
  percentage: number;
  status: "SAFE" | "WARNING" | "EXCEEDED" | "INFO";
  message: string;
}

export default function DashboardPage() {
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [editData, setEditData] = useState<EditData | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [userName] = useState<string>(() =>
    typeof window === "undefined" ? "USER" : (localStorage.getItem("username") ?? "USER")
  );

  const [alertData, setAlertData] = useState<AlertData | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const alertRes = await api.get<AlertData>("/analytics/alert");
        setAlertData(alertRes.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    loadDashboardData();
  }, [refreshKey]);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  const handleRecordAdded = () => setRefreshKey((prev) => prev + 1);

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const item: Variants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 selection:bg-emerald-500/30 overflow-x-hidden">
      <nav className="flex justify-between items-center max-w-7xl mx-auto mb-16 px-2">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-4xl md:text-5xl font-black tracking-tighter"
        >
          HELLO, <span className="text-zinc-600 uppercase">{userName}.</span>
        </motion.h1>

        <div className="flex gap-4">
          <motion.button
            onClick={() => setIsHistoryOpen(true)}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-4 bg-zinc-900/50 rounded-full border border-white/5 text-zinc-400 hover:text-white transition-all backdrop-blur-md"
          >
            <Clock size={22} />
          </motion.button>

          <motion.button
            onClick={() => setIsProfileOpen(true)}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-4 bg-zinc-900/50 rounded-full border border-white/5 text-zinc-400 hover:text-white transition-all backdrop-blur-md"
          >
            <User size={22} />
          </motion.button>

          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            className="p-4 bg-zinc-900/50 rounded-full border border-white/5 text-red-500/50 hover:text-red-500 transition-all backdrop-blur-md"
          >
            <LogOut size={22} />
          </motion.button>
        </div>
      </nav>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 pb-24"
      >
        <motion.div variants={item} className="md:col-span-2">
          <MainMetricCard key={`metric-${refreshKey}`} data={alertData} />
        </motion.div>

        <motion.div variants={item} className="md:col-span-1">
          <InsightPanel key={`insight-${refreshKey}`} />
        </motion.div>

        <motion.div
          variants={item}
          className="md:col-span-2 bg-zinc-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 min-h-[450px] shadow-2xl"
        >
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-black tracking-tighter flex items-center gap-2">
              <Zap size={22} className="text-yellow-400 fill-yellow-400/20" /> WEEKLY INTENSITY
            </h3>
          </div>
          <TrendChart key={`chart-${refreshKey}`} />
        </motion.div>

        <motion.div variants={item} className="md:col-span-1">
          <RecentActivity key={`recent-${refreshKey}`} />
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => {
          setEditData(null);
          setIsModalOpen(true);
        }}
        whileHover={{ scale: 1.15, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-10 right-10 w-20 h-20 bg-white text-black rounded-full flex items-center justify-center shadow-2xl z-50 hover:bg-zinc-100"
      >
        <Plus size={36} strokeWidth={3} />
      </motion.button>

      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditData(null);
        }}
        onSuccess={handleRecordAdded}
        editData={editData ?? undefined}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onRefresh={handleRecordAdded}
        onEdit={(record) => {
  setEditData({
    id: record.id,
    type: record.type as RecordType,
    activity: record.activity,
    value: record.value,
  });
  setIsHistoryOpen(false);
  setIsModalOpen(true);
}}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentName={userName}
      />
    </div>
  );
}