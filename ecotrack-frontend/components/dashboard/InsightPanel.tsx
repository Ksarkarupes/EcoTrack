"use client";

import { useEffect, useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function InsightPanel() {
  const [insight, setInsight] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics/insights")
      .then((res) => {
        setInsight(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="h-full bg-emerald-500/5 border border-emerald-500/20 rounded-[2.5rem] p-8 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4 text-emerald-400">
        <Sparkles size={20} />
        <h3 className="font-bold tracking-tight uppercase text-sm">AI Advisor</h3>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : (
        <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
          {insight || "Log more data to generate personalized AI insights."}
        </p>
      )}
    </div>
  );
}