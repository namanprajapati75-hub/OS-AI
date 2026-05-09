export type Department =
  | "Marketing"
  | "Sales"
  | "Operations"
  | "Research"
  | "Finance"
  | "Developer"
  | "HR";

export type Priority = "HIGH" | "MEDIUM" | "LOW";
export type AgentStatus = "IDLE" | "WORKING" | "THINKING" | "COMPLETE";

export interface Task {
  id: string;
  title: string;
  reasoning: string;
  department: Department;
  priority: Priority;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: Department;
  icon: string;
  description: string;
  currentTask: string;
  status: AgentStatus;
  completedToday: number;
  efficiency: number;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: "info" | "success" | "warning" | "processing";
}

export const DEPT_COLORS: Record<Department, { text: string; bg: string; border: string; glow: string }> = {
  Marketing: {
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    glow: "rgba(236,72,153,0.2)",
  },
  Sales: {
    text: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "rgba(34,197,94,0.2)",
  },
  Operations: {
    text: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "rgba(59,130,246,0.2)",
  },
  Research: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "rgba(6,182,212,0.2)",
  },
  Finance: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "rgba(16,185,129,0.2)",
  },
  Developer: {
    text: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    glow: "rgba(99,102,241,0.2)",
  },
  HR: {
    text: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "rgba(168,85,247,0.2)",
  },
};

