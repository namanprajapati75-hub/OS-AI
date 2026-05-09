// ─── Zustand Global Dashboard Store ──────────────────────────────────────────
// Central state for the live dashboard. All components read from here;
// only the CEO card triggers the `runAnalysis` action.

import { create } from "zustand";
import {
  runAnalysis as apiRunAnalysis,
  chatWithAgent as apiChatWithAgent,
  mapTasksFromResponse,
  mapAgentsFromResponse,
  mapActivityLogsFromResponse,
  MappedTask,
  MappedAgent,
  MappedActivityLog,
  BackendResponse,
} from "@/lib/api";

// ─── Default mock agents shown before first run ───────────────────────────────
// Keeps the cinematic UI looking populated on initial load.
const DEFAULT_AGENTS: MappedAgent[] = [
  { id: "d1", name: "Marketing",   icon: "📣", description: "Viral content, campaigns, brand growth",        currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d2", name: "Sales",       icon: "💼", description: "Lead gen, outreach, pipeline management",       currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d3", name: "Research",    icon: "🔬", description: "Market intel, competitor analysis, data",       currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d4", name: "Operations",  icon: "⚙️", description: "Workflows, automation, efficiency ops",         currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d5", name: "Finance",     icon: "📊", description: "Revenue tracking, budgeting, forecasting",      currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d6", name: "Developer",   icon: "💻", description: "Code review, architecture, deployments",        currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
  { id: "d7", name: "HR",          icon: "🤝", description: "Hiring, culture, performance management",       currentTask: "Awaiting CEO directive", status: "IDLE", completedToday: 0, efficiency: 0 },
];

// ─── Store Shape ──────────────────────────────────────────────────────────────

export interface DashboardState {
  // Status flags
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  hasRun: boolean; // true once at least one successful run completed
  retryAttempt: number; // current retry count (for cold-start UX messaging)

  // Live data
  goal: string;
  tasks: MappedTask[];
  agents: MappedAgent[];
  activityLogs: MappedActivityLog[];
  ceoAnalysis: string; // free-text CEO summary
  departments: string[];
  lastRunAt: string | null;
  rawResponse: BackendResponse | null;

  // Actions
  setGoal: (goal: string) => void;
  runAnalysis: (goal: string) => Promise<void>;
  approveTask: (id: string) => void;
  skipTask: (id: string) => void;
  reanalyzeTask: (id: string) => Promise<void>;
  chatWithAgent: (agentGoal: string) => Promise<BackendResponse>;
  clearError: () => void;
  appendLog: (log: MappedActivityLog) => void;
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // ── Initial state ──────────────────────────────────────────────────────────
  isLoading: false,
  isError: false,
  errorMessage: "",
  hasRun: false,
  retryAttempt: 0,

  goal: "Build a faceless AI finance brand",
  tasks: [],
  agents: DEFAULT_AGENTS,
  activityLogs: [],
  ceoAnalysis: "",
  departments: [],
  lastRunAt: null,
  rawResponse: null,

  // ── Actions ────────────────────────────────────────────────────────────────

  setGoal: (goal) => set({ goal }),

  runAnalysis: async (goal) => {
    set({
      isLoading: true,
      isError: false,
      errorMessage: "",
      retryAttempt: 0,
      hasRun: false,
    });

    // Set all default agents to "THINKING" while loading
    set((s) => ({
      agents: s.agents.map((a) => ({ ...a, status: "THINKING" as const })),
    }));

    try {
      // Append a cold-start activity log entry immediately so the feed looks live
      const startLog: MappedActivityLog = {
        id: `log-start-${Date.now()}`,
        timestamp: new Date().toTimeString().slice(0, 8),
        agent: "CEO",
        message: `Received goal: "${goal}" — warming up multi-agent system...`,
        type: "info",
      };
      set({ activityLogs: [startLog] });

      // The API call itself handles retries internally
      const response = await apiRunAnalysis(goal);

      // Map all the data
      const tasks = mapTasksFromResponse(response);
      const agents = mapAgentsFromResponse(response);
      const activityLogs = mapActivityLogsFromResponse(response);

      // Build CEO analysis string from business_updates
      const buUpdates = response.business_updates || {};
      const ceoAnalysis = Object.entries(buUpdates)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n") || goal;

      set({
        isLoading: false,
        hasRun: true,
        goal,
        tasks,
        agents: agents.length > 0 ? agents : DEFAULT_AGENTS,
        activityLogs,
        ceoAnalysis,
        departments: response.departments || [],
        lastRunAt: new Date().toISOString(),
        rawResponse: response,
        retryAttempt: 0,
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Unknown error occurred";

      // Revert agents to idle
      set((s) => ({
        isLoading: false,
        isError: true,
        errorMessage: msg,
        agents: s.agents.map((a) => ({
          ...a,
          status: "IDLE" as const,
          currentTask: "Error — see activity log",
        })),
        activityLogs: [
          ...get().activityLogs,
          {
            id: `log-err-${Date.now()}`,
            timestamp: new Date().toTimeString().slice(0, 8),
            agent: "CEO",
            message: `Error: ${msg}`,
            type: "warning" as const,
          },
        ],
      }));
    }
  },

  approveTask: (id) => {
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
      activityLogs: [
        ...s.activityLogs,
        {
          id: `log-approve-${Date.now()}`,
          timestamp: new Date().toTimeString().slice(0, 8),
          agent: "CEO",
          message: `Task approved by operator — executing now.`,
          type: "success" as const,
        },
      ],
    }));
  },

  skipTask: (id) => {
    set((s) => ({
      tasks: s.tasks.filter((t) => t.id !== id),
    }));
  },

  reanalyzeTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (!task) return;
    // Re-run the full analysis scoped to that task
    await get().runAnalysis(`Re-analyze and execute: ${task.title}`);
  },

  chatWithAgent: async (agentGoal) => {
    return apiChatWithAgent(agentGoal);
  },

  clearError: () => set({ isError: false, errorMessage: "" }),

  appendLog: (log) => {
    set((s) => ({ activityLogs: [...s.activityLogs.slice(-50), log] }));
  },
}));
