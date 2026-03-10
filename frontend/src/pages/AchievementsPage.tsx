import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Sword,
  Shield,
  Flame,
  Trophy,
  Star,
  Crown,
  Zap,
  Target,
  BookOpen,
  Skull,
  Heart,
  Award,
  Lock,
  Filter,
} from "lucide-react";
import { useAchievements, type Achievement } from "../hooks/useAchievements";
import { useXPContext } from "../context/XPContext";
import { dashboardService } from "../services/dashboardService";
import { habitService } from "../services/habitService";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Sword,
  Shield,
  Flame,
  Trophy,
  Star,
  Crown,
  Zap,
  Target,
  BookOpen,
  Skull,
  Heart,
  Award,
};

const RARITY_COLORS: Record<string, { border: string; glow: string; badge: string; text: string }> = {
  common: {
    border: "rgba(107, 114, 128, 0.4)",
    glow: "rgba(107, 114, 128, 0.2)",
    badge: "#6b7280",
    text: "#9ca3af",
  },
  rare: {
    border: "rgba(0, 212, 255, 0.4)",
    glow: "rgba(0, 212, 255, 0.2)",
    badge: "#00d4ff",
    text: "#00d4ff",
  },
  epic: {
    border: "rgba(124, 58, 237, 0.4)",
    glow: "rgba(124, 58, 237, 0.2)",
    badge: "#7c3aed",
    text: "#a78bfa",
  },
  legendary: {
    border: "rgba(251, 191, 36, 0.4)",
    glow: "rgba(251, 191, 36, 0.25)",
    badge: "#fbbf24",
    text: "#fbbf24",
  },
};

type FilterCategory = "all" | "quest" | "power" | "rank" | "legendary";

