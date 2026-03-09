import { Layers, Activity, CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface StatsCardsProps {
  totalHabits: number;
  activeHabits: number;
  totalCompletions: number;
  completionRate: number;
}

const stats = [
  {
    key: "total",
    label: "Total Habits",
    icon: Layers,
    gradient: "from-blue-500 to-cyan-400",
    glow: "shadow-blue-500/20",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
  },
  {
    key: "active",
    label: "Active Habits",
    icon: Activity,
    gradient: "from-emerald-500 to-green-400",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
  },
  {
    key: "completions",
    label: "Completions",
    icon: CheckCircle,
    gradient: "from-violet-500 to-purple-400",
    glow: "shadow-violet-500/20",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
  },
  {
    key: "rate",
    label: "Completion Rate",
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-400",
    glow: "shadow-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
  },
] as const;

export function StatsCards({ totalHabits, activeHabits, totalCompletions, completionRate }: StatsCardsProps) {
  const values: Record<string, string> = {
    total: String(totalHabits),
    active: String(activeHabits),
    completions: String(totalCompletions),
    rate: `${completionRate}%`,
  };

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
          className={`glass rounded-xl p-4 hover:glow-sm transition-all duration-300 shadow-lg ${stat.glow}`}
        >
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-5 w-5 ${stat.text}`} />
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{values[stat.key]}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
