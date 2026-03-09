import { useNavigate } from "react-router-dom";
import { Flame, ChevronRight, Archive, Trash2, Zap, Trophy, CalendarCheck } from "lucide-react";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import type { Habit } from "../../types/habit";
import { HabitCheckbox } from "./HabitCheckbox";
import { useXPContext } from "../../context/XPContext";
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
  const { addXP, removeXP } = useXPContext();

  const streakCount = habit.streak_info?.current_streak ?? 0;
  const longestStreak = habit.streak_info?.longest_streak ?? 0;
  const lastCompleted = habit.streak_info?.last_completed_at;

  const handleToggle = useCallback(() => {
    if (!habit.completed_today) {
      addXP(10);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: [habit.color, "#6366f1", "#a855f7", "#10b981"],
        disableForReducedMotion: true,
      });
    } else {
      removeXP(10);
    }
    onToggleComplete(habit.id);
  }, [habit.completed_today, habit.id, habit.color, onToggleComplete, addXP, removeXP]);

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
          ? "border-neon-green/20 bg-neon-green/5 backdrop-blur-md"
          : "glass glass-hover"
      )}
    >
      {/* Color indicator with glow */}
      <div
        className="absolute left-0 top-0 h-full w-1 rounded-l-xl"
        style={{
          backgroundColor: habit.color,
          boxShadow: `0 0 8px ${habit.color}40`,
        }}
      />

      {/* Main row */}
      <div className="flex items-center gap-4 p-4">
        <HabitCheckbox
          checked={habit.completed_today ?? false}
          color={habit.color}
          onChange={handleToggle}
        />

        <button
          type="button"
          className="flex min-w-0 flex-1 flex-col items-start text-left"
          onClick={() => navigate(`/habits/${habit.id}`)}
        >
          <span className={cn(
            "text-sm font-semibold transition-all",
            habit.completed_today
              ? "text-gray-400 line-through"
              : "text-gray-200"
          )}>
            {habit.name}
          </span>
          {habit.category ? (
            <span className="mt-0.5 text-xs text-gray-500 capitalize">{habit.category}</span>
          ) : null}
        </button>

        {/* XP badge on completion */}
        {habit.completed_today ? (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1 rounded-full bg-neon-green/10 px-2 py-0.5"
          >
            <Zap className="h-3 w-3 text-neon-green" />
            <span className="text-[10px] font-bold text-neon-green">+10 XP</span>
          </motion.div>
        ) : null}

        {/* Streak badge */}
        {streakCount > 0 ? (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
            streakCount >= 7
              ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-md shadow-amber-500/10"
              : "bg-surface-300/50 text-gray-400"
          )}>
            <Flame className="h-3 w-3" />
            {streakCount}
          </div>
        ) : null}

        {/* Expand toggle */}
        <button
          type="button"
          className="rounded-lg p-1.5 text-gray-600 transition-all hover:bg-primary-500/10 hover:text-gray-400"
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

      {/* Expandable side panel */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-primary-500/10 px-4 pb-4 pt-3">
              {/* Streak stats row */}
              <div className="mb-3 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-surface-300/40 px-3 py-2">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">Current</p>
                    <p className="text-sm font-bold text-white">{streakCount} {streakCount === 1 ? "day" : "days"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-surface-300/40 px-3 py-2">
                  <Trophy className="h-3.5 w-3.5 text-violet-400" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">Longest</p>
                    <p className="text-sm font-bold text-white">{longestStreak} {longestStreak === 1 ? "day" : "days"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-lg bg-surface-300/40 px-3 py-2">
                  <CalendarCheck className="h-3.5 w-3.5 text-primary-400" />
                  <div>
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-gray-600">Last Done</p>
                    <p className="text-sm font-bold text-white">{formatLastCompleted(lastCompleted)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {onArchive ? (
                  <button
                    type="button"
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-400 transition-colors hover:bg-primary-500/10 hover:text-gray-300"
                    onClick={() => { onArchive(habit.id); setExpanded(false); }}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    {habit.is_archived ? "Unarchive" : "Archive"}
                  </button>
                ) : null}
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                  onClick={() => { onDelete(habit.id); setExpanded(false); }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
