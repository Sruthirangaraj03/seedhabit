import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Loader2, Swords, ScrollText, CalendarDays, Target, TrendingUp } from "lucide-react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Habit } from "../types/habit";
import type { StreakInfo, HabitLog } from "../types/streak";
import { habitService } from "../services/habitService";
import { StreakCard } from "../components/streaks/StreakCard";

export function HabitDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const habitId = Number(id);

    const fetchData = async () => {
      try {
        const [habitRes, streakRes, logsRes] = await Promise.all([
          habitService.getHabit(habitId),
          habitService.getHabitStreak(habitId),
          habitService.getHabitLogs(habitId),
        ]);
        setHabit(habitRes.data);
        setStreak(streakRes.data);
        setLogs(logsRes.data);
      } catch {
        navigate("/habits");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async () => {
    if (!id) return;
    await habitService.deleteHabit(Number(id));
    navigate("/habits");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#00d4ff]" />
      </div>
    );
  }

  if (!habit) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Back Button */}
      <Link
        to="/habits"
        className="group inline-flex items-center gap-2 rounded-lg border border-[#00d4ff]/10 bg-[#0a1628]/50 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-gray-500 transition-all duration-200 hover:border-[#00d4ff]/30 hover:text-[#00d4ff]"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        <span>// RETURN</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <div
            className="relative flex h-14 w-14 items-center justify-center rounded-lg font-display text-lg font-black text-white"
            style={{
              backgroundColor: habit.color,
              boxShadow: `0 0 25px ${habit.color}40, inset 0 0 15px rgba(255,255,255,0.1)`,
            }}
          >
            {habit.name[0]}
            <div
              className="absolute -inset-0.5 rounded-lg opacity-50"
              style={{ border: `1px solid ${habit.color}` }}
            />
          </div>
          <div>
            <h1 className="font-display text-xl font-black uppercase tracking-wide text-white sm:text-2xl">
              {habit.name}
            </h1>
            <div className="mt-1 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-gray-500">
              <span
                className="rounded border px-1.5 py-0.5 text-[10px]"
                style={{
                  borderColor: `${habit.color}40`,
                  color: habit.color,
                  backgroundColor: `${habit.color}10`,
                }}
              >
                {habit.frequency}
              </span>
              {habit.category ? (
                <>
                  <span className="text-gray-700">/</span>
                  <span className="text-gray-400">{habit.category}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link to={`/habits/${habit.id}/edit`}>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[#00d4ff] transition-all duration-200 hover:border-[#00d4ff]/40 hover:bg-[#00d4ff]/10 hover:shadow-[0_0_15px_rgba(0,212,255,0.1)]">
              <Edit className="h-3.5 w-3.5" />
              MODIFY
            </button>
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 font-mono text-xs font-bold uppercase tracking-wider text-red-400 transition-all duration-200 hover:border-red-500/40 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            DELETE
          </button>
        </div>
      </div>

      {/* Description */}
      {habit.description ? (
        <div className="rounded-lg border border-[#00d4ff]/10 bg-[#0a1628]/40 px-4 py-3">
          <p className="font-mono text-sm leading-relaxed text-gray-400">
            <span className="mr-2 text-[#00d4ff]/40">&gt;</span>
            {habit.description}
          </p>
        </div>
      ) : null}

      {/* Streak / Power Stats */}
      {streak ? (
        <div>
          <h3 className="mb-3 flex items-center gap-2 font-display text-[11px] font-black uppercase tracking-[0.2em] text-[#00d4ff]">
            <Swords className="h-4 w-4" />
            POWER STATS
          </h3>
          <StreakCard currentStreak={streak.current_streak} longestStreak={streak.longest_streak} />
        </div>
      ) : null}

      {/* Quest History */}
      <div className="rounded-lg border border-[#7c3aed]/15 bg-[#0a1628]/60 p-5 backdrop-blur-sm">
        <h3 className="mb-4 flex items-center gap-2 font-display text-[11px] font-black uppercase tracking-[0.2em] text-[#7c3aed]">
          <ScrollText className="h-4 w-4" />
          QUEST HISTORY
        </h3>
        {logs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-700/50 py-8 text-center">
            <p className="font-mono text-sm text-gray-600">
              No completions recorded. Begin your quest today.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Summary */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 rounded border border-[#00d4ff]/15 bg-[#00d4ff]/5 px-2.5 py-1.5">
                <CalendarDays className="h-3.5 w-3.5" style={{ color: "#00d4ff" }} />
                <span className="font-mono text-xs font-black text-white">{logs.length}</span>
                <span className="font-mono text-[9px] text-[#00d4ff]/50">completed</span>
              </div>
              <div className="flex items-center gap-1.5 rounded border border-[#7c3aed]/15 bg-[#7c3aed]/5 px-2.5 py-1.5">
                <Target className="h-3.5 w-3.5" style={{ color: "#7c3aed" }} />
                <span className="font-mono text-xs font-black text-white">
                  {(() => {
                    const first = new Date(logs[logs.length - 1].completed_at + "T00:00:00");
                    const last = new Date(logs[0].completed_at + "T00:00:00");
                    const total = Math.max(1, Math.floor((last.getTime() - first.getTime()) / 86400000) + 1);
                    return Math.round((logs.length / total) * 100);
                  })()}%
                </span>
                <span className="font-mono text-[9px] text-[#7c3aed]/50">rate</span>
              </div>
            </div>

            {/* Day-by-day log */}
            <div className="max-h-72 space-y-1 overflow-y-auto pr-1">
              {logs.map((log, i) => {
                const d = new Date(log.completed_at + "T00:00:00");
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diff = Math.floor((today.getTime() - d.getTime()) / 86400000);
                const label = diff === 0 ? "Today" : diff === 1 ? "Yesterday" : `${diff}d ago`;

                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2"
                    style={{ background: "rgba(124,58,237,0.04)", borderLeft: "2px solid rgba(0,212,255,0.3)" }}
                  >
                    <span
                      className="font-mono text-xs font-bold text-white"
                    >
                      {d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    </span>
                    <span className="flex-1" />
                    <span
                      className="rounded px-1.5 py-0.5 font-mono text-[9px] font-bold"
                      style={{ color: "#00d4ff", backgroundColor: "#00d4ff10", border: "1px solid #00d4ff20" }}
                    >
                      {label}
                    </span>
                    <span
                      className="font-mono text-[10px] font-bold"
                      style={{ color: "#10b981", textShadow: "0 0 6px rgba(16,185,129,0.4)" }}
                    >
                      CLEARED
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

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
                    onClick={handleDelete}
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
