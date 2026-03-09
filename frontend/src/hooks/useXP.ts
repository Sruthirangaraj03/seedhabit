import { useState, useCallback, useEffect } from "react";

const XP_KEY = "seedhabit_xp";
const CELEBRATED_KEY = "seedhabit_celebrated_3000";

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
        // Delay so the UI updates first
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

  const level = Math.floor(xp / 1000) + 1;
  const xpInLevel = xp % 1000;
  const xpForNext = 1000;
  const xpPercent = (xpInLevel / xpForNext) * 100;

  return {
    xp,
    level,
    xpInLevel,
    xpForNext,
    xpPercent,
    addXP,
    removeXP,
    showCelebration,
    closeCelebration,
  };
}
