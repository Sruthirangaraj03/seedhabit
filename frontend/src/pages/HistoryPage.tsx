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

/* ── single habit flashcard styled as cleared quest report ── */
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
      className="group flex h-full flex-col overflow-hidden rounded-xl border transition-all duration-300"
      style={{
        borderColor: "#00d4ff15",
        backgroundColor: "#0a0e1a",
        boxShadow: "0 0 15px #00d4ff08",
      }}
    >
      {/* Top color bar with glow */}
      <div
        className="h-1 w-full"
        style={{
          backgroundColor: habit.color,
          boxShadow: `0 2px 8px ${habit.color}40`,
        }}
      />

      <div className="flex flex-1 flex-col p-5">
        {/* Icon and status */}
        <div className="mb-4 flex items-start justify-between">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl border"
            style={{
              backgroundColor: `${habit.color}10`,
              borderColor: `${habit.color}20`,
              boxShadow: `0 0 12px ${habit.color}15`,
            }}
          >
            <Icon className="h-6 w-6" style={{ color: habit.color }} />
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" style={{ color: "#00d4ff" }} />
            <span
              className="text-[8px] font-black uppercase tracking-[0.2em]"
              style={{ color: "#00d4ff80", textShadow: "0 0 6px #00d4ff40" }}
            >
              Clear
            </span>
          </div>
        </div>

        {/* Name with cyan/gray strikethrough */}
        <h3
          className="text-base font-bold line-through decoration-1"
          style={{
            color: "#94a3b8",
            textDecorationColor: "#00d4ff40",
          }}
        >
          {habit.habit_name}
        </h3>

        {/* Category */}
        {habit.category ? (
          <span
            className="mt-1.5 inline-block w-fit rounded border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.15em]"
            style={{
              borderColor: "#7c3aed20",
              color: "#7c3aed80",
              backgroundColor: "#7c3aed08",
            }}
          >
            {habit.category}
          </span>
        ) : null}

        {/* Note */}
        {habit.note ? (
          <p
            className="mt-2 line-clamp-2 text-xs italic"
            style={{ color: "#00d4ff40" }}
          >
            {habit.note}
          </p>
        ) : null}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom */}
        <div
          className="mt-4 flex items-center justify-between border-t pt-3"
          style={{ borderColor: "#00d4ff10" }}
        >
          <span
            className="text-[9px] font-black uppercase tracking-[0.2em]"
            style={{ color: "#00d4ff40" }}
          >
            Completed
          </span>
          <div
            className="h-2.5 w-2.5 rounded-full"
            style={{
              backgroundColor: habit.color,
              boxShadow: `0 0 6px ${habit.color}60`,
            }}
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
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00d4ff" }} />
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "#00d4ff", textShadow: "0 0 10px #00d4ff80" }}
          >
            Retrieving Logs...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-xl border p-6 text-center"
        style={{
          borderColor: "#ff444430",
          backgroundColor: "#ff444408",
          boxShadow: "0 0 15px #ff444410",
        }}
      >
        <p className="text-sm font-medium" style={{ color: "#ff6b6b" }}>{error}</p>
      </div>
    );
  }

  const totalCount = history.reduce((sum, d) => sum + d.count, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-2xl font-black tracking-wider"
            style={{
              background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 12px #00d4ff40)",
            }}
          >
            QUEST LOG
          </h1>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em]"
            style={{ color: "#00d4ff40" }}
          >
            Cleared quests from the last 30 days
          </p>
        </div>
        <div
          className="flex items-center gap-2 rounded-full border px-3 py-1.5"
          style={{
            borderColor: "#00d4ff25",
            backgroundColor: "#00d4ff08",
            boxShadow: "0 0 12px #00d4ff10",
          }}
        >
          <Clock className="h-3.5 w-3.5" style={{ color: "#00d4ff" }} />
          <span
            className="text-xs font-black"
            style={{ color: "#00d4ff", textShadow: "0 0 6px #00d4ff60" }}
          >
            {totalCount} total
          </span>
        </div>
      </div>

      {history.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-16"
          style={{
            borderColor: "#00d4ff15",
            background: "linear-gradient(180deg, #00d4ff05 0%, transparent 100%)",
            boxShadow: "inset 0 0 30px #00d4ff05",
          }}
        >
          <div
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              backgroundColor: "#00d4ff10",
              boxShadow: "0 0 20px #00d4ff15",
            }}
          >
            <Calendar className="h-8 w-8" style={{ color: "#00d4ff" }} />
          </div>
          <h3
            className="mb-1 text-lg font-black uppercase tracking-wider"
            style={{ color: "#00d4ff", textShadow: "0 0 10px #00d4ff60" }}
          >
            No Logs Found
          </h3>
          <p className="text-sm text-gray-500">
            Complete some quests and they&apos;ll appear here.
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
                  className="flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-300"
                  style={{
                    borderColor: isExpanded ? "#00d4ff25" : "#00d4ff10",
                    backgroundColor: isExpanded ? "#00d4ff08" : "#0a0e1a80",
                    boxShadow: isExpanded ? "0 0 20px #00d4ff10" : "none",
                  }}
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      borderColor: "#00d4ff20",
                      backgroundColor: "#00d4ff08",
                    }}
                  >
                    <Calendar className="h-5 w-5" style={{ color: "#00d4ff" }} />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-200">
                      {formatDate(day.date)}
                    </h3>
                    <p
                      className="text-[10px] font-bold uppercase tracking-[0.15em]"
                      style={{ color: "#00d4ff40" }}
                    >
                      {day.count} {day.count === 1 ? "quest" : "quests"} cleared
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Habit color dots */}
                    <div className="hidden items-center gap-1 sm:flex">
                      {day.habits.slice(0, 5).map((h, i) => (
                        <div
                          key={`${h.habit_id}-${i}`}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: h.color,
                            boxShadow: `0 0 4px ${h.color}60`,
                          }}
                        />
                      ))}
                      {day.habits.length > 5 && (
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: "#00d4ff50" }}
                        >
                          +{day.habits.length - 5}
                        </span>
                      )}
                    </div>

                    <span
                      className="rounded-full border px-2.5 py-0.5 text-xs font-black"
                      style={{
                        borderColor: "#00d4ff25",
                        backgroundColor: "#00d4ff10",
                        color: "#00d4ff",
                        textShadow: "0 0 6px #00d4ff60",
                      }}
                    >
                      {day.count}
                    </span>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-4 w-4" style={{ color: "#00d4ff50" }} />
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
