"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { GlowCard } from "@/components/ui";
import { mockEngagementData } from "@/data/mock";

export default function AnalyticsChart() {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold text-white">Engagement This Week</h3>
      <GlowCard hover={false} className="p-6">
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={mockEngagementData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a2340" />
            <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#080d1a", border: "1px solid #1a2340", borderRadius: "12px", color: "#f1f5f9" }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area type="monotone" dataKey="views" name="Views" stroke="#ec4899" fill="url(#viewsGradient)" strokeWidth={2} />
            <Area type="monotone" dataKey="likes" name="Likes" stroke="#8b5cf6" fill="url(#likesGradient)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </GlowCard>
    </div>
  );
}
