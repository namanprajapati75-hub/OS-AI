"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, TrendingUp, Eye, Heart, BarChart2, Film,
  Lightbulb, Calendar, Send, Bot, User, Sparkles, Play
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Header } from "@/components/dashboard/Header";
import { StatCard, GlowCard, Badge, Button } from "@/components/ui";
import {
  mockMarketingStats, mockReelIdeas, mockMarketingInsights,
  mockEngagementData
} from "@/data/mock";
import { cn } from "@/lib/utils";

// ─── Dynamic Imports ─────────────────────────────────────────────
const AnalyticsChart = dynamic(() => import("@/components/dashboard/AnalyticsChart"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 w-full items-center justify-center rounded-2xl border border-[#1a2340] bg-[#080d1a]">
      <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
    </div>
  ),
});

// ─── Stat Cards ──────────────────────────────────────────────────
function StatsRow() {
  const { followers, avgViews, totalLikes, growthPct, reelsAnalyzed } = mockMarketingStats;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      <StatCard label="Followers" value={followers} change="12.3% this month" positive icon="👥" color="pink" />
      <StatCard label="Avg Views" value={avgViews} change="8.7% vs last week" positive icon="👁️" color="purple" />
      <StatCard label="Total Likes" value={totalLikes} change="18.2% this month" positive icon="❤️" color="orange" />
      <StatCard label="Growth %" value={`+${growthPct}%`} change="vs last month" positive icon="📈" color="green" />
      <StatCard label="Reels Analyzed" value={reelsAnalyzed} change="Last 30 days" positive icon="🎬" color="cyan" />
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────────
const TABS = ["Overview", "Reels", "Ideas", "Analytics", "Calendar"] as const;
type Tab = typeof TABS[number];

function TabBar({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 rounded-xl border border-[#1a2340] bg-[#080d1a] p-1 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200",
            active === tab
              ? "bg-[#0d1424] text-white border border-[#2a3560] shadow-sm"
              : "text-slate-500 hover:text-slate-300"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

// ─── AI Insights ─────────────────────────────────────────────────
function InsightsSection() {
  return (
    <div>
      <h3 className="mb-3 text-sm font-bold text-white">AI Insights</h3>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {mockMarketingInsights.map((insight) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlowCard
              hover
              className={cn(
                "border",
                insight.type === "success" ? "border-green-500/20" :
                insight.type === "warning" ? "border-amber-500/20" :
                "border-[#1a2340]"
              )}
              glowColor={
                insight.type === "success" ? "rgba(34,197,94,0.05)" :
                insight.type === "warning" ? "rgba(245,158,11,0.05)" : undefined
              }
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{insight.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">{insight.title}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{insight.insight}</p>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Content Ideas ────────────────────────────────────────────────
function IdeasSection() {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold text-white">AI-Generated Content Ideas</h3>
        <button className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-300 transition-colors">
          <Sparkles className="h-3 w-3" />
          Generate more
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {mockReelIdeas.map((idea, i) => (
          <motion.div
            key={idea.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <GlowCard hover glowColor="rgba(236,72,153,0.08)" className="border border-pink-500/10">
              {/* Top */}
              <div className="mb-3 flex items-start justify-between">
                <Badge className="border border-pink-500/30 bg-pink-500/10 text-pink-400 text-[10px]">
                  {idea.category}
                </Badge>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-400" />
                  <span className="text-xs font-bold text-green-400">{idea.prediction}%</span>
                  <span className="text-[10px] text-slate-600">predicted</span>
                </div>
              </div>

              {/* Title */}
              <h4 className="mb-2 text-sm font-bold text-white">{idea.title}</h4>

              {/* Hook */}
              <div className="mb-4 rounded-lg border border-[#1a2340] bg-black/30 p-3">
                <p className="text-xs font-medium text-slate-400 italic">
                  &ldquo;{idea.hook}&rdquo;
                </p>
              </div>

              {/* CTA + action */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-600">CTA: {idea.cta}</span>
                <button className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-400 hover:bg-purple-500/20 transition-all">
                  <Play className="h-3 w-3" />
                  Write Script
                </button>
              </div>
            </GlowCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics Chart ─────────────────────────────────────────────
function AnalyticsSection() {
  return <AnalyticsChart />;
}

// ─── AI Chat Panel ────────────────────────────────────────────────
interface ChatMessage {
  role: "user" | "ai";
  content: string;
  ts: string;
}

const QUICK_PROMPTS = [
  "Write a viral hook for my next reel",
  "Analyze my best performing content",
  "Suggest a content calendar for this week",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "ai",
    content: "Hey! I'm your Marketing AI. I've analyzed 142 reels and 30 days of engagement data. Ask me anything — hooks, captions, strategy, or content ideas.",
    ts: "18:40",
  },
];

function MarketingChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const MOCK_RESPONSES: Record<string, string> = {
    default: "Based on your engagement data, I recommend posting between 7-9PM IST on Tuesdays and Thursdays. Your 'before/after' format reels are getting 3.4x more saves. Want me to write a script using that format?",
    hook: "Here are 3 viral hooks for your niche:\n\n1. 'I made $12k in 6 months with just this one system...'\n2. 'Nobody's talking about this AI strategy. Here's why it works.'\n3. 'I went from 0 to 10k followers in 90 days. This is the exact formula.'",
    calendar: "Here's your content calendar:\n\n📅 Mon: Educational (AI tips)\n📅 Tue: Behind-the-scenes (7PM)\n📅 Wed: Value post (stats/data)\n📅 Thu: Viral reel (before/after)\n📅 Fri: Engagement story\n📅 Sat: Off\n📅 Sun: Week-in-review",
  };

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, ts: new Date().toTimeString().slice(0, 5) }]);
    setThinking(true);

    await new Promise((r) => setTimeout(r, 1200));
    const key = userMsg.toLowerCase().includes("hook") ? "hook" :
                 userMsg.toLowerCase().includes("calendar") ? "calendar" : "default";

    setMessages((prev) => [...prev, {
      role: "ai",
      content: MOCK_RESPONSES[key],
      ts: new Date().toTimeString().slice(0, 5),
    }]);
    setThinking(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div className="flex h-full flex-col rounded-2xl border border-[#1a2340] bg-[#080d1a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[#1a2340] px-4 py-3 bg-black/20">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600">
          <Bot className="h-4 w-4 text-white" />
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Marketing AI</p>
          <p className="text-[10px] text-green-400">● Online — 142 reels analyzed</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex gap-2", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
          >
            <div className={cn(
              "flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs",
              msg.role === "ai"
                ? "bg-gradient-to-br from-pink-500 to-purple-600"
                : "bg-[#0d1424] border border-[#2a3560]"
            )}>
              {msg.role === "ai" ? "🤖" : "👤"}
            </div>
            <div className={cn(
              "max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed whitespace-pre-wrap",
              msg.role === "ai"
                ? "bg-[#0d1424] border border-[#1a2340] text-slate-300"
                : "bg-purple-600 text-white"
            )}>
              {msg.content}
            </div>
          </motion.div>
        ))}

        {thinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-xs">
              🤖
            </div>
            <div className="rounded-2xl border border-[#1a2340] bg-[#0d1424] px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="inline-block h-1.5 w-1.5 rounded-full bg-purple-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick prompts */}
      <div className="px-4 pb-2 flex gap-1.5 flex-wrap">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p}
            onClick={() => setInput(p)}
            className="rounded-full border border-[#1a2340] bg-[#080d1a] px-2.5 py-1 text-[10px] text-slate-500 hover:text-slate-300 hover:border-[#2a3560] transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-[#1a2340] p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Marketing anything..."
            className="flex-1 rounded-xl border border-[#1a2340] bg-[#0d1424] px-4 py-2.5 text-xs text-slate-200 placeholder-slate-600 outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 transition-all"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-white disabled:opacity-40 transition-all hover:scale-105"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Tab Content ──────────────────────────────────────────────────
function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "Overview": return (
      <div className="space-y-8">
        <InsightsSection />
        <IdeasSection />
      </div>
    );
    case "Reels": return <IdeasSection />;
    case "Ideas": return <IdeasSection />;
    case "Analytics": return <AnalyticsSection />;
    case "Calendar": return (
      <GlowCard hover={false} className="flex items-center justify-center py-20">
        <div className="text-center">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-slate-600" />
          <p className="text-sm text-slate-500">Content calendar coming soon</p>
        </div>
      </GlowCard>
    );
  }
}

// ─── Marketing Page ───────────────────────────────────────────────
export default function MarketingPage() {
  const [tab, setTab] = useState<Tab>("Overview");

  return (
    <div className="min-h-screen bg-[#030712] grid-bg">
      <Header />

      {/* Hero banner */}
      <div className="relative overflow-hidden border-b border-[#1a2340] bg-[#080d1a]">
        <div className="pointer-events-none absolute -top-20 left-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pink-500/60 to-transparent" />

        <div className="mx-auto max-w-[1600px] px-6 py-8">
          <Link href="/" className="mb-4 inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="h-3 w-3" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 text-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              📣
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Marketing Agent</h1>
              <p className="text-sm text-slate-500">Autonomous AI Content Strategist — 142 reels analyzed</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Working
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1600px] px-6 py-8">
        {/* Stats */}
        <div className="mb-8">
          <StatsRow />
        </div>

        {/* Main content + Chat panel */}
        <div className="flex gap-6">
          {/* Left: Main content */}
          <div className="flex-1 min-w-0 space-y-6">
            <TabBar active={tab} onChange={setTab} />
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <TabContent tab={tab} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Chat panel */}
          <div className="w-80 flex-shrink-0 hidden xl:flex flex-col" style={{ height: "calc(100vh - 200px)", position: "sticky", top: "80px" }}>
            <MarketingChatPanel />
          </div>
        </div>
      </main>
    </div>
  );
}
