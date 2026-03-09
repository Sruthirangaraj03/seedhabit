import { Link } from "react-router-dom";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "../hooks/useHabits";
import { HabitCard } from "../components/habits/HabitCard";
import { Button } from "../components/ui/Button";

export function HabitsPage() {
  const { habits, isLoading, error, toggleComplete, deleteHabit, archiveHabit } = useHabits();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gradient text-2xl font-bold">My Habits</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link to="/habits/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Habit
          </Button>
        </Link>
      </div>

      {error ? (
        <div className="glass rounded-xl border-red-500/20 p-3 text-sm text-red-400">
          {error}
        </div>
      ) : null}

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-primary-500/20 py-16"
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <Sparkles className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-200">
            Start your journey
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Create your first habit and begin earning XP.
          </p>
          <Link to="/habits/new">
            <Button size="lg">
              <Plus className="h-4 w-4" />
              Create Habit
            </Button>
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggleComplete={() => toggleComplete(habit.id)}
                onDelete={() => deleteHabit(habit.id)}
                onArchive={() => archiveHabit(habit.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
