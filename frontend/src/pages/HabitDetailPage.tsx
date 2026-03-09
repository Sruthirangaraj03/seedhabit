import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Edit, Trash2, Loader2, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import type { Habit } from "../types/habit";
import type { StreakInfo, HabitLog } from "../types/streak";
import { habitService } from "../services/habitService";
import { Button } from "../components/ui/Button";
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

  const handleDelete = async () => {
    if (!id) return;
    const confirmed = window.confirm("Delete this habit? This cannot be undone.");
    if (!confirmed) return;

    await habitService.deleteHabit(Number(id));
    navigate("/habits");
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
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
      <Link to="/habits" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Habits
      </Link>

      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg"
            style={{ backgroundColor: habit.color, boxShadow: `0 0 20px ${habit.color}30` }}
          >
            {habit.name[0]}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{habit.name}</h1>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="capitalize">{habit.frequency}</span>
              {habit.category ? (
                <>
                  <span>&middot;</span>
                  <span className="capitalize">{habit.category}</span>
                </>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to={`/habits/${habit.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button variant="danger" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {habit.description ? (
        <p className="text-sm text-gray-400">{habit.description}</p>
      ) : null}

      {streak ? (
        <StreakCard currentStreak={streak.current_streak} longestStreak={streak.longest_streak} />
      ) : null}

      <div className="glass rounded-xl p-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-gray-400">
          <Calendar className="h-4 w-4" />
          Recent Completions
        </h3>
        {logs.length === 0 ? (
          <p className="text-sm text-gray-500">No completions yet. Start today.</p>
        ) : (
          <div className="space-y-1">
            {logs.slice(0, 20).map((log, i) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between rounded-lg bg-surface-300/50 px-4 py-2.5 backdrop-blur-sm"
              >
                <span className="text-sm text-gray-300">
                  {new Date(log.completed_at + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                </span>
                {log.note ? (
                  <span className="text-xs text-gray-500">{log.note}</span>
                ) : null}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
