import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { useDashboard } from "../hooks/useDashboard";
import { useXPContext } from "../context/XPContext";
import { TodayChecklist } from "../components/dashboard/TodayChecklist";
import { StreakOverview } from "../components/dashboard/StreakOverview";
import { StatsCards } from "../components/dashboard/StatsCards";
import { CompletionChart } from "../components/dashboard/CompletionChart";
import { habitService } from "../services/habitService";

export function DashboardPage() {
  const { dashboard, weeklyData, isLoading, error, refresh } = useDashboard();
  const { addXP, removeXP } = useXPContext();

  const handleToggle = async (habitId: number) => {
    const habit = dashboard?.today.habits.find((h) => h.id === habitId);
    if (!habit) return;

    try {
      if (habit.completed) {
        await habitService.uncompleteHabit(habitId);
        removeXP(10);
      } else {
        await habitService.completeHabit(habitId);
        addXP(10);
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
          colors: ["#6366f1", "#a855f7", "#10b981"],
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
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <span className="text-sm text-gray-500">Loading your progress...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl border-red-500/20 p-6 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
        <button type="button" onClick={refresh} className="mt-2 text-sm text-primary-400 hover:underline">
          Try again
        </button>
      </div>
    );
  }

  if (!dashboard) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <StatsCards
        totalHabits={dashboard.stats.total_habits}
        activeHabits={dashboard.stats.active_habits}
        totalCompletions={dashboard.stats.total_completions}
        completionRate={dashboard.stats.overall_completion_rate}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <TodayChecklist
          habits={dashboard.today.habits}
          completedCount={dashboard.today.completed_count}
          totalCount={dashboard.today.total_count}
          onToggle={handleToggle}
        />
        <StreakOverview
          bestCurrent={dashboard.streaks.best_current}
          bestEver={dashboard.streaks.best_ever}
        />
      </div>

      {weeklyData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <CompletionChart data={weeklyData} />
        </motion.div>
      ) : null}
    </motion.div>
  );
}
