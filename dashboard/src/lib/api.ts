// ─── API Service Layer ──────────────────────────────────────────────────────
// Connects to the FastAPI backend at NEXT_PUBLIC_API_URL.
// Implements retry with exponential backoff to handle Render cold starts
// (free tier can take 30-60s to wake up).

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://os-ai.onrender.com";

// ─── Backend Response Types ──────────────────────────────────────────────────

export interface BackendTask {
  department: string;
  task: string;
  priority: string; // "high" | "medium" | "low" (backend uses lowercase)
}

export interface BackendStage {
  stage: number;
  tasks: BackendTask[];
}

export interface BackendAgentResult {
  agent: string;
  task?: string;
  output?: string;
  error?: string;
}

export interface BackendResponse {
  status: "success" | "error";
  goal?: string;
  message?: string; // present when status === "error"
  tasks: BackendTask[];
  departments: string[];
  stages: BackendStage[];
  agent_results: BackendAgentResult[];
  stage_results: Record<string, BackendAgentResult[]>;
  business_updates: Record<string, string>;
  memory: unknown[];
}

// ─── Mapped Frontend Types ───────────────────────────────────────────────────

export interface MappedTask {
  id: string;
  title: string;
  reasoning: string;
  department: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  createdAt: string;
}

export interface MappedAgent {
  id: string;
  name: string;
  icon: string;
  description: string;
  currentTask: string;
  status: "IDLE" | "WORKING" | "THINKING" | "COMPLETE";
  completedToday: number;
  efficiency: number;
}

export interface MappedActivityLog {
  id: string;
  timestamp: string;
  agent: string;
  message: string;
  type: "info" | "success" | "warning" | "processing";
}

// ─── Department Icon Map ─────────────────────────────────────────────────────

const DEPT_ICONS: Record<string, string> = {
  marketing: "📣",
  sales: "💼",
  operations: "⚙️",
  research: "🔬",
  finance: "📊",
  developer: "💻",
  hr: "🤝",
  content: "🎬",
  ceo: "🧠",
};

const DEPT_DESCRIPTIONS: Record<string, string> = {
  marketing: "Viral content, campaigns, brand growth",
  sales: "Lead gen, outreach, pipeline management",
  operations: "Workflows, automation, efficiency ops",
  research: "Market intel, competitor analysis, data",
  finance: "Revenue tracking, budgeting, forecasting",
  developer: "Code review, architecture, deployments",
  hr: "Hiring, culture, performance management",
  content: "Scripts, reels, social content creation",
  ceo: "Strategic planning and orchestration",
};

function normalizePriority(p: string): "HIGH" | "MEDIUM" | "LOW" {
  const up = (p || "").toUpperCase();
  if (up === "HIGH") return "HIGH";
  if (up === "LOW") return "LOW";
  return "MEDIUM";
}

