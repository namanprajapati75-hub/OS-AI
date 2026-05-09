"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Play, Zap, ChevronRight, Cpu } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

const DEPARTMENTS = ["Research", "Marketing", "Content", "Sales"];

export function CEOHeroCard() {
  const [running, setRunning] = useState(false);
  const [goal, setGoal] = useState("Scale to 10,000 users by Q3 2025");
  const [autonomous, setAutonomous] = useState(true);
  const [activeDepts, setActiveDepts] = useState(["Research", "Marketing"]);

  const handleRun = () => {
    setRunning(true);
    setActiveDepts(["Research"]);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setActiveDepts(DEPARTMENTS.slice(0, i + 1));
      if (i >= DEPARTMENTS.length - 1) {
        clearInterval(interval);
        setTimeout(() => setRunning(false), 2000);
      }
    }, 800);
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
                </div>
                <p className="text-sm text-slate-500">Autonomous Business Orchestrator</p>
              </div>
            </div>

            {/* Current Objective */}
            <div className="mb-6">
              <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">Current Objective</p>
              <div className="flex items-start gap-2 rounded-xl border border-[#1a2340] bg-black/30 px-4 py-3">
                <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-500" />
                <p className="text-sm font-medium text-slate-200">{goal}</p>
              </div>
            </div>

            {/* Orchestration State */}
            <div className="mb-6">
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">AI Orchestration State</p>
              <div className="flex flex-wrap gap-2">
                {DEPARTMENTS.map((dept) => {
                  const active = activeDepts.includes(dept);
                  return (
                    <motion.div
                      key={dept}
                      animate={active && running ? { scale: [1, 1.04, 1] } : {}}
                      transition={{ duration: 0.6, repeat: running ? Infinity : 0 }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-500",
                        active
                          ? "border-purple-500/50 bg-purple-500/15 text-purple-300"
                          : "border-[#1a2340] bg-[#080d1a] text-slate-500"
                      )}
                    >
                      <span className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        active ? "bg-purple-400" : "bg-slate-600"
                      )} />
                      {dept}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* AI Thinking Indicator */}
            <AnimatePresence>
              {running && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="mb-6 flex items-center gap-2 text-sm text-purple-300"
                >
                  <Cpu className="h-4 w-4 animate-spin" />
                  <span>Orchestrating agents</span>
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
                disabled={running}
                className="shadow-[0_0_25px_rgba(249,115,22,0.3)]"
              >
                <Play className="h-4 w-4" />
                {running ? "Running Analysis..." : "Run Analysis"}
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
              { label: "Agents Active", value: "4/7", color: "text-orange-400" },
              { label: "Tasks Queued", value: "12", color: "text-purple-400" },
              { label: "Completed Today", value: "59", color: "text-green-400" },
              { label: "DB Memory", value: "324 msgs", color: "text-cyan-400" },
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
