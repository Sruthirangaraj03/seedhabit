export interface TodayHabit {
  id: number;
  name: string;
  color: string;
  icon: string;
  completed: boolean;
  streak: number;
}

export interface DashboardResponse {
  today: {
    date: string;
    habits: TodayHabit[];
    completed_count: number;
    total_count: number;
    completion_rate: number;
  };
  streaks: {
    best_current: { habit_name: string; streak: number } | null;
    best_ever: { habit_name: string; streak: number } | null;
  };
  stats: {
    total_habits: number;
    active_habits: number;
    total_completions: number;
    overall_completion_rate: number;
  };
}
