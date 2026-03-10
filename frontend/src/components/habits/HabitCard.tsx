import { useNavigate } from "react-router-dom";
import { Flame, ChevronRight, Trash2, Zap, Trophy, CalendarCheck } from "lucide-react";
import { useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Habit } from "../../types/habit";
import { HabitCheckbox } from "./HabitCheckbox";
import { useXPContext } from "../../context/XPContext";
import { useHunterStatsContext } from "../../context/HunterStatsContext";
import { cn } from "../../lib/utils";

interface HabitCardProps {
  habit: Habit;
  onToggleComplete: (habitId: number) => void;
  onDelete: (habitId: number) => void;
  onArchive?: (habitId: number) => void;
}

export function HabitCard({ habit, onToggleComplete, onDelete, onArchive }: HabitCardProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { addXP, removeXP } = useXPContext();
  const { addStats, removeStats } = useHunterStatsContext();

  const streakCount = habit.streak_info?.current_streak ?? 0;
  const longestStreak = habit.streak_info?.longest_streak ?? 0;
  const lastCompleted = habit.streak_info?.last_completed_at;

  const handleToggle = useCallback(() => {
    if (!habit.completed_today) {
      addXP(10);
      addStats(habit.category ?? "");
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#00d4ff", "#7c3aed", "#a855f7", "#00d4ff"],
        disableForReducedMotion: true,
      });
    } else {
      removeXP(10);
      removeStats(habit.category ?? "");
    }
    onToggleComplete(habit.id);
  }, [habit.completed_today, habit.id, habit.category, onToggleComplete, addXP, removeXP, addStats, removeStats]);

  const formatLastCompleted = (dateStr: string | null | undefined) => {
    if (!dateStr) return "Never";
    const d = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const diff = Math.floor((today.getTime() - date.getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300",
        habit.completed_today
          ? "backdrop-blur-md"
          : "glass glass-hover"
      )}
      style={{
        borderColor: habit.completed_today ? "#00d4ff30" : undefined,
        backgroundColor: habit.completed_today ? "#00d4ff08" : undefined,
        boxShadow: habit.completed_today
          ? "0 0 20px #00d4ff10, inset 0 0 20px #00d4ff05"
          : undefined,
      }}
    >
      {/* Color indicator */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{
          backgroundColor: habit.color,
          boxShadow: `0 0 12px ${habit.color}60, 0 0 24px ${habit.color}30`,
        }}
      />

      {/* Main row */}
      <div className="flex items-center gap-3 p-4 sm:gap-4">
        <HabitCheckbox
          checked={habit.completed_today ?? false}
          color={habit.color}
          onChange={handleToggle}
        />

        {/* Name + category */}
        <button
          type="button"
          className="flex min-w-0 flex-1 flex-col items-start text-left"
          onClick={() => navigate(`/habits/${habit.id}`)}
        >
          <span
            className={cn(
              "text-sm font-bold tracking-wide transition-all",
              habit.completed_today ? "line-through" : "text-gray-200"
            )}
            style={
              habit.completed_today
                ? { color: "#00d4ff80", textDecorationColor: "#00d4ff40" }
                : undefined
            }
          >
            {habit.name}
          </span>
          <div className="mt-0.5 flex items-center gap-1.5">
            {habit.frequency === "weekly" ? (
              <span
                className="rounded px-1 py-px text-[9px] font-black uppercase tracking-wider"
                style={{ color: "#fbbf24", backgroundColor: "#fbbf2412", border: "1px solid #fbbf2420" }}
              >
                Weekly
              </span>
            ) : null}
            {habit.category ? (
              <span
                className="text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{ color: "#00d4ff50" }}
              >
                {habit.category}
              </span>
            ) : null}
          </div>
        </button>

        {/* XP badge on completion */}
        {habit.completed_today ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 rounded-full border px-2 py-0.5"
            style={{
              borderColor: "#00d4ff30",
              backgroundColor: "#00d4ff10",
              boxShadow: "0 0 10px #00d4ff20",
            }}
          >
            <Zap className="h-3 w-3" style={{ color: "#00d4ff" }} />
            <span
              className="text-[10px] font-black"
              style={{ color: "#00d4ff", textShadow: "0 0 8px #00d4ff80" }}
            >
              +10 XP
            </span>
          </motion.div>
        ) : null}

        {/* Streak badge */}
        {streakCount > 0 ? (
          <div
            className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-black uppercase tracking-wider"
            style={
              streakCount >= 7
                ? {
                    borderColor: "#fbbf2440",
                    backgroundColor: "#fbbf2410",
                    color: "#fbbf24",
                    textShadow: "0 0 8px #fbbf2480",
                  }
                : {
                    borderColor: "#7c3aed30",
                    backgroundColor: "#7c3aed10",
                    color: "#a78bfa",
                  }
            }
          >
            <Flame className="h-3 w-3" />
            <span className="text-[10px]">PWR {streakCount}</span>
          </div>
        ) : null}

        {/* Delete + Expand toggle */}
        <div className="flex items-center">
          <button
            type="button"
            className="rounded-lg p-1.5 opacity-0 transition-all duration-200 hover:bg-red-500/10 group-hover:opacity-100"
            style={{ color: "#ff6b6b" }}
            onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="rounded-lg p-1.5 transition-all hover:bg-[#00d4ff10]"
            style={{ color: "#00d4ff40" }}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            <motion.div
              animate={{ rotate: expanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>
        </div>
      </div>

      {/* Expandable panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-3" style={{ borderTop: "1px solid #00d4ff15" }}>
              {/* Quest Details label */}
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: "#00d4ff60" }}>
                Quest Details
              </p>

              {/* Streak stats */}
              <div className="mb-3 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "#00d4ff15", backgroundColor: "#00d4ff05" }}>
                  <Flame className="h-3.5 w-3.5" style={{ color: "#fbbf24" }} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#00d4ff50" }}>Current</p>
                    <p className="text-sm font-bold text-white">{streakCount} {streakCount === 1 ? "day" : "days"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "#7c3aed20", backgroundColor: "#7c3aed08" }}>
                  <Trophy className="h-3.5 w-3.5" style={{ color: "#7c3aed" }} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#7c3aed60" }}>Record</p>
                    <p className="text-sm font-bold text-white">{longestStreak} {longestStreak === 1 ? "day" : "days"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "#00d4ff15", backgroundColor: "#00d4ff05" }}>
                  <CalendarCheck className="h-3.5 w-3.5" style={{ color: "#00d4ff" }} />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em]" style={{ color: "#00d4ff50" }}>Last Clear</p>
                    <p className="text-sm font-bold text-white">{formatLastCompleted(lastCompleted)}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {createPortal(
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              onClick={() => setShowDeleteConfirm(false)}
            >
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.15 }}
                className="relative w-full max-w-sm rounded-xl border p-5"
                style={{
                  background: "rgba(10, 22, 40, 0.95)",
                  borderColor: "rgba(239, 68, 68, 0.2)",
                  backdropFilter: "blur(20px)",
                  boxShadow: "0 0 30px rgba(239, 68, 68, 0.1)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-1 flex items-center gap-2">
                  <Trash2 className="h-4 w-4 text-red-400" />
                  <h3
                    className="font-display text-sm font-black uppercase tracking-[0.15em]"
                    style={{ color: "#ff6b6b", textShadow: "0 0 8px rgba(239,68,68,0.4)" }}
                  >
                    Delete Quest
                  </h3>
                </div>
                <p className="mb-5 text-sm text-gray-400">
                  Are you sure you want to delete <span className="font-bold text-gray-200">{habit.name}</span>? This cannot be undone.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex-1 rounded-lg border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-[#00d4ff]/5"
                    style={{ borderColor: "#00d4ff20", color: "#00d4ff" }}
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-lg border px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider transition-all hover:bg-red-500/15"
                    style={{ borderColor: "#ff444440", color: "#ff6b6b", backgroundColor: "rgba(239,68,68,0.05)" }}
                    onClick={() => { onDelete(habit.id); setShowDeleteConfirm(false); }}
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </motion.div>
  );
}
