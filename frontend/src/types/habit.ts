import type { StreakInfo } from "./streak";

export interface Habit {
  id: number;
  name: string;
  description: string | null;
  frequency: "daily" | "weekly";
  category: string | null;
  color: string;
  icon: string;
  reminder_time: string | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  streak_info?: StreakInfo | null;
  completed_today?: boolean | null;
}

export interface HabitCreate {
  name: string;
  description?: string;
  frequency?: string;
  category?: string;
  color?: string;
  icon?: string;
}

export type HabitUpdate = Partial<HabitCreate>;
