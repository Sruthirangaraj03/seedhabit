import { Swords, Activity, CheckCircle, TrendingUp } from "lucide-react";
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
    label: "REGISTERED QUESTS",
    icon: Swords,
  },
  {
    key: "active",
    label: "ACTIVE QUESTS",
    icon: Activity,
  },
  {
    key: "completions",
    label: "TOTAL QUESTS",
    icon: CheckCircle,
  },
  {
    key: "rate",
    label: "CLEAR RATE",
    icon: TrendingUp,
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
          className="system-panel relative overflow-hidden rounded-xl p-4 transition-all duration-300"
          style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(0, 212, 255, 0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 0 15px rgba(0, 212, 255, 0.05), inset 0 1px 0 rgba(0, 212, 255, 0.1)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: "rgba(0, 212, 255, 0.08)",
                border: "1px solid rgba(0, 212, 255, 0.15)",
              }}
            >
              <stat.icon className="h-5 w-5" style={{ color: "#00d4ff" }} />
            </div>
            <div>
              <p
                className="system-label text-[10px] font-bold uppercase tracking-[0.15em]"
                style={{
                  color: "#00d4ff",
                  textShadow: "0 0 8px rgba(0,212,255,0.4)",
                }}
              >
                {stat.label}
              </p>
              <p
                className="text-2xl font-bold text-white"
                style={{
                  textShadow: "0 0 10px rgba(0,212,255,0.2)",
                }}
              >
                {values[stat.key]}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