export const PRIORITY_COLORS: Record<Priority, { text: string; bg: string; border: string }> = {
  HIGH: { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/30" },
  MEDIUM: { text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" },
  LOW: { text: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30" },
};

export const mockTasks: Task[] = [
  {
    id: "t1",
    title: "Generate viral reel concepts for Instagram growth",
    reasoning: "Engagement data shows short-form video drives 3x more reach. Prioritizing now for Q2 push.",
    department: "Marketing",
    priority: "HIGH",
    createdAt: "2m ago",
  },
  {
    id: "t2",
    title: "Identify 50 warm B2B leads in SaaS niche",
    reasoning: "Pipeline velocity dropped 18% last week. Research shows LinkedIn outreach converts 2.4x better.",
    department: "Sales",
    priority: "HIGH",
    createdAt: "5m ago",
  },
  {
    id: "t3",
    title: "Analyze competitor pricing strategies",
    reasoning: "Three competitors repriced in the past 30 days. Need updated intel before board review.",
    department: "Research",
    priority: "MEDIUM",
    createdAt: "12m ago",
  },
  {
    id: "t4",
    title: "Automate weekly financial reporting pipeline",
    reasoning: "Manual CFO reports taking 4h/week. Automation would free strategic capacity.",
    department: "Finance",
    priority: "MEDIUM",
    createdAt: "18m ago",
  },
  {
    id: "t5",
    title: "Draft onboarding workflow for new engineers",
    reasoning: "Latest cohort ramp time 40% above benchmark. Structured onboarding reduces time-to-merge.",
    department: "HR",
    priority: "LOW",
    createdAt: "35m ago",
  },
  {
    id: "t6",
    title: "Refactor API authentication to OAuth 2.0",
    reasoning: "Current token system has 3 known vulnerabilities. Security audit requires upgrade by EOQ.",
    department: "Developer",
    priority: "HIGH",
    createdAt: "41m ago",
  },
];

export const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "Marketing",
    icon: "📣",
    description: "Viral content, campaigns, brand growth",
    currentTask: "Generating reel hooks for Instagram",
    status: "WORKING",
    completedToday: 12,
    efficiency: 94,
  },
  {
    id: "a2",
    name: "Sales",
    icon: "💼",
    description: "Lead gen, outreach, pipeline management",
    currentTask: "Analyzing LinkedIn prospects",
    status: "THINKING",
    completedToday: 8,
    efficiency: 87,
  },
  {
    id: "a3",
    name: "Operations",
    icon: "⚙️",
    description: "Workflows, automation, efficiency ops",
    currentTask: "Idle — awaiting CEO directive",
    status: "IDLE",
    completedToday: 5,
    efficiency: 91,
  },
  {
    id: "a4",
    name: "Research",
    icon: "🔬",
    description: "Market intel, competitor analysis, data",
    currentTask: "Scraping competitor pricing pages",
    status: "WORKING",
    completedToday: 15,
    efficiency: 98,
  },
  {
    id: "a5",
    name: "Finance",
    icon: "📊",
    description: "Revenue tracking, budgeting, forecasting",
    currentTask: "Q2 revenue forecast model",
    status: "COMPLETE",
    completedToday: 6,
    efficiency: 96,
  },
  {
    id: "a6",
    name: "Developer",
    icon: "💻",
    description: "Code review, architecture, deployments",
    currentTask: "Reviewing OAuth 2.0 PR",
    status: "WORKING",
    completedToday: 9,
    efficiency: 89,
  },
  {
    id: "a7",
    name: "HR",
    icon: "🤝",
    description: "Hiring, culture, performance management",
    currentTask: "Drafting engineer onboarding docs",
    status: "THINKING",
    completedToday: 4,
    efficiency: 82,
  },
];

export const mockActivityLog: ActivityLog[] = [
  { id: "l1", timestamp: "18:42:01", agent: "CEO", message: "Analyzing business goal: 'Scale to 10k users by Q3'", type: "info" },
  { id: "l2", timestamp: "18:42:04", agent: "CEO", message: "Generating staged execution plan — 4 departments activated", type: "info" },
  { id: "l3", timestamp: "18:42:08", agent: "Research", message: "Market research initiated. Querying DuckDuckGo for competitor data...", type: "processing" },
  { id: "l4", timestamp: "18:42:15", agent: "Research", message: "Found 14 relevant competitor signals. Trend: AI agents in SaaS +340% YoY", type: "success" },
  { id: "l5", timestamp: "18:42:17", agent: "Marketing", message: "Receiving research insights from Stage 1. Analyzing viral patterns...", type: "processing" },
  { id: "l6", timestamp: "18:42:22", agent: "Marketing", message: "Generated 8 viral hook templates. Top hook score: 94/100", type: "success" },
  { id: "l7", timestamp: "18:42:24", agent: "Content", message: "Receiving marketing + research context. Creating reel scripts...", type: "processing" },
  { id: "l8", timestamp: "18:42:31", agent: "Sales", message: "Prospecting 50 warm leads. LinkedIn signals: 12 decision-makers active today", type: "processing" },
  { id: "l9", timestamp: "18:42:35", agent: "Sales", message: "Pipeline updated. 3 high-intent leads flagged for human review", type: "warning" },
  { id: "l10", timestamp: "18:42:38", agent: "CEO", message: "Stage 4 complete. All agents synchronized. Memory stored to PostgreSQL.", type: "success" },
];

// Marketing page mock data
export const mockMarketingStats = {
  followers: 24_800,
  avgViews: 48_200,
  totalLikes: 312_000,
  growthPct: 23.4,
  reelsAnalyzed: 142,
};

export const mockReelIdeas = [
  {
    id: "r1",
    title: "The 3AM Grind Reel",
    hook: "Nobody talks about what happens at 3AM when you're building a startup...",
    category: "Founder Story",
    prediction: 92,
    cta: "Follow for daily build logs",
  },
  {
    id: "r2",
    title: "AI vs Human Marketing",
    hook: "I let an AI run my marketing for 7 days. Here's what happened...",
    category: "AI Content",
    prediction: 88,
    cta: "Comment 'AI' to get the prompt",
  },
  {
    id: "r3",
    title: "Revenue Reveal",
    hook: "Month 3 revenue: $0. Month 6 revenue: $12,400. Here's exactly what changed.",
    category: "Growth",
    prediction: 95,
    cta: "Save this for your journey",
  },
  {
    id: "r4",
    title: "Cold DM That Converts",
    hook: "This 3-line cold DM got me 4 clients in 48 hours. Copy it.",
    category: "Sales",
    prediction: 85,
    cta: "Send to a founder friend",
  },
];

export const mockMarketingInsights = [
  {
    id: "i1",
    title: "Top Performing Hook Pattern",
    insight: "Hooks starting with numbers (e.g. '7 days', '$12k') outperform question hooks by 34% in your niche.",
    type: "success",
    icon: "📈",
  },
  {
    id: "i2",
    title: "Optimal Posting Window",
    insight: "Your audience is most active Tue-Thu between 7-9PM IST. Posting during this window yields 2.1x reach.",
    type: "info",
    icon: "⏰",
  },
  {
    id: "i3",
    title: "Content Weakness Detected",
    insight: "CTA click-through dropping 12% over last 30 days. Recommend A/B testing 'comment' vs 'DM' CTAs.",
    type: "warning",
    icon: "⚠️",
  },
  {
    id: "i4",
    title: "Viral Pattern",
    insight: "Before/after format reels are getting 3.4x saves compared to educational content in your category.",
    type: "success",
    icon: "🔥",
  },
];

export const mockEngagementData = [
  { day: "Mon", views: 32000, likes: 2100, saves: 890 },
  { day: "Tue", views: 45000, likes: 3200, saves: 1200 },
  { day: "Wed", views: 38000, likes: 2800, saves: 1050 },
  { day: "Thu", views: 67000, likes: 5100, saves: 2300 },
  { day: "Fri", views: 52000, likes: 4200, saves: 1800 },
  { day: "Sat", views: 41000, likes: 3100, saves: 1100 },
  { day: "Sun", views: 28000, likes: 1900, saves: 700 },
];
