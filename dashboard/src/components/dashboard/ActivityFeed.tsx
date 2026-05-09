"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Wifi } from "lucide-react";
import { ActivityLog, mockActivityLog } from "@/data/mock";
import { cn } from "@/lib/utils";

const TYPE_STYLES = {
  info: "text-slate-400",
  success: "text-green-400",
  warning: "text-amber-400",
  processing: "text-cyan-400",
};

const TYPE_PREFIX = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  processing: "⟳",
};

const EXTRA_LOGS: Omit<ActivityLog, "id">[] = [
  { timestamp: "18:42:41", agent: "CEO", message: "Scheduling recurring task: Weekly competitor analysis", type: "info" },
  { timestamp: "18:42:44", agent: "Marketing", message: "Reel script #1 ready: 'The 3AM Grind Reel'", type: "success" },
  { timestamp: "18:42:47", agent: "Research", message: "New signal: TikTok AI tools trend +220% this week", type: "warning" },
  { timestamp: "18:42:51", agent: "Sales", message: "Draft DM template sent for review", type: "success" },
  { timestamp: "18:42:55", agent: "CEO", message: "Business memory updated: niche, audience, platforms stored", type: "info" },
];

export function ActivityFeed() {
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLog);
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const next = EXTRA_LOGS[counterRef.current % EXTRA_LOGS.length];
      counterRef.current++;
      setLogs((prev) => [
        ...prev.slice(-30),
        { ...next, id: `live-${Date.now()}` },
      ]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  return (
    <div className="flex flex-col rounded-2xl border border-[#1a2340] bg-[#080d1a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1a2340] px-4 py-3 bg-black/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Activity Log</span>
          <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
            <span className="h-1 w-1 rounded-full bg-green-500 animate-pulse" />
            LIVE
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={cn(
              "text-xs transition-colors",
              autoScroll ? "text-cyan-400" : "text-slate-600 hover:text-slate-400"
            )}
          >
            {autoScroll ? "Auto-scroll ON" : "Auto-scroll OFF"}
          </button>
        </div>
      </div>

      {/* Log Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-1.5 max-h-80"
        style={{ scrollBehavior: "smooth" }}
      >
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 group"
            >
              <span className="flex-shrink-0 text-slate-700">{log.timestamp}</span>
              <span className={cn(
                "flex-shrink-0 font-bold",
                log.agent === "CEO" ? "text-orange-400" :
                log.agent === "Research" ? "text-cyan-400" :
                log.agent === "Marketing" ? "text-pink-400" :
                log.agent === "Sales" ? "text-green-400" :
                log.agent === "Content" ? "text-purple-400" : "text-slate-400"
              )}>
                [{log.agent}]
              </span>
              <span className={cn("leading-relaxed", TYPE_STYLES[log.type])}>
                <span className="mr-1 opacity-60">{TYPE_PREFIX[log.type]}</span>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {/* Blinking cursor */}
        <div className="flex items-center gap-2 text-slate-700">
          <span>{new Date().toTimeString().slice(0, 8)}</span>
          <span className="text-cyan-500 animate-pulse">▋</span>
        </div>
      </div>
    </div>
  );
}
