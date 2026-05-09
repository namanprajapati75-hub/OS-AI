"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal } from "lucide-react";
import { MappedActivityLog } from "@/lib/api";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import { useState } from "react";

// ─── Styling maps ─────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<MappedActivityLog["type"], string> = {
  info: "text-slate-400",
  success: "text-green-400",
  warning: "text-amber-400",
  processing: "text-cyan-400",
};

const TYPE_PREFIX: Record<MappedActivityLog["type"], string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  processing: "⟳",
};

const AGENT_COLORS: Record<string, string> = {
  CEO: "text-orange-400",
  Research: "text-cyan-400",
  Marketing: "text-pink-400",
  Sales: "text-green-400",
  Content: "text-purple-400",
  Finance: "text-emerald-400",
  Developer: "text-indigo-400",
  Operations: "text-blue-400",
  HR: "text-violet-400",
};

// ─── Activity Feed ────────────────────────────────────────────────────────────

export function ActivityFeed() {
  const { activityLogs, isLoading, hasRun } = useBackend();
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever logs change
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [activityLogs, autoScroll]);

  const agentColor = (agent: string) =>
    AGENT_COLORS[agent] || "text-slate-400";

  return (
    <div className="flex flex-col rounded-2xl border border-[#1a2340] bg-[#080d1a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1a2340] px-4 py-3 bg-black/20">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Activity Log</span>
          <span className="flex items-center gap-1 rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
            <span
              className={cn(
                "h-1 w-1 rounded-full bg-green-500",
                isLoading ? "animate-ping" : "animate-pulse"
              )}
            />
            {isLoading ? "STREAMING" : "LIVE"}
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
          {/* Empty state */}
          {activityLogs.length === 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-10 gap-2"
            >
              <span className="text-2xl">🖥️</span>
              <p className="text-slate-600 text-[11px]">
                {hasRun
                  ? "No activity yet"
                  : "Run Analysis to see live agent activity"}
              </p>
            </motion.div>
          )}

          {/* Actual log entries */}
          {activityLogs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-2 group"
            >
              <span className="flex-shrink-0 text-slate-700">{log.timestamp}</span>
              <span
                className={cn(
                  "flex-shrink-0 font-bold",
                  agentColor(log.agent)
                )}
              >
                [{log.agent}]
              </span>
              <span className={cn("leading-relaxed", TYPE_STYLES[log.type])}>
                <span className="mr-1 opacity-60">{TYPE_PREFIX[log.type]}</span>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Animated thinking indicator while loading */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-purple-400"
          >
            <span className="text-slate-700">
              {new Date().toTimeString().slice(0, 8)}
            </span>
            <span className="font-bold text-orange-400">[CEO]</span>
            <span className="text-purple-300">AI is processing</span>
            <span className="flex gap-0.5">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="inline-block h-1 w-1 rounded-full bg-purple-500"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
            </span>
          </motion.div>
        )}

        {/* Blinking cursor */}
        <div className="flex items-center gap-2 text-slate-700">
          <span>{new Date().toTimeString().slice(0, 8)}</span>
          <span className="text-cyan-500 animate-pulse">▋</span>
        </div>
      </div>
    </div>
  );
}
