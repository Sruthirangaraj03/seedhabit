import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useDashboard } from "../hooks/useDashboard";
import { useXPContext } from "../context/XPContext";
import { useHunterStatsContext } from "../context/HunterStatsContext";
import { TodayChecklist } from "../components/dashboard/TodayChecklist";
import { StreakOverview } from "../components/dashboard/StreakOverview";
import { StatsCards } from "../components/dashboard/StatsCards";
import { CompletionChart } from "../components/dashboard/CompletionChart";
import { ShadowArmy } from "../components/dashboard/ShadowArmy";
import { HunterStatsPanel } from "../components/dashboard/HunterStats";
import { ScrollReveal } from "../components/ui/ScrollReveal";
import { habitService } from "../services/habitService";

export function DashboardPage() {
  const { dashboard, weeklyData, isLoading, error, refresh } = useDashboard();
  const { addXP, removeXP } = useXPContext();
  const { hunterStats, totalPower, addStats, removeStats } = useHunterStatsContext();

  const handleToggle = async (habitId: number) => {
    const habit = dashboard?.today.habits.find((h) => h.id === habitId);
    if (!habit) return;

    try {
      if (habit.completed) {
        await habitService.uncompleteHabit(habitId);
        removeXP(10);
        removeStats("");
      } else {
        await habitService.completeHabit(habitId);
        addXP(10);
        addStats("");
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#00d4ff", "#7c3aed", "#00ffcc", "#a78bfa"],
          disableForReducedMotion: true,
        });
      }
      await refresh();
    } catch {
      // Error handled by hook
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00d4ff" }} />
          <span className="font-mono text-sm" style={{ color: "#00d4ff", textShadow: "0 0 10px rgba(0,212,255,0.5)" }}>
            INITIALIZING SYSTEM...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl p-6 text-center"
        style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <p className="font-mono text-sm font-medium text-red-400">[SYSTEM ERROR] {error}</p>
        <button
          type="button"
          onClick={refresh}
          className="mt-2 font-mono text-sm hover:underline"
          style={{ color: "#00d4ff" }}
        >
          RETRY CONNECTION
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  const shadowHabits = dashboard.today.habits.map((h) => ({
    id: h.id,
    name: h.name,
    completed: h.completed,
    color: h.color ?? "#00d4ff",
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* System Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2
          className="font-display text-xs font-bold uppercase tracking-[0.3em]"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.2)",
          }}
        >
          HUNTER STATUS
        </h2>
      </motion.div>

      <StatsCards
        totalHabits={dashboard.today.total_count}
        activeHabits={dashboard.stats.active_habits}
        totalCompletions={dashboard.stats.total_completions}
        completionRate={dashboard.stats.overall_completion_rate}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <StreakOverview
          habits={dashboard.today.habits.map((h) => ({
            id: h.id,
            name: h.name,
            completed: h.completed,
            streak: h.streak,
          }))}
        />
        <TodayChecklist
          habits={dashboard.today.habits}
          completedCount={dashboard.today.completed_count}
          totalCount={dashboard.today.total_count}
          onToggle={handleToggle}
        />
      </div>

      {/* Shadow Army */}
      <ScrollReveal>
        <ShadowArmy habits={shadowHabits} />
      </ScrollReveal>

      {/* Hunter Stats + Weekly Chart */}
      <div className="grid items-stretch gap-6 lg:grid-cols-2">
        <ScrollReveal delay={0.1} className="flex">
          <HunterStatsPanel stats={hunterStats} totalPower={totalPower} />
        </ScrollReveal>

        {weeklyData.length > 0 ? (
          <ScrollReveal delay={0.2} className="flex">
            <CompletionChart data={weeklyData} />
          </ScrollReveal>
        ) : null}
      </div>
    </motion.div>
  );
}
