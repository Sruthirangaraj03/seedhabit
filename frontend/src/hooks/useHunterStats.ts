import { useState, useCallback, useEffect } from "react";

const STATS_KEY = "seedhabit_hunter_stats";

export interface HunterStat {
  name: string;
  value: number;
  icon: string;
  color: string;
  glowColor: string;
}

export interface StatGain {
  stat: string;
  amount: number;
  color: string;
  id: number;
}

// Map habit categories to stat gains
const CATEGORY_STAT_MAP: Record<string, { stat: string; amount: number }[]> = {
  fitness: [{ stat: "Strength", amount: 5 }, { stat: "Vitality", amount: 2 }, { stat: "Consistency", amount: 2 }],
  health: [{ stat: "Vitality", amount: 5 }, { stat: "Discipline", amount: 2 }, { stat: "Consistency", amount: 2 }],
  mindfulness: [{ stat: "Intelligence", amount: 3 }, { stat: "Discipline", amount: 3 }, { stat: "Consistency", amount: 2 }],
  learning: [{ stat: "Intelligence", amount: 5 }, { stat: "Perception", amount: 2 }, { stat: "Productivity", amount: 2 }],
  productivity: [{ stat: "Discipline", amount: 5 }, { stat: "Productivity", amount: 4 }, { stat: "Intelligence", amount: 2 }],
  social: [{ stat: "Perception", amount: 5 }, { stat: "Vitality", amount: 2 }, { stat: "Consistency", amount: 2 }],
};

// Default stat gains for unknown categories
const DEFAULT_GAINS = [{ stat: "Discipline", amount: 3 }, { stat: "Vitality", amount: 2 }, { stat: "Consistency", amount: 2 }];

const DEFAULT_STATS: Record<string, number> = {
  Strength: 10,
  Intelligence: 10,
  Discipline: 10,
  Vitality: 10,
  Perception: 10,
  Consistency: 10,
  Productivity: 10,
};

const STAT_CONFIG: Record<string, { icon: string; color: string; glowColor: string }> = {
  Strength: { icon: "Sword", color: "#ef4444", glowColor: "rgba(239,68,68,0.3)" },
  Intelligence: { icon: "Brain", color: "#00d4ff", glowColor: "rgba(0,212,255,0.3)" },
  Discipline: { icon: "Shield", color: "#7c3aed", glowColor: "rgba(124,58,237,0.3)" },
  Vitality: { icon: "Heart", color: "#22c55e", glowColor: "rgba(34,197,94,0.3)" },
  Perception: { icon: "Eye", color: "#fbbf24", glowColor: "rgba(251,191,36,0.3)" },
  Consistency: { icon: "Repeat", color: "#f97316", glowColor: "rgba(249,115,22,0.3)" },
  Productivity: { icon: "Rocket", color: "#ec4899", glowColor: "rgba(236,72,153,0.3)" },
};

export function useHunterStats() {
  const [stats, setStats] = useState<Record<string, number>>(() => {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
      try { return JSON.parse(stored); } catch { /* ignore */ }
    }
    return { ...DEFAULT_STATS };
  });

  const [pendingGains, setPendingGains] = useState<StatGain[]>([]);
  let gainIdCounter = 0;

  useEffect(() => {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }, [stats]);

  const addStats = useCallback((category: string) => {
    const gains = CATEGORY_STAT_MAP[category?.toLowerCase()] ?? DEFAULT_GAINS;
    const newGains: StatGain[] = [];

    setStats((prev) => {
      const next = { ...prev };
      for (const gain of gains) {
        next[gain.stat] = (next[gain.stat] ?? 10) + gain.amount;
        newGains.push({
          stat: gain.stat,
          amount: gain.amount,
          color: STAT_CONFIG[gain.stat]?.color ?? "#00d4ff",
          id: Date.now() + gainIdCounter++,
        });
      }
      return next;
    });

    setPendingGains((prev) => [...prev, ...newGains]);

    // Auto-clear gains after animation
    setTimeout(() => {
      setPendingGains((prev) => prev.filter((g) => !newGains.includes(g)));
    }, 2500);
  }, []);

  const removeStats = useCallback((category: string) => {
    const gains = CATEGORY_STAT_MAP[category?.toLowerCase()] ?? DEFAULT_GAINS;
    setStats((prev) => {
      const next = { ...prev };
      for (const gain of gains) {
        next[gain.stat] = Math.max(10, (next[gain.stat] ?? 10) - gain.amount);
      }
      return next;
    });
  }, []);

  const dismissGain = useCallback((id: number) => {
    setPendingGains((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const hunterStats: HunterStat[] = Object.entries(stats).map(([name, value]) => ({
    name,
    value,
    icon: STAT_CONFIG[name]?.icon ?? "Zap",
    color: STAT_CONFIG[name]?.color ?? "#00d4ff",
    glowColor: STAT_CONFIG[name]?.glowColor ?? "rgba(0,212,255,0.3)",
  }));

  const totalPower = Object.values(stats).reduce((a, b) => a + b, 0);

  return {
    stats,
    hunterStats,
    totalPower,
    pendingGains,
    addStats,
    removeStats,
    dismissGain,
  };
}
