import { useState, useMemo, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Crown, Shield, Flame, Zap, Trophy, Star, TrendingUp } from "lucide-react";
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useXPContext } from "../context/XPContext";
import { useAuth } from "../context/AuthContext";
import { dashboardService } from "../services/dashboardService";

type TabKey = "global" | "mystats";
type ChartPeriod = "weekly" | "biweekly" | "monthly" | "yearly";

interface MockHunter {
  name: string;
  xp: number;
  streak: number;
  completions: number;
}

interface ChartPoint {
  label: string;
  rate: number;
}

const MOCK_HUNTERS: MockHunter[] = [
  { name: "Shadow Monarch", xp: 14200, streak: 120, completions: 890 },
  { name: "Iron Fang", xp: 11800, streak: 98, completions: 740 },
  { name: "Frost Blade", xp: 9500, streak: 85, completions: 620 },
  { name: "Crimson Knight", xp: 7800, streak: 72, completions: 510 },
  { name: "Storm Weaver", xp: 6200, streak: 60, completions: 430 },
  { name: "Dark Phantom", xp: 4800, streak: 45, completions: 350 },
  { name: "Silver Fang", xp: 3200, streak: 38, completions: 280 },
  { name: "Venom Strike", xp: 2100, streak: 25, completions: 190 },
  { name: "Steel Warden", xp: 1200, streak: 15, completions: 120 },
  { name: "Ember Scout", xp: 400, streak: 7, completions: 45 },
];

function getRankForXP(xp: number): { rank: string; color: string } {
  if (xp >= 10000) return { rank: "S", color: "#ef4444" };
  if (xp >= 6000) return { rank: "A", color: "#fbbf24" };
  if (xp >= 3000) return { rank: "B", color: "#7c3aed" };
  if (xp >= 1500) return { rank: "C", color: "#00d4ff" };
  if (xp >= 500) return { rank: "D", color: "#22c55e" };
  return { rank: "E", color: "#6b7280" };
}

function getPositionStyle(position: number): { color: string; icon: typeof Crown | null; label: string } {
  if (position === 1) return { color: "#fbbf24", icon: Crown, label: "gold" };
  if (position === 2) return { color: "#c0c0c0", icon: Trophy, label: "silver" };
  if (position === 3) return { color: "#cd7f32", icon: Star, label: "bronze" };
  return { color: "#94a3b8", icon: null, label: "" };
}

function getPeriodDays(period: ChartPeriod): number {
  if (period === "weekly") return 7;
  if (period === "biweekly") return 14;
  if (period === "monthly") return 30;
  return 365;
}

