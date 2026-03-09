import { CheckCircle2, Circle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TodayHabit } from "../../types/dashboard";
import { cn } from "../../lib/utils";

interface TodayChecklistProps {
  habits: TodayHabit[];
  completedCount: number;
  totalCount: number;
  onToggle: (id: number) => void;
}

export function TodayChecklist({ habits, completedCount, totalCount, onToggle }: TodayChecklistProps) {
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const allDone = completedCount === totalCount && totalCount > 0;

  return (
    <div className="glass rounded-xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Today's Quests</h3>
          {allDone ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 rounded-full bg-neon-green/10 px-2 py-0.5"
            >
              <Sparkles className="h-3 w-3 text-neon-green" />
              <span className="text-[10px] font-bold text-neon-green">ALL DONE</span>
            </motion.div>
          ) : null}
        </div>
        <span className="text-sm font-bold text-primary-400">
          {completedCount}/{totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-5 h-2 overflow-hidden rounded-full bg-surface-600">
        <motion.div
          className={cn(
            "h-full rounded-full transition-colors duration-500",
            allDone
              ? "bg-gradient-to-r from-neon-green to-emerald-400"
              : "bg-gradient-to-r from-primary-500 to-neon-purple"
          )}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="space-y-1">
        {habits.length === 0 ? (
          <p className="py-4 text-center text-sm text-gray-500">
            No active habits yet. Create one to start your journey.
          </p>
        ) : null}
        <AnimatePresence>
          {habits.map((habit, i) => (
            <motion.button
              key={habit.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onToggle(habit.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200",
                habit.completed
                  ? "bg-neon-green/5"
                  : "hover:bg-primary-500/5"
              )}
            >
              <motion.div
                animate={habit.completed ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {habit.completed ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-neon-green" />
                ) : (
                  <Circle className="h-5 w-5 flex-shrink-0 text-gray-600" />
                )}
              </motion.div>
              <span
                className={cn(
                  "flex-1 text-sm font-medium transition-all",
                  habit.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-200"
                )}
              >
                {habit.name}
              </span>
              {habit.streak > 0 ? (
                <span className="flex items-center gap-0.5 text-xs font-bold text-amber-400">
                  {habit.streak}d
                </span>
              ) : null}
              {habit.completed ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-[10px] font-bold text-neon-green"
                >
                  +10 XP
                </motion.span>
              ) : null}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
