"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Car, Utensils, Trash2, Loader2, Check } from "lucide-react";
import api from "@/lib/api";

type RecordType = "TRANSPORT" | "DIET" | "ENERGY" | "WASTE";

interface EditData {
  id: string | number;
  type: RecordType;
  activity: string;
  value: number;
}

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: EditData;
}

export default function AddRecordModal({ isOpen, onClose, onSuccess, editData }: AddRecordModalProps) {
  const [type, setType] = useState<RecordType>("TRANSPORT");
  const [activity, setActivity] = useState("");
  const [value, setValue] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const activityMap: Record<RecordType, string[]> = {
    TRANSPORT: ["car", "bike", "bus"],
    ENERGY: ["electricity", "lpg"],
    DIET: ["chicken_meal", "veg_meal", "red_meat_meal"],
    WASTE: ["plastic", "organic"],
  };

  const unitMap: Record<RecordType, string> = {
    TRANSPORT: "km",
    ENERGY: "kWh",
    DIET: "meals",
    WASTE: "kg",
  };

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setType(editData.type);
        setActivity(editData.activity);
        setValue(editData.value.toString());
      } else {
        setType("TRANSPORT");
        setActivity("");
        setValue("");
      }
      setSaved(false);
    }
  }, [isOpen, editData]);

  const handleSubmit = async () => {
    if (!activity || !value) return;
    setLoading(true);
    try {
      const payload = {
        type,
        activity,
        value: parseFloat(value),
        unit: unitMap[type],
      };

      if (editData) {
        await api.put(`/record/update/${editData.id}`, payload);
      } else {
        await api.post("/record/enter", payload);
      }

      setSaved(true);
      onSuccess();

      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1500);
    } catch (err) {
      console.error("Operation failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[60]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/5 z-[70] p-10 shadow-2xl flex flex-col"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-black tracking-tighter text-white uppercase">
                  {editData ? "Edit Data." : "Log Data."}
                </h2>
                <p className="text-zinc-600 text-[10px] font-black tracking-[0.3em] uppercase mt-1">
                  Validated Inputs Only
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-white/5 hover:bg-white/10 rounded-full text-zinc-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-12 flex-1">
              <div>
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-5 text-left">
                  Category
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "TRANSPORT" as RecordType, icon: Car },
                    { id: "ENERGY" as RecordType, icon: Zap },
                    { id: "DIET" as RecordType, icon: Utensils },
                    { id: "WASTE" as RecordType, icon: Trash2 },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setType(cat.id)}
                      className={`flex flex-col items-center justify-center aspect-square rounded-[2rem] border transition-all duration-300 ${
                        type === cat.id
                          ? "bg-white border-white text-black"
                          : "bg-zinc-900/50 border-white/5 text-zinc-500"
                      }`}
                    >
                      <cat.icon size={22} strokeWidth={type === cat.id ? 2.5 : 1.5} />
                    </button>
                  ))}
                </div>
              </div>

              <motion.div layout>
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-5 text-left">
                  Select Activity
                </p>
                <div className="flex flex-wrap gap-3">
                  {activityMap[type].map((act) => (
                    <motion.button
                      key={act}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActivity(act)}
                      className={`px-6 py-3 rounded-full border text-sm font-bold transition-all ${
                        activity === act
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20"
                      }`}
                    >
                      {act.replace("_", " ").toUpperCase()}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              <div className="relative pt-6">
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-600 uppercase mb-3 text-left">
                  Quantity
                </p>
                <div className="flex items-baseline gap-3">
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-transparent text-7xl font-black text-white outline-none placeholder:text-zinc-900"
                  />
                  <span className="text-2xl font-black text-zinc-700 italic uppercase">
                    {unitMap[type]}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading || saved || !activity || !value}
              className={`w-full py-6 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl ${
                saved
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-white text-black disabled:bg-zinc-800 disabled:text-zinc-600"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : saved ? (
                <div className="flex items-center gap-2">
                  <Check size={24} strokeWidth={3} />
                  <span>{editData ? "UPDATED" : "RECORDED"}</span>
                </div>
              ) : editData ? (
                "UPDATE IMPACT"
              ) : (
                "LOG IMPACT"
              )}
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}