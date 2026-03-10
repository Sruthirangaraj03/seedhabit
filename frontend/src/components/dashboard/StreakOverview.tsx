import { CheckCircle2, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QuestHabit {
  id: number;
  name: string;
  completed: boolean;
  streak: number;
}

interface CompletedQuestsProps {
  habits: QuestHabit[];
}

export function StreakOverview({ habits }: CompletedQuestsProps) {
  const completed = habits.filter((h) => h.completed);
  const total = habits.length;
  const progress = total > 0 ? (completed.length / total) * 100 : 0;

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
          <Trophy className="h-4 w-4" style={{ color: "#00d4ff" }} />
          <h3
            className="system-label text-sm font-bold uppercase tracking-[0.15em]"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 10px rgba(0,212,255,0.4)",
            }}
          >
            COMPLETED QUESTS
          </h3>
          {completed.length === total && total > 0 ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 rounded-full px-2 py-0.5"
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
              }}
            >
              <span
                className="text-[10px] font-bold"
                style={{
                  color: "#10b981",
                  textShadow: "0 0 8px rgba(16, 185, 129, 0.5)",
                }}
              >
                QUEST CLEAR
              </span>
            </motion.div>
          ) : null}
        </div>
        <span
          className="text-sm font-bold"
          style={{
            color: "#00d4ff",
            textShadow: "0 0 8px rgba(0,212,255,0.4)",
          }}
        >
          {completed.length}/{total}
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
            background: completed.length === total && total > 0
              ? "linear-gradient(to right, #10b981, #34d399)"
              : "linear-gradient(to right, #00d4ff, #7c3aed)",
            boxShadow: completed.length === total && total > 0
              ? "0 0 12px rgba(16, 185, 129, 0.6)"
              : "0 0 12px rgba(0, 212, 255, 0.6)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
        {completed.length === 0 ? (
          <p
            className="py-4 text-center text-sm"
            style={{
              color: "rgba(0, 212, 255, 0.4)",
            }}
          >
            No quests cleared yet. Get started!
          </p>
        ) : null}
        <AnimatePresence>
          {completed.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex w-full items-center gap-3 rounded-lg p-3"
              style={{
                background: "rgba(0, 212, 255, 0.05)",
                borderLeft: "2px solid rgba(0, 212, 255, 0.4)",
              }}
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" style={{ color: "#00d4ff", filter: "drop-shadow(0 0 4px rgba(0,212,255,0.5))" }} />
              <span className="flex-1 text-sm font-medium text-gray-500 line-through">
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
              <span
                className="text-[10px] font-bold"
                style={{
                  color: "#00d4ff",
                  textShadow: "0 0 8px rgba(0,212,255,0.5)",
                }}
              >
                +10 XP
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
