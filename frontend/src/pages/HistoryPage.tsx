import { useState, useEffect } from "react";
import { Loader2, Calendar, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { dashboardService, type HistoryDayItem, type HistoryHabitItem } from "../services/dashboardService";
import { getHabitIcon } from "../components/habits/IconPicker";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const dateObj = new Date(d);
  dateObj.setHours(0, 0, 0, 0);

  if (dateObj.getTime() === today.getTime()) return "Today";
  if (dateObj.getTime() === yesterday.getTime()) return "Yesterday";

  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

/* ── single habit flashcard (matches HabitCard style) ── */
function HabitFlashcard({ habit, index }: { habit: HistoryHabitItem; index: number }) {
  const Icon = getHabitIcon(habit.icon);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-transparent glass hover:border-primary-500/15 transition-all duration-300"
    >
      {/* Top color bar */}
      <div className="h-1 w-full" style={{ backgroundColor: habit.color }} />

      <div className="flex flex-1 flex-col p-5">
        {/* Icon */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${habit.color}15` }}
          >
            <Icon className="h-6 w-6" style={{ color: habit.color }} />
          </div>
          <CheckCircle2 className="h-5 w-5 text-primary-400" />
        </div>

        {/* Name */}
        <h3 className="text-base font-bold text-gray-200 line-through decoration-gray-600/40 decoration-1">
          {habit.habit_name}
        </h3>

        {/* Category */}
        {habit.category ? (
          <span className="mt-1.5 inline-block w-fit rounded-full bg-surface-300/50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
            {habit.category}
          </span>
        ) : null}

        {/* Note */}
        {habit.note ? (
          <p className="mt-2 line-clamp-2 text-xs text-gray-500 italic">
            {habit.note}
          </p>
        ) : null}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-between border-t border-primary-500/10 pt-3">
          <span className="text-[11px] font-medium text-gray-500">Completed</span>
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: habit.color }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export function HistoryPage() {
  const [history, setHistory] = useState<HistoryDayItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getHistory(30)
      .then(({ data }) => {
        setHistory(data.days);
      })
      .catch(() => setError("Failed to load history"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          <span className="text-sm text-gray-500">Loading history...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-xl border-red-500/20 p-6 text-center">
        <p className="text-sm font-medium text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gradient text-2xl font-bold">History</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Your completed quests from the last 30 days
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/5 px-3 py-1.5">
          <Clock className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-xs font-bold text-primary-400">
            {history.reduce((sum, d) => sum + d.count, 0)} total
          </span>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-xl py-16">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-500/10">
            <Calendar className="h-8 w-8 text-primary-400" />
          </div>
          <h3 className="mb-1 text-lg font-bold text-gray-200">No history yet</h3>
          <p className="text-sm text-gray-500">
            Complete some habits and they&apos;ll appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((day, dayIdx) => {
            const isExpanded = expandedDay === day.date;

            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dayIdx * 0.05, duration: 0.4 }}
              >
                {/* Day header — clickable accordion */}
                <button
                  type="button"
                  onClick={() => setExpandedDay(isExpanded ? null : day.date)}
                  className="glass flex w-full items-center gap-4 rounded-2xl p-4 text-left transition-all duration-300 hover:border-primary-500/15"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-500/10">
                    <Calendar className="h-5 w-5 text-primary-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-200">
                      {formatDate(day.date)}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {day.count} {day.count === 1 ? "habit" : "habits"} completed
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Habit color dots */}
                    <div className="hidden items-center gap-1 sm:flex">
                      {day.habits.slice(0, 5).map((h, i) => (
                        <div
                          key={`${h.habit_id}-${i}`}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: h.color }}
                        />
                      ))}
                      {day.habits.length > 5 && (
                        <span className="text-[10px] font-semibold text-gray-500">
                          +{day.habits.length - 5}
                        </span>
                      )}
                    </div>

                    <span className="rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-bold text-primary-400">
                      {day.count}
                    </span>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    </motion.div>
                  </div>
                </button>

                {/* Expanded flashcard grid */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {day.habits.map((habit, i) => (
                          <HabitFlashcard
                            key={`${habit.habit_id}-${i}`}
                            habit={habit}
                            index={i}
                          />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
