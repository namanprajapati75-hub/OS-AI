"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell, Settings, Zap, Brain, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

export function Header() {
  const [autonomous, setAutonomous] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1a2340] glass">
      <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-purple-600 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.8)]" />
          </div>
          <div>
            <span className="font-bold text-white text-sm tracking-tight">PhaseAI</span>
            <span className="text-slate-500 text-sm"> — Business OS</span>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: "/", label: "Dashboard" },
            { href: "/marketing", label: "Marketing" },
            { href: "#", label: "Sales" },
            { href: "#", label: "Research" },
            { href: "#", label: "Finance" },
          ].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* CEO Status */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#1a2340] bg-[#080d1a] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
            </span>
            <span className="text-xs text-slate-400">CEO Active</span>
          </div>

          {/* Autonomous Toggle */}
          <button
            onClick={() => setAutonomous(!autonomous)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-300",
              autonomous
                ? "border-purple-500/50 bg-purple-500/10 text-purple-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                : "border-[#1a2340] bg-[#080d1a] text-slate-400 hover:border-[#2a3560]"
            )}
          >
            <Zap className="h-3 w-3" />
            {autonomous ? "Autonomous ON" : "Auto Mode"}
          </button>

          <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a2340] bg-[#080d1a] text-slate-400 hover:text-white transition-colors">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">3</span>
          </button>

          <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#1a2340] bg-[#080d1a] text-slate-400 hover:text-white transition-colors">
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
