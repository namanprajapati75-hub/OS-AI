"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, RefreshCw, Zap, ChevronRight, Loader2 } from "lucide-react";
import { Badge, GlowCard, Button } from "@/components/ui";
import { DEPT_COLORS, PRIORITY_COLORS } from "@/data/mock";
import { MappedTask } from "@/lib/api";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";

// ─── Skeleton Card ────────────────────────────────────────────────────────────

function TaskSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1a2340] bg-[#080d1a] p-4 animate-pulse">
      <div className="mb-3 flex items-center gap-2">
        <div className="h-5 w-16 rounded-full bg-[#1a2340]" />
        <div className="h-5 w-20 rounded-full bg-[#1a2340]" />
        <div className="ml-auto h-4 w-12 rounded-full bg-[#1a2340]" />
      </div>
      <div className="mb-2 h-4 w-3/4 rounded bg-[#1a2340]" />
      <div className="mb-4 h-12 rounded-lg bg-[#1a2340]/50" />
      <div className="flex gap-2">
        <div className="h-7 w-20 rounded-lg bg-[#1a2340]" />
        <div className="h-7 w-16 rounded-lg bg-[#1a2340]" />
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TaskCard({
  task,
  onApprove,
  onSkip,
  onReanalyze,
}: {
  task: MappedTask;
  onApprove: (id: string) => void;
  onSkip: (id: string) => void;
  onReanalyze: (id: string) => void;
}) {
  // Normalize department key for color lookup
  const deptKey = (task.department || "Marketing") as keyof typeof DEPT_COLORS;
  const deptColor = DEPT_COLORS[deptKey] || DEPT_COLORS["Marketing"];
  const priorityColor = PRIORITY_COLORS[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
    >
      <GlowCard
        hover
        className="group"
        glowColor={task.priority === "HIGH" ? "rgba(239,68,68,0.08)" : undefined}
      >
        {/* Priority indicator bar */}
        <div
          className={cn(
            "absolute left-0 top-4 bottom-4 w-0.5 rounded-full",
            task.priority === "HIGH"
              ? "bg-red-500"
              : task.priority === "MEDIUM"
              ? "bg-amber-500"
              : "bg-slate-600"
          )}
          style={{ left: "0px", borderRadius: "0 2px 2px 0" }}
        />

        <div className="pl-3">
          {/* Top row: badges + time */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "border",
                  priorityColor.bg,
                  priorityColor.text,
                  priorityColor.border
                )}
              >
                {task.priority}
              </Badge>
              <Badge
                className={cn(
                  "border",
                  deptColor.bg,
                  deptColor.text,
                  deptColor.border
                )}
              >
                {task.department}
              </Badge>
            </div>
            <span className="text-xs text-slate-600">{task.createdAt}</span>
          </div>

          {/* Task title */}
          <p className="mb-2 text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
            {task.title}
          </p>

          {/* AI Reasoning */}
          <div className="mb-4 flex items-start gap-2 rounded-lg border border-[#1a2340] bg-black/20 px-3 py-2">
            <Zap className="mt-0.5 h-3 w-3 flex-shrink-0 text-purple-400" />
            <p className="text-xs text-slate-500 leading-relaxed">{task.reasoning}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApprove(task.id)}
              className="flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-all"
            >
              <Check className="h-3 w-3" />
              Approve
            </button>
            <button
              onClick={() => onSkip(task.id)}
              className="flex items-center gap-1.5 rounded-lg border border-[#1a2340] bg-[#080d1a] px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-all"
            >
              <X className="h-3 w-3" />
              Skip
            </button>
            <button
              onClick={() => onReanalyze(task.id)}
              className="flex items-center gap-1.5 rounded-lg border border-[#1a2340] bg-[#080d1a] px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-purple-400 hover:border-purple-500/30 transition-all ml-auto"
            >
              <RefreshCw className="h-3 w-3" />
              Re-analyze
            </button>
          </div>
        </div>
      </GlowCard>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ hasRun }: { hasRun: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="mb-3 text-4xl">{hasRun ? "✅" : "🚀"}</div>
      <p className="text-sm font-medium text-slate-400">
        {hasRun ? "All tasks processed" : "No tasks yet"}
      </p>
      <p className="text-xs text-slate-600">
        {hasRun
          ? "CEO will generate new tasks on next run"
          : "Click Run Analysis to generate AI-powered tasks"}
      </p>
    </motion.div>
  );
}

// ─── Task Queue Section ───────────────────────────────────────────────────────

export function TaskQueueSection() {
  const { tasks, isLoading, hasRun, approveTask, skipTask, reanalyzeTask } =
    useBackend();
  const [filter, setFilter] = useState<string>("ALL");

  const priorities = ["ALL", "HIGH", "MEDIUM", "LOW"];
  const filtered =
    filter === "ALL" ? tasks : tasks.filter((t) => t.priority === filter);

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Task Queue</h2>
          <p className="text-xs text-slate-500">
            {isLoading
              ? "AI generating tasks..."
              : `${tasks.length} pending approval`}
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-xl border border-[#1a2340] bg-[#080d1a] p-1">
          {priorities.map((p) => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                "rounded-lg px-3 py-1 text-xs font-medium transition-all",
                filter === p
                  ? "bg-[#0d1424] text-white border border-[#2a3560]"
                  : "text-slate-500 hover:text-slate-300"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4 text-xs text-purple-400">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            AI is generating task queue...
          </div>
          {[1, 2, 3].map((i) => (
            <TaskSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Live task cards */}
      {!isLoading && (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState hasRun={hasRun} />
            ) : (
              filtered.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onApprove={approveTask}
                  onSkip={skipTask}
                  onReanalyze={reanalyzeTask}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