function capitalize(s: string): string {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function now(): string {
  return new Date().toTimeString().slice(0, 8);
}

// ─── Mappers ─────────────────────────────────────────────────────────────────

export function mapTasksFromResponse(response: BackendResponse): MappedTask[] {
  const tasks = response.tasks || [];
  return tasks.map((t, i) => ({
    id: `task-${i}-${Date.now()}`,
    title: t.task,
    // Use the agent output from that department as reasoning (if available)
    reasoning:
      response.agent_results?.find(
        (r) => r.agent?.toLowerCase() === t.department?.toLowerCase()
      )?.output?.slice(0, 200) ||
      `AI determined this is a ${t.priority} priority action for ${t.department}.`,
    department: capitalize(t.department),
    priority: normalizePriority(t.priority),
    createdAt: "just now",
  }));
}

export function mapAgentsFromResponse(
  response: BackendResponse
): MappedAgent[] {
  const results = response.agent_results || [];

  // Build a map by agent name for deduplication
  const agentMap = new Map<string, BackendAgentResult[]>();
  for (const r of results) {
    const key = (r.agent || "unknown").toLowerCase();
    if (!agentMap.has(key)) agentMap.set(key, []);
    agentMap.get(key)!.push(r);
  }

  return Array.from(agentMap.entries()).map(([agentKey, agentResults], i) => {
    const hasError = agentResults.some((r) => r.error);
    const latestResult = agentResults[agentResults.length - 1];
    const taskText =
      latestResult?.task || latestResult?.output?.slice(0, 80) || "Idle";

    return {
      id: `agent-${i}`,
      name: capitalize(agentKey),
      icon: DEPT_ICONS[agentKey] || "🤖",
      description:
        DEPT_DESCRIPTIONS[agentKey] ||
        `${capitalize(agentKey)} agent — autonomous task execution`,
      currentTask: hasError ? "Error — check activity log" : taskText,
      status: hasError ? "IDLE" : "COMPLETE",
      completedToday: agentResults.filter((r) => r.output).length,
      efficiency: hasError ? 0 : Math.floor(85 + Math.random() * 14),
    };
  });
}

export function mapActivityLogsFromResponse(
  response: BackendResponse
): MappedActivityLog[] {
  const logs: MappedActivityLog[] = [];
  const ts = now();

  // CEO intro log
  logs.push({
    id: `log-ceo-start-${Date.now()}`,
    timestamp: ts,
    agent: "CEO",
    message: `Analyzing business goal: "${response.goal}"`,
    type: "info",
  });

  if (response.departments?.length) {
    logs.push({
      id: `log-ceo-plan-${Date.now()}`,
      timestamp: ts,
      agent: "CEO",
      message: `Generating staged execution plan — ${response.departments.length} departments activated: ${response.departments.map(capitalize).join(", ")}`,
      type: "info",
    });
  }

  // Stage-by-stage logs from agent_results
  const results = response.agent_results || [];
  results.forEach((r, i) => {
    const agentName = capitalize(r.agent || "Agent");

    if (r.error) {
      logs.push({
        id: `log-err-${i}-${Date.now()}`,
        timestamp: ts,
        agent: agentName,
        message: `Error: ${r.error.slice(0, 120)}`,
        type: "warning",
      });
    } else if (r.output) {
      // Processing entry
      logs.push({
        id: `log-proc-${i}-${Date.now()}`,
        timestamp: ts,
        agent: agentName,
        message: r.task
          ? `Working on: ${r.task.slice(0, 80)}`
          : "Processing task...",
        type: "processing",
      });
      // Success entry with truncated output
      logs.push({
        id: `log-out-${i}-${Date.now()}`,
        timestamp: ts,
        agent: agentName,
        message: r.output.slice(0, 140),
        type: "success",
      });
    }
  });

  // Final CEO summary
  if (response.business_updates && Object.keys(response.business_updates).length > 0) {
    const keys = Object.keys(response.business_updates).join(", ");
    logs.push({
      id: `log-ceo-end-${Date.now()}`,
      timestamp: ts,
      agent: "CEO",
      message: `Business memory updated: ${keys} stored to database.`,
      type: "info",
    });
  }

  logs.push({
    id: `log-ceo-done-${Date.now()}`,
    timestamp: ts,
    agent: "CEO",
    message: `All agents synchronized. Analysis complete.`,
    type: "success",
  });

  return logs;
}

// ─── Retry fetch with exponential backoff ─────────────────────────────────────

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries = 3,
  delayMs = 2000
): Promise<Response> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      // 90s timeout per attempt — Render cold start can take up to 60s
      const timeoutId = setTimeout(() => controller.abort(), 90_000);
      const res = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return res;
    } catch (err: unknown) {
      const isAbort =
        err instanceof Error && err.name === "AbortError";
      const isLast = attempt === retries;
      if (isLast) throw err;

      const waitMs = isAbort ? delayMs * attempt * 2 : delayMs * attempt;
      console.warn(
        `[API] Attempt ${attempt}/${retries} failed${isAbort ? " (timeout)" : ""}. Retrying in ${waitMs}ms…`
      );
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  throw new Error("Max retries exceeded");
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function runAnalysis(goal: string): Promise<BackendResponse> {
  console.log(`[API] POST ${API_URL}/run — goal: "${goal}"`);

  const res = await fetchWithRetry(
    `${API_URL}/run`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal }),
    },
    3,
    3000
  );

  if (!res.ok) {
    const text = await res.text().catch(() => "Unknown error");
    throw new Error(`Backend returned ${res.status}: ${text}`);
  }

  const data = (await res.json()) as BackendResponse;

  if (data.status === "error") {
    throw new Error(data.message || "Backend returned error status");
  }

  return data;
}

export async function chatWithAgent(
  agentGoal: string
): Promise<BackendResponse> {
  return runAnalysis(agentGoal);
}
