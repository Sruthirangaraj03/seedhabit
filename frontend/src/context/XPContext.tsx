import { createContext, useContext, type ReactNode } from "react";
import { useXP, type RankInfo } from "../hooks/useXP";

interface XPContextType {
  xp: number;
  level: number;
  xpInLevel: number;
  xpForNext: number;
  xpPercent: number;
  rankInfo: RankInfo;
  nextRank: RankInfo | null;
  xpInRank: number;
  xpForNextRank: number;
  rankPercent: number;
  addXP: (amount: number) => void;
  removeXP: (amount: number) => void;
  showCelebration: boolean;
  closeCelebration: () => void;
}

const XPContext = createContext<XPContextType | null>(null);

export function XPProvider({ children }: { children: ReactNode }) {
  const xpData = useXP();

  return (
    <XPContext.Provider value={xpData}>
      {children}
    </XPContext.Provider>
  );
}

export function useXPContext(): XPContextType {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error("useXPContext must be used within an XPProvider");
  }
  return context;
}
