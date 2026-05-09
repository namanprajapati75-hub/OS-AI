"use client";

import { Header } from "@/components/dashboard/Header";
import { CEOHeroCard } from "@/components/dashboard/CEOHeroCard";
import { TaskQueueSection } from "@/components/dashboard/TaskQueue";
import { AgentsGrid } from "@/components/dashboard/AgentsGrid";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#030712] grid-bg">
      <Header />

      <main className="mx-auto max-w-[1600px] px-6 py-8 space-y-8">
        {/* CEO Hero */}
        <section>
          <CEOHeroCard />
        </section>

        {/* Task Queue + Activity Log (side by side on large screens) */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <TaskQueueSection />
          </div>
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </section>

        {/* Agents Grid */}
        <section>
          <AgentsGrid />
        </section>
      </main>
    </div>
  );
}
