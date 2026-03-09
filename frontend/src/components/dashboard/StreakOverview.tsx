import { Flame, Trophy, Star } from "lucide-react";
import { motion } from "framer-motion";

interface StreakHighlight {
  habit_name: string;
  streak: number;
}

interface StreakOverviewProps {
  bestCurrent: StreakHighlight | null;
  bestEver: StreakHighlight | null;
}

export function StreakOverview({ bestCurrent, bestEver }: StreakOverviewProps) {
  return (
    <div className="glass rounded-xl p-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Streak Highlights</h3>

      <div className="space-y-3">
        {/* Current Best */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="relative overflow-hidden rounded-xl border border-amber-500/15 bg-amber-500/5 p-4"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-amber-500/5 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
              <Flame className="h-6 w-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Current Best</p>
              {bestCurrent ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-200">
                    {bestCurrent.habit_name}
                  </p>
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-400">
                    {bestCurrent.streak} days
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Complete a habit to start</p>
              )}
            </div>
            {bestCurrent && bestCurrent.streak >= 7 ? (
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <Star className="h-5 w-5 text-amber-400" />
              </motion.div>
            ) : null}
          </div>
        </motion.div>

        {/* All-Time Best */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="relative overflow-hidden rounded-xl border border-violet-500/15 bg-violet-500/5 p-4"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-violet-500/5 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20">
              <Trophy className="h-6 w-6 text-violet-400" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-violet-500">All-Time Best</p>
              {bestEver ? (
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-gray-200">
                    {bestEver.habit_name}
                  </p>
                  <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs font-bold text-violet-400">
                    {bestEver.streak} days
                  </span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No records yet</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
