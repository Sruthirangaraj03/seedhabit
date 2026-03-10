import { useState, useCallback, useEffect, useRef } from "react";

const ACHIEVEMENTS_KEY = "seedhabit_achievements";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "quest" | "power" | "rank" | "legendary";
  condition: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

export interface AchievementContext {
  totalCompletions: number;
  bestStreak: number;
  totalHabits: number;
  allDailyComplete: boolean;
  xp: number;
  totalDaysLoggedIn: number;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "FIRST_BLOOD",
    title: "First Blood",
    description: "Complete your first quest",
    icon: "Sword",
    category: "quest",
    condition: "Complete 1 quest",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "WEEK_WARRIOR",
    title: "Week Warrior",
    description: "Achieve a 7-day streak",
    icon: "Flame",
    category: "power",
    condition: "Reach a 7-day streak",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "MONTH_MASTER",
    title: "Month Master",
    description: "Achieve a 30-day streak",
    icon: "Shield",
    category: "power",
    condition: "Reach a 30-day streak",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "CENTURY_CLUB",
    title: "Century Club",
    description: "Complete 100 quests total",
    icon: "Trophy",
    category: "quest",
    condition: "Complete 100 quests",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "HABIT_COLLECTOR",
    title: "Habit Collector",
    description: "Create 5 habits",
    icon: "BookOpen",
    category: "quest",
    condition: "Create 5 habits",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "PERFECT_DAY",
    title: "Perfect Day",
    description: "Complete all daily quests in one day",
    icon: "Star",
    category: "quest",
    condition: "Complete all daily quests in a single day",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "RANK_E",
    title: "E-Rank Awakening",
    description: "Begin your journey as a Hunter",
    icon: "Zap",
    category: "rank",
    condition: "Start your first quest",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "RANK_D",
    title: "D-Rank Awakening",
    description: "Reach D-Rank",
    icon: "Zap",
    category: "rank",
    condition: "Earn 500 XP to reach D-Rank",
    unlocked: false,
    rarity: "common",
  },
  {
    id: "RANK_C",
    title: "C-Rank Hunter",
    description: "Reach C-Rank",
    icon: "Target",
    category: "rank",
    condition: "Earn 1,500 XP to reach C-Rank",
    unlocked: false,
    rarity: "rare",
  },
  {
    id: "RANK_B",
    title: "B-Rank Elite",
    description: "Reach B-Rank",
    icon: "Award",
    category: "rank",
    condition: "Earn 3,000 XP to reach B-Rank",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "RANK_A",
    title: "A-Rank Commander",
    description: "Reach A-Rank",
    icon: "Crown",
    category: "rank",
    condition: "Earn 6,000 XP to reach A-Rank",
    unlocked: false,
    rarity: "epic",
  },
  {
    id: "RANK_S",
    title: "Shadow Monarch",
    description: "Reach S-Rank",
    icon: "Skull",
    category: "legendary",
    condition: "Earn 10,000 XP to reach S-Rank",
    unlocked: false,
    rarity: "legendary",
  },
  {
    id: "DEDICATION",
    title: "Unwavering",
    description: "Log in 30 days total",
    icon: "Heart",
    category: "power",
    condition: "Log in for 30 days total",
    unlocked: false,
    rarity: "rare",
  },
];

function loadAchievements(): Achievement[] {
  try {
    const stored = localStorage.getItem(ACHIEVEMENTS_KEY);
    if (stored) {
      const parsed: Achievement[] = JSON.parse(stored);
      // Merge with defaults to pick up any new achievements added later
      return DEFAULT_ACHIEVEMENTS.map((def) => {
        const existing = parsed.find((a) => a.id === def.id);
        return existing ? { ...def, unlocked: existing.unlocked, unlockedAt: existing.unlockedAt } : { ...def };
      });
    }
  } catch {
    // Corrupted storage, reset
  }
  return DEFAULT_ACHIEVEMENTS.map((a) => ({ ...a }));
}

function saveAchievements(achievements: Achievement[]): void {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const prevAchievementsRef = useRef<Achievement[]>(achievements);

  useEffect(() => {
    saveAchievements(achievements);
  }, [achievements]);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const idx = prev.findIndex((a) => a.id === id);
      if (idx === -1 || prev[idx].unlocked) return prev;

      const updated = [...prev];
      const unlocked: Achievement = {
        ...updated[idx],
        unlocked: true,
        unlockedAt: new Date().toISOString(),
      };
      updated[idx] = unlocked;

      setNewlyUnlocked((curr) => [...curr, unlocked]);
      return updated;
    });
  }, []);

  const checkAchievements = useCallback(
    (context: AchievementContext) => {
      const freshlyUnlocked: Achievement[] = [];

      setAchievements((prev) => {
        const updated = prev.map((achievement) => {
          if (achievement.unlocked) return achievement;

          let shouldUnlock = false;

          switch (achievement.id) {
            case "FIRST_BLOOD":
              shouldUnlock = context.totalCompletions >= 1;
              break;
            case "WEEK_WARRIOR":
              shouldUnlock = context.bestStreak >= 7;
              break;
            case "MONTH_MASTER":
              shouldUnlock = context.bestStreak >= 30;
              break;
            case "CENTURY_CLUB":
              shouldUnlock = context.totalCompletions >= 100;
              break;
            case "HABIT_COLLECTOR":
              shouldUnlock = context.totalHabits >= 5;
              break;
            case "PERFECT_DAY":
              shouldUnlock = context.allDailyComplete;
              break;
            case "RANK_E":
              shouldUnlock = context.xp >= 0;
              break;
            case "RANK_D":
              shouldUnlock = context.xp >= 500;
              break;
            case "RANK_C":
              shouldUnlock = context.xp >= 1500;
              break;
            case "RANK_B":
              shouldUnlock = context.xp >= 3000;
              break;
            case "RANK_A":
              shouldUnlock = context.xp >= 6000;
              break;
            case "RANK_S":
              shouldUnlock = context.xp >= 10000;
              break;
            case "DEDICATION":
              shouldUnlock = context.totalDaysLoggedIn >= 30;
              break;
            default:
              break;
          }

          if (shouldUnlock) {
            const unlockedAchievement: Achievement = {
              ...achievement,
              unlocked: true,
              unlockedAt: new Date().toISOString(),
            };
            freshlyUnlocked.push(unlockedAchievement);
            return unlockedAchievement;
          }

          return achievement;
        });

        return updated;
      });

      if (freshlyUnlocked.length > 0) {
        setNewlyUnlocked((curr) => [...curr, ...freshlyUnlocked]);
      }

      return freshlyUnlocked;
    },
    []
  );

  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([]);
  }, []);

  // Keep ref in sync
  useEffect(() => {
    prevAchievementsRef.current = achievements;
  }, [achievements]);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

  return {
    achievements,
    newlyUnlocked,
    clearNewlyUnlocked,
    unlockAchievement,
    checkAchievements,
    unlockedCount,
    totalCount,
  };
}
