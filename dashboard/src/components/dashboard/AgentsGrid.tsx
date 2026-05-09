"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Loader2 } from "lucide-react";
import { StatusDot, GlowCard } from "@/components/ui";
import { DEPT_COLORS } from "@/data/mock";
import { MappedAgent } from "@/lib/api";
import { useBackend } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentStatus = "IDLE" | "WORKING" | "THINKING" | "COMPLETE";

const STATUS_LABELS: Record<AgentStatus, string> = {
  IDLE: "Idle",
  WORKING: "Working",
  THINKING: "Thinking",
  COMPLETE: "Complete",
};

const STATUS_COLORS: Record<AgentStatus, string> = {
  IDLE: "text-slate-500",
  WORKING: "text-orange-400",
  THINKING: "text-purple-400",
  COMPLETE: "text-green-400",
};

// ─── Agent Card Skeleton ───────────────────────────────────────────────────────

function AgentSkeleton() {
  return (
    <div className="rounded-2xl border border-[#1a2340] bg-[#080d1a] p-5 animate-pulse">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#1a2340]" />
          <div>
            <div className="mb-1 h-4 w-20 rounded bg-[#1a2340]" />
            <div className="h-3 w-32 rounded bg-[#1a2340]/60" />
          </div>
        </div>
        <div className="h-4 w-16 rounded bg-[#1a2340]" />
      </div>
      <div className="mb-4 h-8 rounded-lg bg-[#1a2340]/50" />
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="h-12 rounded-lg bg-[#1a2340]/50" />
        <div className="h-12 rounded-lg bg-[#1a2340]/50" />
      </div>
      <div className="h-9 rounded-lg bg-[#1a2340]" />
    </div>
  );
}

// ─── Agent Card ───────────────────────────────────────────────────────────────

function AgentCard({ agent }: { agent: MappedAgent }) {
  const status = agent.status as AgentStatus;

  // Try to match department color; fallback to Marketing
  const nameKey = agent.name as keyof typeof DEPT_COLORS;
  const deptColor = DEPT_COLORS[nameKey] || DEPT_COLORS["Marketing"];

  return (
    <GlowCard
      hover
      glowColor={status !== "IDLE" ? deptColor.glow : undefined}
      className="relative group border"
    >
      {/* Top accent line */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px",
          `bg-gradient-to-r from-transparent via-current to-transparent`,
          deptColor.text
        )}
        style={{ opacity: status !== "IDLE" ? 0.5 : 0.15 }}
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl text-xl",
              deptColor.bg
            )}
          >
            {agent.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={status} />
          <span className={cn("text-xs font-medium", STATUS_COLORS[status])}>
            {STATUS_LABELS[status]}
          </span>
        </div>
      </div>

      {/* Current task */}
      <div className="mb-4 rounded-lg border border-[#1a2340] bg-black/20 px-3 py-2">
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
          {agent.currentTask}
        </p>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <p className="text-[10px] text-slate-600">Completed</p>
          <p className={cn("text-sm font-bold", deptColor.text)}>
            {agent.completedToday}
          </p>
        </div>
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <p className="text-[10px] text-slate-600">Efficiency</p>
          <p className={cn("text-sm font-bold", deptColor.text)}>
            {agent.efficiency > 0 ? `${agent.efficiency}%` : "—"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={agent.name === "Marketing" ? "/marketing" : "#"}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
            deptColor.border,
            deptColor.bg,
            deptColor.text,
            "hover:opacity-80"
          )}
        >
          Open <ArrowRight className="h-3 w-3" />
        </Link>
        <button className="flex items-center gap-1.5 rounded-lg border border-[#1a2340] bg-[#080d1a] px-3 py-2 text-xs font-medium text-slate-500 hover:text-white hover:border-[#2a3560] transition-all">
          <MessageSquare className="h-3 w-3" />
          Chat
        </button>
      </div>
    </GlowCard>
  );
}

// ─── Agents Grid ──────────────────────────────────────────────────────────────

export function AgentsGrid() {
  const { agents, isLoading, hasRun } = useBackend();

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white">Department Agents</h2>
          <p className="text-xs text-slate-500">
            {isLoading ? (
              <span className="flex items-center gap-1.5 text-amber-400">
                <Loader2 className="h-3 w-3 animate-spin" />
                Agents thinking...
              </span>
            ) : hasRun ? (
              `${agents.filter((a) => a.status === "COMPLETE").length} agents completed tasks`
            ) : (
              `${agents.length} autonomous agents standing by`
            )}
          </p>
        </div>
        {hasRun && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400"
          >
            ● Live Results
          </motion.span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {isLoading
          ? // Show skeletons while loading
            [1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <AgentSkeleton />
              </motion.div>
            ))
          : agents.map((agent, i) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
      </div>
    </div>
  );
}
