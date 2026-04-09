"use client";

import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import api from "@/lib/api";

// 1. Define the Interface based on your Spring Boot Model
interface EmissionRecord {
  id: string;
  type: "TRANSPORT" | "DIET" | "ENERGY" | "WASTE";
  activity: string;
  value: number;
  unit: string;
  carbonEmission: number;
  createdAt: string;
}

export default function RecentActivity() {
  // 2. Apply the type to the State
  const [records, setRecords] = useState<EmissionRecord[]>([]);

  useEffect(() => {
    const fetchTopRecords = async () => {
      try {
        const res = await api.get<EmissionRecord[]>("/record/gettop");
        setRecords(res.data);
      } catch (err) {
        console.error("Failed to fetch recent records", err);
      }
    };
    fetchTopRecords();
  }, []);

  return (
    <div className="bg-zinc-900/30 backdrop-blur-xl border border-white/5 rounded-[2.5rem] p-8 h-full">
      <h3 className="text-xl font-bold mb-6 flex items-center gap-2 tracking-tighter">
        <Activity size={20} className="text-blue-400" /> RECENT ACTIVITY
      </h3>
      
      <div className="space-y-3">
        {records.length > 0 ? (
          records.map((r) => (
            <div 
              key={r.id} 
              className="flex justify-between items-center p-4 bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.05] transition-colors group"
            >
              <div className="flex flex-col">
                <span className="font-bold text-xs text-zinc-500 uppercase tracking-widest mb-1">
                  {r.type}
                </span>
                <span className="text-white font-medium tracking-tight">
                  {r.activity}
                </span>
              </div>
              <div className="text-right">
                <p className="text-emerald-400 font-black text-lg">
                  +{r.carbonEmission.toFixed(1)}
                </p>
                <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
                  KG CO₂
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-zinc-600 text-sm italic py-10 text-center">
            No recent activity logged.
          </p>
        )}
      </div>
    </div>
  );
}