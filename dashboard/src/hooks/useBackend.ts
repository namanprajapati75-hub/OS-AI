// ─── useBackend Hook ──────────────────────────────────────────────────────────
// Thin adapter over the Zustand store. Components import this instead of
// the store directly, keeping the API surface minimal and testable.

import { useDashboardStore } from "@/lib/store";

export function useBackend() {
  const store = useDashboardStore();

  return {
    // State
    isLoading: store.isLoading,
    isError: store.isError,
    errorMessage: store.errorMessage,
    hasRun: store.hasRun,
    retryAttempt: store.retryAttempt,
    goal: store.goal,
    tasks: store.tasks,
    agents: store.agents,
    activityLogs: store.activityLogs,
    ceoAnalysis: store.ceoAnalysis,
    departments: store.departments,
    lastRunAt: store.lastRunAt,

    // Actions
    setGoal: store.setGoal,
    run: store.runAnalysis,
    approveTask: store.approveTask,
    skipTask: store.skipTask,
    reanalyzeTask: store.reanalyzeTask,
    chatWithAgent: store.chatWithAgent,
    clearError: store.clearError,
    appendLog: store.appendLog,
  };
}
