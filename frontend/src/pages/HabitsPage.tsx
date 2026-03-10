import { useState } from "react";
import { createPortal } from "react-dom";

import { Plus, Loader2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHabits } from "../hooks/useHabits";
import { HabitCard } from "../components/habits/HabitCard";
import { HabitForm } from "../components/habits/HabitForm";
import { habitService } from "../services/habitService";
import { Button } from "../components/ui/Button";
import type { HabitCreate } from "../types/habit";

export function HabitsPage() {
  const { habits, isLoading, error, toggleComplete, deleteHabit, archiveHabit, fetchHabits } = useHabits();
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (data: HabitCreate) => {
    setIsSubmitting(true);
    try {
      await habitService.createHabit(data);
      setShowModal(false);
      fetchHabits();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#00d4ff" }} />
          <span
            className="text-xs font-bold uppercase tracking-[0.3em]"
            style={{ color: "#00d4ff", textShadow: "0 0 10px #00d4ff80" }}
          >
            Loading Quests...
          </span>
        </div>
      </div>
    );
  }

  const now = new Date();
  const dayOfYear = Math.floor(
    (Date.now() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  const daysInYear = isLeap(now.getFullYear()) ? 366 : 365;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="text-2xl font-black tracking-wider"
              style={{
                background: "linear-gradient(135deg, #00d4ff, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 0 12px #00d4ff40)",
              }}
            >
              DAILY QUESTS
            </h1>
            <span
              className="rounded border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{
                color: "#00d4ff",
                borderColor: "#00d4ff30",
                backgroundColor: "#00d4ff08",
                textShadow: "0 0 6px #00d4ff60",
              }}
            >
              {dayOfYear}/{daysInYear}
            </span>
          </div>
          <p className="mt-1 text-xs font-medium uppercase tracking-widest text-gray-500">
            {(() => {
              const today = new Date();
              const dayIdx = today.getDay();
              const mon = new Date(today);
              mon.setDate(today.getDate() - ((dayIdx + 6) % 7));
              const sun = new Date(mon);
              sun.setDate(mon.getDate() + 6);
              const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
              return `${fmt(mon)} — ${fmt(sun)}`;
            })()}
          </p>
        </div>
        <Button
          onClick={() => setShowModal(true)}
          className="relative overflow-hidden border font-bold uppercase tracking-wider"
          style={{
            borderColor: "#00d4ff40",
            background: "linear-gradient(135deg, #00d4ff15, #7c3aed10)",
            color: "#00d4ff",
            textShadow: "0 0 8px #00d4ff60",
            boxShadow: "0 0 15px #00d4ff20, inset 0 0 15px #00d4ff08",
          }}
        >
          <Plus className="h-4 w-4" />
          New Quest
        </Button>
      </div>

      {error ? (
        <div
          className="rounded-xl border p-3 text-sm font-medium"
          style={{
            borderColor: "#ff444430",
            backgroundColor: "#ff444408",
            color: "#ff6b6b",
            boxShadow: "0 0 10px #ff444415",
          }}
        >
          {error}
        </div>
      ) : null}

      {habits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-16"
          style={{
            borderColor: "#00d4ff20",
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
            <Sparkles className="h-8 w-8" style={{ color: "#00d4ff" }} />
          </div>
          <h3
            className="mb-1 text-lg font-black uppercase tracking-wider"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 10px #00d4ff60",
            }}
          >
            No Quests Registered
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            Register your first quest to begin the hunt.
          </p>
          <Button
            size="lg"
            onClick={() => setShowModal(true)}
            className="border font-bold uppercase tracking-wider"
            style={{
              borderColor: "#00d4ff40",
              background: "linear-gradient(135deg, #00d4ff20, #7c3aed15)",
              color: "#00d4ff",
              textShadow: "0 0 8px #00d4ff60",
              boxShadow: "0 0 20px #00d4ff20",
            }}
          >
            <Plus className="h-4 w-4" />
            Register Quest
          </Button>
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
      {/* New Quest Modal */}
      {createPortal(
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6"
              onClick={() => setShowModal(false)}
            >
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative w-full max-w-2xl overflow-y-auto rounded-xl border p-4 sm:p-6"
                style={{
                  maxHeight: "85vh",
                  background: "rgba(10, 22, 40, 0.95)",
                  borderColor: "rgba(0, 212, 255, 0.2)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 40px rgba(0, 212, 255, 0.1), 0 0 80px rgba(124, 58, 237, 0.05)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="mb-4 flex items-center justify-between sm:mb-5">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9"
                      style={{ backgroundColor: "#00d4ff10", boxShadow: "0 0 12px #00d4ff15" }}
                    >
                      <Sparkles className="h-4 w-4" style={{ color: "#00d4ff" }} />
                    </div>
                    <h2
                      className="font-display text-xs font-black uppercase tracking-[0.15em] sm:text-sm sm:tracking-[0.2em]"
                      style={{ color: "#00d4ff", textShadow: "0 0 10px #00d4ff60" }}
                    >
                      Register New Quest
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-lg p-1.5 transition-colors hover:bg-[#00d4ff]/10"
                    style={{ color: "#00d4ff40" }}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <HabitForm onSubmit={handleCreate} isLoading={isSubmitting} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
