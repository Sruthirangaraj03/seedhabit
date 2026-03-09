import { Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export function StreakCard({ currentStreak, longestStreak }: StreakCardProps) {
  return (
    <div className="flex gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex flex-1 items-center gap-3 rounded-xl p-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10">
          <Flame className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-amber-500">Current Streak</p>
          <p className="text-2xl font-bold text-white">{currentStreak}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass flex flex-1 items-center gap-3 rounded-xl p-4"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/10">
          <Trophy className="h-6 w-6 text-violet-400" />
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-500">Longest Streak</p>
          <p className="text-2xl font-bold text-white">{longestStreak}</p>
        </div>
      </motion.div>
    </div>
  );
}
