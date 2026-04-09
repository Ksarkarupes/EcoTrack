"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Zap, Car, Utensils, Trash2, Clock, Edit3, Loader2, Download } from "lucide-react";
import api from "@/lib/api";
import { format } from "date-fns";

interface RecordResponse {
  id: string;
  type: string;
  activity: string;
  value: number;
  unit: string;
  carbonEmission: number;
  createdAt: string;
}

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (record: RecordResponse) => void;
  onRefresh: () => void;
}

export default function HistoryModal({ isOpen, onClose, onEdit, onRefresh }: HistoryModalProps) {
  const [history, setHistory] = useState<RecordResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      // Fetch initial page for UI display
      const res = await api.get("/record/history?page=0&size=20");
      setHistory(res.data.content);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this record permanently?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/record/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      onRefresh();
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleExport = async () => {
    if (history.length === 0) return;
    setExporting(true);
    
    try {
      // 1. Fetch first page to determine total pages (using size 50 for efficiency)
      const firstPageRes = await api.get("/record/history?page=0&size=50");
      const totalPages = firstPageRes.data.totalPages;
      let allRecords: RecordResponse[] = [...firstPageRes.data.content];

      // 2. Fetch remaining pages in parallel if they exist
      if (totalPages > 1) {
        const promises = [];
        for (let i = 1; i < totalPages; i++) {
          promises.push(api.get(`/record/history?page=${i}&size=50`));
        }
        const results = await Promise.all(promises);
        results.forEach(res => {
          allRecords = [...allRecords, ...res.data.content];
        });
      }

      // 3. Construct CSV
      const headers = ["ID", "Type", "Activity", "Value", "Unit", "Carbon_Emission_KG", "Timestamp"];
      const rows = allRecords.map(item => [
        item.id,
        item.type,
        item.activity,
        item.value,
        item.unit,
        item.carbonEmission.toFixed(4), // Higher precision for data export
        format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")
      ]);

      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // 4. Trigger Download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `EcoTrack_Full_Export_${format(new Date(), "yyyy-MM-dd")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Export failed", err);
      alert("Error compiling full history for export.");
    } finally {
      setExporting(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "ENERGY": return <Zap size={16} />;
      case "TRANSPORT": return <Car size={16} />;
      case "DIET": return <Utensils size={16} />;
      case "WASTE": return <Trash2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full max-w-xl bg-zinc-950 border-l border-white/5 z-[70] p-10 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase leading-none">History.</h2>
                <p className="text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Timeline of Impact</p>
              </div>
              <button onClick={onClose} className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Timeline List */}
            <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
              {loading && history.length === 0 ? (
                <div className="h-full flex items-center justify-center text-zinc-700 font-black italic uppercase tracking-widest animate-pulse">
                  Syncing Timeline...
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="group bg-zinc-900/40 border border-white/5 p-6 rounded-[2rem] hover:border-white/20 transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-white group-hover:text-black transition-all">
                          {getIcon(item.type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-white uppercase tracking-tight leading-none">
                            {item.activity.replace("_", " ")}
                          </h4>
                          <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={10} /> {format(new Date(item.createdAt), "MMM dd, HH:mm")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xl font-black text-white italic leading-none">
                            +{item.carbonEmission.toFixed(2)}
                            <span className="text-[10px] not-italic ml-1 text-zinc-600 uppercase">KG</span>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-tighter mt-1">
                            {item.value} {item.unit}
                          </p>
                        </div>

                        {/* Edit and Delete Buttons */}
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => onEdit(item)}
                            className="p-2 bg-white/5 hover:bg-white text-zinc-500 hover:text-black rounded-full transition-all"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingId === item.id}
                            className="p-2 bg-white/5 hover:bg-red-500 text-zinc-500 hover:text-white rounded-full transition-all"
                          >
                            {deletingId === item.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {history.length === 0 && !loading && (
                    <div className="py-20 text-center text-zinc-800 font-black italic uppercase tracking-tighter text-2xl opacity-20">
                      No Records Yet
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer / Export */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <button 
                onClick={handleExport}
                disabled={exporting || history.length === 0}
                className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:bg-zinc-200 disabled:opacity-30 flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(255,255,255,0.05)]"
              >
                {exporting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Compiling Data...
                  </>
                ) : (
                  <>
                    <Download size={18} /> 
                    Export Data (CSV)
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}