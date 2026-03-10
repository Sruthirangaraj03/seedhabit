import { useState, useCallback, useEffect } from "react";

const XP_KEY = "seedhabit_xp";
const CELEBRATED_KEY = "seedhabit_celebrated_3000";

export type HunterRank = "E" | "D" | "C" | "B" | "A" | "S";

export interface RankInfo {
  rank: HunterRank;
  label: string;
  minXP: number;
  maxXP: number;
  color: string;
  glowColor: string;
  cssClass: string;
}

const RANKS: RankInfo[] = [
  { rank: "E", label: "E-Rank Hunter", minXP: 0, maxXP: 499, color: "#6b7280", glowColor: "rgba(107,114,128,0.3)", cssClass: "rank-badge-e" },
  { rank: "D", label: "D-Rank Hunter", minXP: 500, maxXP: 1499, color: "#22c55e", glowColor: "rgba(34,197,94,0.3)", cssClass: "rank-badge-d" },
  { rank: "C", label: "C-Rank Hunter", minXP: 1500, maxXP: 2999, color: "#00d4ff", glowColor: "rgba(0,212,255,0.3)", cssClass: "rank-badge-c" },
  { rank: "B", label: "B-Rank Hunter", minXP: 3000, maxXP: 5999, color: "#7c3aed", glowColor: "rgba(124,58,237,0.3)", cssClass: "rank-badge-b" },
  { rank: "A", label: "A-Rank Hunter", minXP: 6000, maxXP: 9999, color: "#fbbf24", glowColor: "rgba(251,191,36,0.3)", cssClass: "rank-badge-a" },
  { rank: "S", label: "S-Rank Hunter", minXP: 10000, maxXP: Infinity, color: "#ef4444", glowColor: "rgba(239,68,68,0.4)", cssClass: "rank-badge-s" },
];

export function getRankInfo(xp: number): RankInfo {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRankInfo(xp: number): RankInfo | null {
  const current = getRankInfo(xp);
  const idx = RANKS.findIndex((r) => r.rank === current.rank);
  return idx < RANKS.length - 1 ? RANKS[idx + 1] : null;
}

export function useXP() {
  const [xp, setXp] = useState(() => {
    const stored = localStorage.getItem(XP_KEY);
    return stored ? Number(stored) : 0;
  });

  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    localStorage.setItem(XP_KEY, String(xp));
  }, [xp]);

  const addXP = useCallback((amount: number) => {
    setXp((prev) => {
      const next = prev + amount;
      const celebrated = localStorage.getItem(CELEBRATED_KEY) === "true";
      if (next >= 3000 && !celebrated) {
        localStorage.setItem(CELEBRATED_KEY, "true");
        setTimeout(() => setShowCelebration(true), 300);
      }
      return next;
    });
  }, []);

  const removeXP = useCallback((amount: number) => {
    setXp((prev) => Math.max(0, prev - amount));
  }, []);

  const closeCelebration = useCallback(() => {
    setShowCelebration(false);
  }, []);

  const rankInfo = getRankInfo(xp);
  const nextRank = getNextRankInfo(xp);
  const level = Math.floor(xp / 1000) + 1;
  const xpInRank = xp - rankInfo.minXP;
  const xpForNextRank = nextRank ? nextRank.minXP - rankInfo.minXP : 1;
  const rankPercent = nextRank ? (xpInRank / xpForNextRank) * 100 : 100;

  // Keep old level-based values for backward compatibility
  const xpInLevel = xp % 1000;
  const xpForNext = 1000;
  const xpPercent = (xpInLevel / xpForNext) * 100;

  return {
    xp,
    level,
    xpInLevel,
    xpForNext,
    xpPercent,
    rankInfo,
    nextRank,
    xpInRank,
    xpForNextRank,
    rankPercent,
    addXP,
    removeXP,
    showCelebration,
    closeCelebration,
  };
}
