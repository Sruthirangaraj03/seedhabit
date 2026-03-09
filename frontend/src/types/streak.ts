export interface StreakInfo {
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
}

export interface HabitLog {
  id: number;
  habit_id: number;
  completed_at: string;
  note: string | null;
}

export interface HeatmapEntry {
  date: string;
  count: number;
}
