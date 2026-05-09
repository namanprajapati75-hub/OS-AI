"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageSquare } from "lucide-react";
import { StatusDot, GlowCard } from "@/components/ui";
import { Agent, AgentStatus, DEPT_COLORS, mockAgents } from "@/data/mock";
import { cn } from "@/lib/utils";

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

function AgentCard({ agent }: { agent: Agent }) {
  const deptColor = DEPT_COLORS[agent.name];

  return (
    <GlowCard
      hover
      glowColor={agent.status !== "IDLE" ? deptColor.glow : undefined}
      className="relative group border"
      style={{ borderColor: agent.status !== "IDLE" ? undefined : undefined } as React.CSSProperties}
    >
      {/* Top accent line */}
      <div
        className={cn("absolute inset-x-0 top-0 h-px", `bg-gradient-to-r from-transparent via-current to-transparent`, deptColor.text)}
        style={{ opacity: agent.status !== "IDLE" ? 0.5 : 0.15 }}
      />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-xl", deptColor.bg)}>
            {agent.icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
            <p className="text-xs text-slate-500">{agent.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={agent.status} />
          <span className={cn("text-xs font-medium", STATUS_COLORS[agent.status])}>
            {STATUS_LABELS[agent.status]}
          </span>
        </div>
      </div>

      {/* Current task */}
      <div className="mb-4 rounded-lg border border-[#1a2340] bg-black/20 px-3 py-2">
        <p className="text-xs text-slate-500 leading-relaxed truncate">{agent.currentTask}</p>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <p className="text-[10px] text-slate-600">Completed</p>
          <p className={cn("text-sm font-bold", deptColor.text)}>{agent.completedToday}</p>
        </div>
        <div className="rounded-lg bg-black/20 px-3 py-2">
          <p className="text-[10px] text-slate-600">Efficiency</p>
          <p className={cn("text-sm font-bold", deptColor.text)}>{agent.efficiency}%</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={agent.name === "Marketing" ? "/marketing" : "#"}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all",
            deptColor.border, deptColor.bg, deptColor.text,
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

export function AgentsGrid() {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-base font-bold text-white">Department Agents</h2>
        <p className="text-xs text-slate-500">7 autonomous agents online</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {mockAgents.map((agent, i) => (
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
