import { motion } from "framer-motion";
import { Sword, Brain, Shield, Heart, Eye, Zap, Repeat, Rocket } from "lucide-react";
import type { HunterStat } from "../../hooks/useHunterStats";

const iconMap: Record<string, typeof Sword> = {
  Sword, Brain, Shield, Heart, Eye, Zap, Repeat, Rocket,
};

interface HunterStatsProps {
  stats: HunterStat[];
  totalPower: number;
}

export function HunterStatsPanel({ stats, totalPower }: HunterStatsProps) {
  const maxStat = Math.max(...stats.map((s) => s.value), 100);

  return (
    <div className="glass flex w-full flex-col rounded-xl p-6">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-[#00d4ff]" />
          <h3
            className="font-display text-xs font-bold uppercase tracking-[0.2em]"
            style={{ color: "rgba(0, 212, 255, 0.6)" }}
          >
            HUNTER STATS
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="font-mono text-[10px] tracking-wider"
            style={{ color: "rgba(0, 212, 255, 0.4)" }}
          >
            TOTAL POWER
          </span>
          <span
            className="font-mono text-sm font-black"
            style={{
              color: "#00d4ff",
              textShadow: "0 0 10px rgba(0, 212, 255, 0.4)",
            }}
          >
            {totalPower}
          </span>
        </div>
      </div>

      {/* Stat Bars */}
      <div className="space-y-3">
        {stats.map((stat, i) => {
          const Icon = iconMap[stat.icon] ?? Zap;
          const percent = Math.min((stat.value / maxStat) * 100, 100);

          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="group"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-6 w-6 items-center justify-center rounded"
                    style={{ background: `${stat.color}15` }}
                  >
                    <Icon className="h-3 w-3" style={{ color: stat.color }} />
                  </div>
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    {stat.name}
                  </span>
                </div>
                <span
                  className="font-mono text-xs font-black tabular-nums"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </span>
              </div>

              {/* Bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-surface-600/50">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    background: `linear-gradient(90deg, ${stat.color}, ${stat.color}80)`,
                    boxShadow: `0 0 8px ${stat.glowColor}`,
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
