"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline";
}

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "outline" && "border bg-transparent",
        className
      )}
    >
      {children}
    </span>
  );
}

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function GlowCard({ children, className, glowColor, hover = true, onClick }: GlowCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, scale: 1.005 } : undefined}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border border-[#1a2340] bg-[#080d1a] p-5",
        hover && "cursor-pointer transition-all duration-300 hover:border-[#2a3560] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]",
        onClick && "cursor-pointer",
        className
      )}
      style={glowColor ? { boxShadow: `0 0 30px ${glowColor}` } : undefined}
    >
      {children}
    </motion.div>
  );
}

interface StatusDotProps {
  status: "IDLE" | "WORKING" | "THINKING" | "COMPLETE";
  pulse?: boolean;
}

const statusConfig = {
  IDLE: { color: "bg-slate-500", glow: "" },
  WORKING: { color: "bg-orange-500", glow: "shadow-[0_0_6px_rgba(249,115,22,0.8)]" },
  THINKING: { color: "bg-purple-500", glow: "shadow-[0_0_6px_rgba(139,92,246,0.8)]" },
  COMPLETE: { color: "bg-green-500", glow: "shadow-[0_0_6px_rgba(34,197,94,0.8)]" },
};

export function StatusDot({ status, pulse = true }: StatusDotProps) {
  const cfg = statusConfig[status];
  return (
    <span className="relative flex h-2 w-2 flex-shrink-0">
      {pulse && status !== "IDLE" && (
        <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", cfg.color)} />
      )}
      <span className={cn("relative inline-flex h-2 w-2 rounded-full", cfg.color, cfg.glow)} />
    </span>
  );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant = "primary", size = "md", children, className, ...props }: ButtonProps) {
  const variants = {
    primary: "bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-400 hover:to-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.3)]",
    secondary: "bg-[#0d1424] border border-[#1a2340] text-slate-300 hover:border-[#2a3560] hover:text-white",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    danger: "bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs rounded-lg",
    md: "px-4 py-2 text-sm rounded-xl",
    lg: "px-6 py-3 text-base rounded-xl",
  };
  return (
    <button
      {...props}
      className={cn(
        "inline-flex items-center gap-2 font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </button>
  );
}

export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span className={cn("thinking-dots inline-flex items-center gap-0.5", className)}>
      <span className="status-dot working" style={{ background: "currentColor" }} />
      <span className="status-dot working" style={{ background: "currentColor" }} />
      <span className="status-dot working" style={{ background: "currentColor" }} />
    </span>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  positive?: boolean;
  icon?: React.ReactNode;
  color?: string;
}

export function StatCard({ label, value, change, positive = true, icon, color = "orange" }: StatCardProps) {
  const colorMap: Record<string, string> = {
    orange: "from-orange-500/20 to-orange-500/0 border-orange-500/20",
    purple: "from-purple-500/20 to-purple-500/0 border-purple-500/20",
    cyan: "from-cyan-500/20 to-cyan-500/0 border-cyan-500/20",
    green: "from-green-500/20 to-green-500/0 border-green-500/20",
    pink: "from-pink-500/20 to-pink-500/0 border-pink-500/20",
  };
  return (
    <GlowCard className={cn("bg-gradient-to-br", colorMap[color] || colorMap.orange)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-white">{typeof value === "number" ? value.toLocaleString() : value}</p>
          {change && (
            <p className={cn("mt-1 text-xs font-medium", positive ? "text-green-400" : "text-red-400")}>
              {positive ? "↑" : "↓"} {change}
            </p>
          )}
        </div>
        {icon && <div className="text-2xl opacity-80">{icon}</div>}
      </div>
    </GlowCard>
  );
}
