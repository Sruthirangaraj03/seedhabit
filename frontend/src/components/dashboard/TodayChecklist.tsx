import { Circle, Swords } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { TodayHabit } from "../../types/dashboard";

interface TodayChecklistProps {
  habits: TodayHabit[];
  completedCount: number;
  totalCount: number;
  onToggle: (id: number) => void;
}

export function TodayChecklist({ habits, completedCount, totalCount, onToggle }: TodayChecklistProps) {
  const pending = habits.filter((h) => !h.completed);
  const pendingCount = totalCount - completedCount;
  const progress = totalCount > 0 ? (pendingCount / totalCount) * 100 : 0;

  return (
    <div
      className="system-panel relative overflow-hidden rounded-xl p-6"
      style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(0, 212, 255, 0.15)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(0, 212, 255, 0.05)",
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords className="h-4 w-4" style={{ color: "#00d4ff" }} />
          <h3
            className="system-label text-sm font-bold uppercase tracking-[0.15em]"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 10px rgba(0,212,255,0.4)",
            }}
          >
            PENDING QUESTS
          </h3>
        </div>
        <span
          className="text-sm font-bold"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 8px rgba(0,212,255,0.4)",
          }}
        >
          {pendingCount}/{totalCount}
        </span>
      </div>

      {/* Progress Bar */}
      <div
        className="mb-5 h-2 overflow-hidden rounded-full"
        style={{
          background: "rgba(0, 212, 255, 0.08)",
          border: "1px solid rgba(0, 212, 255, 0.1)",
        }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(to right, #fbbf24, #f59e0b)",
            boxShadow: "0 0 12px rgba(251, 191, 36, 0.6)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
        {pending.length === 0 ? (
          <p
            className="py-4 text-center text-sm"
            style={{
              color: "rgba(0, 212, 255, 0.4)",
            }}
          >
            All quests cleared!
          </p>
        ) : null}
        <AnimatePresence>
          {pending.map((habit, i) => (
            <motion.button
              key={habit.id}
              type="button"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => onToggle(habit.id)}
              className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all duration-200"
              style={{
                background: "transparent",
                borderLeft: "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(0, 212, 255, 0.03)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Circle className="h-5 w-5 flex-shrink-0 text-gray-600" />
              <span className="flex-1 text-sm font-medium text-gray-200">
                {habit.name}
              </span>
              {habit.streak > 0 ? (
                <span
                  className="flex items-center gap-0.5 text-xs font-bold"
                  style={{ color: "#7c3aed", textShadow: "0 0 6px rgba(124,58,237,0.4)" }}
                >
                  {habit.streak}d
                </span>
              ) : null}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
