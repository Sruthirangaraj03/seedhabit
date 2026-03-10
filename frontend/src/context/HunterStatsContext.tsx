import { createContext, useContext, type ReactNode } from "react";
import { useHunterStats, type HunterStat, type StatGain } from "../hooks/useHunterStats";

interface HunterStatsContextType {
  stats: Record<string, number>;
  hunterStats: HunterStat[];
  totalPower: number;
  pendingGains: StatGain[];
  addStats: (category: string) => void;
  removeStats: (category: string) => void;
  dismissGain: (id: number) => void;
}

const HunterStatsContext = createContext<HunterStatsContextType | null>(null);

export function HunterStatsProvider({ children }: { children: ReactNode }) {
  const data = useHunterStats();

  return (
    <HunterStatsContext.Provider value={data}>
      {children}
    </HunterStatsContext.Provider>
  );
}

export function useHunterStatsContext(): HunterStatsContextType {
  const context = useContext(HunterStatsContext);
  if (!context) {
    throw new Error("useHunterStatsContext must be used within a HunterStatsProvider");
  }
  return context;
}
