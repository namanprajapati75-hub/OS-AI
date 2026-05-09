"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, Zap, ChevronRight, Cpu, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useBackend } from "@/hooks/useBackend";

const DEPARTMENTS = ["Research", "Marketing", "Content", "Sales"];

// Cold-start awareness: show escalating messages while waiting
const LOADING_MESSAGES = [
  "Activating CEO agent...",
  "Warming up multi-agent system...",
  "AI is thinking deeply...",
  "Orchestrating departments...",
  "Synthesizing agent outputs...",
  "Almost there — finalizing results...",
];

function useCyclingMessage(active: boolean, intervalMs = 4000) {
  const [idx, setIdx] = useState(0);
  // Only cycle when active
  useState(() => {
    if (!active) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % LOADING_MESSAGES.length), intervalMs);
    return () => clearInterval(id);
  });
  return LOADING_MESSAGES[idx];
}

export function CEOHeroCard() {
  const { run, isLoading, isError, errorMessage, clearError, hasRun,
          goal, setGoal, departments, tasks, agents, ceoAnalysis } = useBackend();

  const [autonomous, setAutonomous] = useState(true);

  // Derive active departments from backend response
  const activeDepts = hasRun && departments.length
    ? departments.map((d) => d.charAt(0).toUpperCase() + d.slice(1).toLowerCase())
    : [];

  // Which DEPARTMENTS badges to mark active
  const allDepts = DEPARTMENTS;

  // Stats derived from live data
  const activeAgentCount = agents.filter((a) => a.status !== "IDLE").length;
  const taskCount = tasks.length;
  const completedCount = agents.reduce((s, a) => s + a.completedToday, 0);

  const [localGoal, setLocalGoal] = useState(goal);
  const loadingMsg = useCyclingMessage(isLoading);

  const handleRun = async () => {
    if (!localGoal.trim()) return;
    setGoal(localGoal);
    await run(localGoal);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#1a2340] bg-[#080d1a]">
      {/* Background glow layers */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-64 w-64 rounded-full bg-orange-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />

      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />

      {/* Animated gradient border top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/60 to-transparent" />

      {/* Loading overlay */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex items-center justify-center rounded-3xl bg-[#080d1a]/80 backdrop-blur-sm"
          >
            <div className="flex flex-col items-center gap-4 text-center px-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 shadow-[0_0_40px_rgba(139,92,246,0.6)]"
              >
                <Brain className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loadingMsg}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm font-semibold text-purple-300"
                  >
                    {loadingMsg}
                  </motion.p>
                </AnimatePresence>
                <p className="mt-1 text-xs text-slate-500">
                  Backend may take up to 60s on cold start
                </p>
              </div>
              {/* Pulsing dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="h-2 w-2 rounded-full bg-purple-500"
                    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left: CEO Info */}
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.05, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-purple-600 to-blue-600 shadow-[0_0_30px_rgba(139,92,246,0.5)]"
              >
                <Brain className="h-7 w-7 text-white" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-[#080d1a] shadow-[0_0_6px_rgba(34,197,94,0.8)]" />
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">CEO Agent</h2>
                  <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-[10px] font-semibold text-green-400 uppercase tracking-wider">
                    Online
                  </span>
                  {hasRun && (
                    <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                      Live Data
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">Autonomous Business Orchestrator</p>
              </div>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {isError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-red-300">Backend Error</p>
                    <p className="mt-0.5 text-xs text-red-400/80 break-words">{errorMessage}</p>
                  </div>
                  <button onClick={clearError} className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Goal Input */}
            <div className="mb-6">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">Business Goal</p>
              <div className="flex items-start gap-2 rounded-xl border border-[#1a2340] bg-black/30 px-4 py-3 focus-within:border-purple-500/40 transition-colors">
                <ChevronRight className="mt-2 h-4 w-4 flex-shrink-0 text-orange-500" />
                <textarea
                  value={localGoal}
                  onChange={(e) => setLocalGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                      e.preventDefault();
                      handleRun();
                    }
                  }}
                  disabled={isLoading}
                  rows={2}
                  placeholder="Enter your business goal..."
                  className="flex-1 resize-none bg-transparent text-sm font-medium text-slate-200 placeholder-slate-600 outline-none"
                />
              </div>
            </div>

            {/* CEO Analysis — shown after run */}
            <AnimatePresence>
              {hasRun && ceoAnalysis && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 flex items-start gap-3 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-400" />
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-green-400 mb-1">
                      CEO Analysis Complete
                    </p>
                    <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                      {ceoAnalysis.slice(0, 300)}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Orchestration State */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">AI Orchestration State</p>
              <div className="flex flex-wrap gap-2">
                {allDepts.map((dept) => {
                  const active = activeDepts.includes(dept);
                  return (
                    <motion.div
                      key={dept}
                      animate={active && hasRun ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ duration: 0.6, repeat: hasRun ? 0 : 0 }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-500",
                        active
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-300"
                          : isLoading
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-400 animate-pulse"
                          : "border-[#1a2340] bg-[#080d1a] text-slate-500"
                      )}
                    >
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-purple-400" : isLoading ? "bg-amber-400" : "bg-slate-600"
                      )} />
                      {dept}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* AI Thinking Indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="mb-6 flex items-center gap-2 text-sm text-purple-300"
                >
                  <Cpu className="h-4 w-4 animate-spin" />
                  <span>AI analyzing your goal</span>
                  <span className="thinking-dots flex gap-0.5">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="inline-block h-1 w-1 rounded-full bg-purple-400"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={handleRun}
                disabled={isLoading || !localGoal.trim()}
                className="shadow-[0_0_25px_rgba(249,115,22,0.3)]"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Running Analysis...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run Analysis
                  </>
                )}
              </Button>

              <button
                onClick={() => setAutonomous(!autonomous)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition-all duration-300",
                  autonomous
                    ? "border-orange-500/50 bg-orange-500/10 text-orange-300"
                    : "border-[#1a2340] bg-[#080d1a] text-slate-400 hover:border-[#2a3560]"
                )}
              >
                <Zap className="h-4 w-4" />
                Autonomous: {autonomous ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* Right: Stats */}
          <div className="grid grid-cols-2 gap-3 lg:w-72 lg:flex-shrink-0">
            {[
              {
                label: "Agents Active",
                value: isLoading ? "..." : hasRun ? `${activeAgentCount}/${agents.length}` : "0/7",
                color: "text-orange-400",
              },
              {
                label: "Tasks Queued",
                value: isLoading ? "..." : String(taskCount),
                color: "text-purple-400",
              },
              {
                label: "Completed Today",
                value: isLoading ? "..." : String(completedCount),
                color: "text-green-400",
              },
              {
                label: "DB Memory",
                value: hasRun ? "Active" : "—",
                color: "text-cyan-400",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#1a2340] bg-black/30 p-4"
              >
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className={cn("mt-1 text-xl font-bold", stat.color)}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