export function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("global");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("weekly");
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const { xp, rankInfo, level } = useXPContext();
  const { user } = useAuth();

  const userName = user?.full_name || "Hunter";

  useEffect(() => {
    dashboardService.getDashboard().then(({ data }) => {
      setBestStreak(data.streaks.best_current?.streak ?? 0);
      setTotalCompletions(data.today.completed_count ?? 0);
    }).catch(() => {});
    dashboardService.getHistory(365).then(({ data }) => {
      const total = data.days.reduce((sum, d) => sum + d.count, 0);
      setTotalCompletions(total);
    }).catch(() => {});
  }, []);

  const fetchChartData = useCallback(async (period: ChartPeriod) => {
    const days = getPeriodDays(period);
    try {
      const [historyRes, dashRes] = await Promise.all([
        dashboardService.getHistory(days),
        dashboardService.getDashboard(),
      ]);

      const totalHabits = dashRes.data.today.total_count || 1;
      const historyMap = new Map<string, number>();

      for (const day of historyRes.data.days) {
        const rate = Math.round((day.count / totalHabits) * 100);
        historyMap.set(day.date, Math.min(rate, 100));
      }

      const now = new Date();
      const points: ChartPoint[] = [];

      if (period === "yearly") {
        // Group by month for yearly view
        for (let i = 11; i >= 0; i--) {
          const monthDate = new Date(now);
          monthDate.setMonth(monthDate.getMonth() - i);
          const y = monthDate.getFullYear();
          const m = monthDate.getMonth();

          let total = 0;
          let count = 0;
          const daysInMonth = new Date(y, m + 1, 0).getDate();
          for (let d = 1; d <= daysInMonth; d++) {
            const key = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const val = historyMap.get(key);
            if (val !== undefined) {
              total += val;
              count++;
            }
          }

          points.push({
            label: monthDate.toLocaleDateString("en-US", { month: "short" }),
            rate: count > 0 ? Math.round(total / count) : 0,
          });
        }
      } else {
        for (let i = days - 1; i >= 0; i--) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

          const label = period === "weekly"
            ? d.toLocaleDateString("en-US", { weekday: "short" })
            : `${d.getMonth() + 1}/${d.getDate()}`;

          points.push({
            label,
            rate: historyMap.get(key) ?? 0,
          });
        }
      }

      setChartData(points);
    } catch {
      setChartData([]);
    }
  }, []);

  useEffect(() => {
    fetchChartData(chartPeriod);
  }, [chartPeriod, fetchChartData]);

  const leaderboard = useMemo(() => {
    const userEntry = {
      name: userName,
      xp,
      streak: bestStreak,
      completions: totalCompletions,
      isUser: true,
    };

    const allEntries = [
      ...MOCK_HUNTERS.map((h) => ({ ...h, isUser: false })),
      userEntry,
    ];

    allEntries.sort((a, b) => b.xp - a.xp);

    return allEntries.map((entry, idx) => ({
      ...entry,
      position: idx + 1,
    }));
  }, [xp, userName, bestStreak, totalCompletions]);

  const userPosition = leaderboard.find((e) => e.isUser)?.position ?? 0;

  const tabs: { key: TabKey; label: string }[] = [
    { key: "global", label: "GLOBAL" },
    { key: "mystats", label: "MY STATS" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Hunter Profile - Embedded */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Name + Rank inline */}
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black"
            style={{
              color: rankInfo.color,
              borderBottom: `2px solid ${rankInfo.color}`,
            }}
          >
            {rankInfo.rank}
          </div>
          <div>
            <h2 className="font-mono text-lg font-bold text-white">
              {userName}
            </h2>
            <p
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: rankInfo.color }}
            >
              {rankInfo.label}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
          {[
            { label: "RANK", value: `#${userPosition}`, icon: Shield, color: "#00d4ff" },
            { label: "XP", value: xp.toLocaleString(), icon: Zap, color: "#7c3aed" },
            { label: "LEVEL", value: String(level), icon: Star, color: "#fbbf24" },
            { label: "STREAK", value: String(bestStreak), icon: Flame, color: "#ef4444" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5">
              <stat.icon className="h-3.5 w-3.5" style={{ color: stat.color }} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {stat.label}
              </span>
              <span className="font-mono text-sm font-black text-white">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="mt-5 h-px w-full" style={{ background: "linear-gradient(to right, transparent, rgba(100,116,139,0.2), transparent)" }} />
      </motion.div>

      {/* Consistency Graph */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="relative overflow-hidden rounded-xl p-5"
        style={{
          background: "rgba(15, 23, 42, 0.9)",
          border: "1px solid rgba(124, 58, 237, 0.3)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 0 20px rgba(124, 58, 237, 0.1)",
        }}
      >
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" style={{ color: "#7c3aed" }} />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: "#7c3aed", textShadow: "0 0 8px rgba(124,58,237,0.4)" }}
            >
              CONSISTENCY TRACKER
            </p>
          </div>
          <div className="flex gap-1.5">
            {(["weekly", "biweekly", "monthly", "yearly"] as ChartPeriod[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setChartPeriod(p)}
                className="rounded-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200"
                style={{
                  background: chartPeriod === p ? "rgba(124, 58, 237, 0.2)" : "rgba(15, 23, 42, 0.6)",
                  border: chartPeriod === p ? "1px solid rgba(124, 58, 237, 0.5)" : "1px solid rgba(100, 116, 139, 0.15)",
                  color: chartPeriod === p ? "#a78bfa" : "#64748b",
                  boxShadow: chartPeriod === p ? "0 0 10px rgba(124, 58, 237, 0.2)" : "none",
                }}
              >
                {p === "biweekly" ? "2W" : p === "weekly" ? "1W" : p === "monthly" ? "1M" : "1Y"}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="consistencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                interval="preserveStartEnd"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "monospace" }}
                domain={[0, 100]}
                tickFormatter={(v: number) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(10, 22, 40, 0.95)",
                  border: "1px solid rgba(124, 58, 237, 0.3)",
                  borderRadius: "8px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 0 15px rgba(124, 58, 237, 0.2)",
                }}
                labelStyle={{ color: "#a78bfa", fontFamily: "monospace", fontSize: 11, fontWeight: 700 }}
                itemStyle={{ color: "#e2e8f0", fontFamily: "monospace", fontSize: 11 }}
                formatter={(value: number) => [`${value}%`, "Completion"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#7c3aed"
                strokeWidth={2}
                fill="url(#consistencyGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "#7c3aed",
                  stroke: "#0f172a",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Trend indicator */}
        <div className="mt-3 flex items-center gap-2">
          {(() => {
            const first = chartData[0]?.rate ?? 0;
            const last = chartData[chartData.length - 1]?.rate ?? 0;
            const diff = last - first;
            const isUp = diff > 0;
            const avg = Math.round(chartData.reduce((s, p) => s + p.rate, 0) / chartData.length);
            return (
              <>
                <span
                  className="rounded px-1.5 py-0.5 font-mono text-[10px] font-bold"
                  style={{
                    color: isUp ? "#10b981" : "#ef4444",
                    backgroundColor: isUp ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${isUp ? "rgba(16,185,129,0.2)" : "rgba(239,68,68,0.2)"}`,
                  }}
                >
                  {isUp ? "+" : ""}{diff.toFixed(0)}%
                </span>
                <span className="font-mono text-[10px] text-gray-500">
                  AVG {avg}% completion
                </span>
              </>
            );
          })()}
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex gap-2"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className="rounded-lg px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.15em] transition-all duration-300"
            style={{
              background: activeTab === tab.key
                ? "rgba(0, 212, 255, 0.15)"
                : "rgba(15, 23, 42, 0.6)",
              border: activeTab === tab.key
                ? "1px solid rgba(0, 212, 255, 0.4)"
                : "1px solid rgba(100, 116, 139, 0.2)",
              color: activeTab === tab.key ? "#00d4ff" : "#64748b",
              boxShadow: activeTab === tab.key
                ? "0 0 15px rgba(0, 212, 255, 0.2)"
                : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* Global Leaderboard */}
      {activeTab === "global" && (
        <div className="space-y-2">
          {leaderboard.map((entry, idx) => {
            const posStyle = getPositionStyle(entry.position);
            const entryRank = getRankForXP(entry.xp);

            return (
              <motion.div
                key={entry.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative flex items-center gap-4 overflow-hidden rounded-xl px-4 py-3"
                style={{
                  background: entry.isUser
                    ? "rgba(0, 212, 255, 0.08)"
                    : "rgba(15, 23, 42, 0.7)",
                  border: entry.isUser
                    ? "1px solid rgba(0, 212, 255, 0.4)"
                    : "1px solid rgba(100, 116, 139, 0.1)",
                  backdropFilter: "blur(8px)",
                  boxShadow: entry.isUser
                    ? "0 0 20px rgba(0, 212, 255, 0.15)"
                    : "none",
                }}
              >
                {/* Position indicator glow for top 3 */}
                {entry.position <= 3 && (
                  <div
                    className="absolute left-0 top-0 h-full w-[3px]"
                    style={{
                      background: posStyle.color,
                      boxShadow: `0 0 10px ${posStyle.color}`,
                    }}
                  />
                )}

                {/* Position Number */}
                <div className="flex w-10 items-center justify-center">
                  {posStyle.icon ? (
                    <posStyle.icon
                      className="h-5 w-5"
                      style={{ color: posStyle.color, filter: `drop-shadow(0 0 4px ${posStyle.color})` }}
                    />
                  ) : (
                    <span
                      className="text-sm font-bold font-mono"
                      style={{
                        color: entry.isUser ? "#00d4ff" : "#64748b",
                      }}
                    >
                      #{entry.position}
                    </span>
                  )}
                </div>

                {/* Hunter Name */}
                <div className="flex-1">
                  <p
                    className="text-sm font-bold font-mono"
                    style={{
                      color: entry.isUser ? "#00d4ff" : "#e2e8f0",
                      textShadow: entry.isUser ? "0 0 8px rgba(0,212,255,0.4)" : "none",
                    }}
                  >
                    {entry.name}
                    {entry.isUser && (
                      <span className="ml-2 text-[9px] uppercase tracking-wider" style={{ color: "#7c3aed" }}>
                        (YOU)
                      </span>
                    )}
                  </p>
                </div>

                {/* Rank Badge */}
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg font-mono text-xs font-black"
                  style={{
                    background: `rgba(${entryRank.rank === "S" ? "239,68,68" : "0,212,255"}, 0.1)`,
                    border: `1px solid ${entryRank.color}`,
                    color: entryRank.color,
                    boxShadow: `0 0 8px ${entryRank.color}40`,
                  }}
                >
                  {entryRank.rank}
                </div>

                {/* XP */}
                <div className="hidden w-24 text-right sm:block">
                  <p className="text-xs font-bold text-white">
                    {entry.xp.toLocaleString()}
                    <span className="ml-1 text-[10px]" style={{ color: "#7c3aed" }}>XP</span>
                  </p>
                </div>

                {/* Streak */}
                <div className="hidden w-16 items-center gap-1 sm:flex">
                  <Flame className="h-3 w-3" style={{ color: "#ef4444" }} />
                  <span className="text-xs font-bold text-white">{entry.streak}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* My Stats Tab */}
      {activeTab === "mystats" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 sm:grid-cols-2"
        >
          {[
            { label: "TOTAL QUESTS CLEARED", value: String(totalCompletions), icon: Zap, accent: "#00d4ff" },
            { label: "BEST STREAK", value: `${bestStreak} days`, icon: Flame, accent: "#ef4444" },
            { label: "CURRENT RANK", value: rankInfo.label, icon: Shield, accent: rankInfo.color },
            { label: "TOTAL XP EARNED", value: xp.toLocaleString(), icon: Star, accent: "#7c3aed" },
            { label: "HUNTER LEVEL", value: `Level ${level}`, icon: Trophy, accent: "#fbbf24" },
            { label: "GLOBAL POSITION", value: `#${userPosition}`, icon: Crown, accent: "#00d4ff" },
          ].map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="relative overflow-hidden rounded-xl p-5"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: `1px solid ${stat.accent}25`,
                backdropFilter: "blur(12px)",
                boxShadow: `0 0 15px ${stat.accent}10`,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    background: `${stat.accent}12`,
                    border: `1px solid ${stat.accent}30`,
                  }}
                >
                  <stat.icon className="h-5 w-5" style={{ color: stat.accent }} />
                </div>
                <div>
                  <p
                    className="text-[10px] font-bold uppercase tracking-[0.15em]"
                    style={{ color: stat.accent, textShadow: `0 0 8px ${stat.accent}60` }}
                  >
                    {stat.label}
                  </p>
                  <p
                    className="text-2xl font-bold font-mono text-white"
                    style={{
                      textShadow: `0 0 10px ${stat.accent}30`,
                    }}
                  >
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