const FILTER_TABS: { key: FilterCategory; label: string }[] = [
  { key: "all", label: "ALL" },
  { key: "quest", label: "QUEST" },
  { key: "power", label: "POWER" },
  { key: "rank", label: "RANK" },
  { key: "legendary", label: "LEGENDARY" },
];

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const IconComponent = ICON_MAP[achievement.icon] || Award;
  const rarity = RARITY_COLORS[achievement.rarity];
  const isUnlocked = achievement.unlocked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative group cursor-default"
    >
      <div
        className="relative rounded-xl p-5 h-full transition-all duration-300"
        style={{
          background: isUnlocked
            ? "rgba(15, 23, 42, 0.85)"
            : "rgba(15, 23, 42, 0.6)",
          border: `1px solid ${isUnlocked ? rarity.border : "rgba(75, 85, 99, 0.2)"}`,
          backdropFilter: "blur(12px)",
          boxShadow: isUnlocked
            ? `0 0 20px ${rarity.glow}, inset 0 1px 0 rgba(255,255,255,0.05)`
            : "none",
          opacity: isUnlocked ? 1 : 0.7,
        }}
      >
        {/* Glow effect on hover for unlocked */}
        {isUnlocked && (
          <div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              boxShadow: `0 0 30px ${rarity.glow}, 0 0 60px ${rarity.glow}`,
            }}
          />
        )}

        {/* Rarity badge */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full"
            style={{
              color: isUnlocked ? rarity.badge : "#4b5563",
              background: isUnlocked
                ? `${rarity.badge}15`
                : "rgba(75, 85, 99, 0.1)",
              border: `1px solid ${isUnlocked ? `${rarity.badge}30` : "rgba(75, 85, 99, 0.2)"}`,
            }}
          >
            {achievement.rarity}
          </span>

          {isUnlocked ? (
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold"
              style={{ color: "#10b981", background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
            >
              UNLOCKED
            </span>
          ) : (
            <span
              className="flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[9px] font-bold"
              style={{ color: "#f59e0b", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}
            >
              LOCKED
            </span>
          )}
        </div>

        {/* Icon */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="relative w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: isUnlocked
                ? `linear-gradient(135deg, ${rarity.badge}20, ${rarity.badge}08)`
                : "rgba(245, 158, 11, 0.08)",
              border: `1px solid ${isUnlocked ? `${rarity.badge}30` : "rgba(245, 158, 11, 0.15)"}`,
            }}
          >
            {isUnlocked ? (
              <IconComponent
                className="w-5 h-5"
                style={{ color: rarity.badge }}
              />
            ) : (
              <Lock className="w-4 h-4" style={{ color: "#f59e0b", filter: "drop-shadow(0 0 4px rgba(245,158,11,0.4))" }} />
            )}
          </div>

          <div className="min-w-0">
            <h3
              className="text-sm font-bold tracking-wide truncate font-mono"
              style={{
                color: isUnlocked ? "#f1f5f9" : "#9ca3af",
              }}
            >
              {achievement.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-xs leading-relaxed mb-2 font-mono"
          style={{ color: isUnlocked ? "#94a3b8" : "#6b7280" }}
        >
          {achievement.description}
        </p>

        {/* Condition */}
        <p
          className="text-[11px] font-mono"
          style={{ color: isUnlocked ? rarity.text : "#f59e0b80" }}
        >
          {achievement.condition}
        </p>
      </div>
    </motion.div>
  );
}

export function AchievementsPage() {
  const { achievements, checkAchievements, unlockedCount, totalCount } = useAchievements();
  const { xp, rankInfo } = useXPContext();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");

  // Check achievements with real data on mount
  const fetchAndCheck = useCallback(async () => {
    try {
      const [dashRes, habitsRes] = await Promise.all([
        dashboardService.getDashboard(),
        habitService.getHabits(),
      ]);
      const dash = dashRes.data;
      const habits = habitsRes.data;
      const bestStreak = dash.streaks.best_current?.streak ?? 0;
      const bestEver = dash.streaks.best_ever?.streak ?? 0;
      const allComplete = dash.today.completed_count === dash.today.total_count && dash.today.total_count > 0;

      checkAchievements({
        totalCompletions: dash.stats.total_completions,
        bestStreak: Math.max(bestStreak, bestEver),
        totalHabits: habits.length,
        allDailyComplete: allComplete,
        xp,
        totalDaysLoggedIn: 0,
      });
    } catch {
      // Fallback with just XP
      checkAchievements({
        totalCompletions: 0,
        bestStreak: 0,
        totalHabits: 0,
        allDailyComplete: false,
        xp,
        totalDaysLoggedIn: 0,
      });
    }
  }, [checkAchievements, xp]);

  useEffect(() => {
    fetchAndCheck();
  }, [fetchAndCheck]);

  const filteredAchievements = achievements.filter((a) => {
    if (activeFilter === "all") return true;
    return a.category === activeFilter;
  });

  // Sort: increasing rarity (common → rare → epic → legendary), unlocked first within each
  const rarityOrder: Record<string, number> = { common: 1, rare: 2, epic: 3, legendary: 4 };
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    const ra = rarityOrder[a.rarity] || 0;
    const rb = rarityOrder[b.rarity] || 0;
    if (ra !== rb) return ra - rb;
    if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
    return 0;
  });

  const rarityBreakdown = {
    common: achievements.filter((a) => a.rarity === "common" && a.unlocked).length,
    commonTotal: achievements.filter((a) => a.rarity === "common").length,
    rare: achievements.filter((a) => a.rarity === "rare" && a.unlocked).length,
    rareTotal: achievements.filter((a) => a.rarity === "rare").length,
    epic: achievements.filter((a) => a.rarity === "epic" && a.unlocked).length,
    epicTotal: achievements.filter((a) => a.rarity === "epic").length,
    legendary: achievements.filter((a) => a.rarity === "legendary" && a.unlocked).length,
    legendaryTotal: achievements.filter((a) => a.rarity === "legendary").length,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Trophy className="w-6 h-6" style={{ color: "#fbbf24" }} />
            <h1
              className="text-2xl font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 12px #00d4ff40)",
              }}
            >
              ACHIEVEMENT VAULT
            </h1>
          </div>
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "#64748b" }}
          >
            Hunter Title Collection
          </p>
        </div>

        {/* Current Level */}
        <div
          className="flex items-center gap-3 rounded-xl border px-4 py-3"
          style={{
            borderColor: `${rankInfo.color}30`,
            background: `${rankInfo.color}08`,
            boxShadow: `0 0 20px ${rankInfo.glowColor}`,
          }}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg font-mono text-lg font-black"
            style={{
              color: rankInfo.color,
              background: `${rankInfo.color}15`,
              border: `1px solid ${rankInfo.color}30`,
              textShadow: `0 0 10px ${rankInfo.glowColor}`,
            }}
          >
            {rankInfo.rank[0]}
          </div>
          <div>
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">Current Rank</p>
            <p
              className="font-mono text-sm font-black"
              style={{ color: rankInfo.color, textShadow: `0 0 8px ${rankInfo.glowColor}` }}
            >
              {rankInfo.rank}
            </p>
            <p className="font-mono text-[10px] text-gray-500">{xp.toLocaleString()} XP</p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(0, 212, 255, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Unlocked count */}
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-black"
              style={{
  
                color: "#00d4ff",
                textShadow: "0 0 10px rgba(0, 212, 255, 0.4)",
              }}
            >
              {unlockedCount}
            </span>
            <span className="text-sm text-gray-400">
              / {totalCount} Unlocked
            </span>
          </div>

          {/* Rarity breakdown */}
          <div className="flex items-center gap-4 text-xs">
            <span style={{ color: "#9ca3af" }}>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#6b7280" }} />
              {rarityBreakdown.common}/{rarityBreakdown.commonTotal}
            </span>
            <span style={{ color: "#00d4ff" }}>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#00d4ff" }} />
              {rarityBreakdown.rare}/{rarityBreakdown.rareTotal}
            </span>
            <span style={{ color: "#a78bfa" }}>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#7c3aed" }} />
              {rarityBreakdown.epic}/{rarityBreakdown.epicTotal}
            </span>
            <span style={{ color: "#fbbf24" }}>
              <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: "#fbbf24" }} />
              {rarityBreakdown.legendary}/{rarityBreakdown.legendaryTotal}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(30, 41, 59, 0.8)" }}>
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
              boxShadow: "0 0 8px rgba(0, 212, 255, 0.4)",
            }}
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 mr-2 flex-shrink-0" style={{ color: "#64748b" }} />
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveFilter(tab.key)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider transition-all duration-200 whitespace-nowrap"
            style={{

              background:
                activeFilter === tab.key
                  ? "rgba(0, 212, 255, 0.12)"
                  : "transparent",
              color:
                activeFilter === tab.key ? "#00d4ff" : "#64748b",
              border: `1px solid ${
                activeFilter === tab.key
                  ? "rgba(0, 212, 255, 0.3)"
                  : "transparent"
              }`,
              textShadow:
                activeFilter === tab.key
                  ? "0 0 8px rgba(0, 212, 255, 0.4)"
                  : "none",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedAchievements.map((achievement, index) => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            index={index}
          />
        ))}
      </div>

      {sortedAchievements.length === 0 && (
        <div
          className="rounded-xl p-8 text-center"
          style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(55, 65, 81, 0.3)",
          }}
        >
          <p className="text-sm text-gray-500">No achievements in this category.</p>
        </div>
      )}
    </motion.div>
  );
}
