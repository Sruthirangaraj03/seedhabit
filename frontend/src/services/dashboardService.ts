import api from "./api";
import type { DashboardResponse } from "../types/dashboard";
import type { HeatmapEntry } from "../types/streak";

interface WeeklySummaryDay {
  date: string;
  completed: number;
  total: number;
}

interface WeeklySummaryResponse {
  days: WeeklySummaryDay[];
}

interface CompletionRateResponse {
  period: string;
  rate: number;
  completed: number;
  total: number;
}

interface StreakResponseItem {
  habit_id: number;
  habit_name: string;
  current_streak: number;
  longest_streak: number;
  last_completed_at: string | null;
}

export interface HistoryHabitItem {
  habit_id: number;
  habit_name: string;
  color: string;
  icon: string;
  category: string | null;
  note: string | null;
}

export interface HistoryDayItem {
  date: string;
  habits: HistoryHabitItem[];
  count: number;
}

export interface HistoryResponse {
  days: HistoryDayItem[];
}

export const dashboardService = {
  getDashboard: () =>
    api.get<DashboardResponse>("/dashboard"),

  getWeeklySummary: () =>
    api.get<WeeklySummaryResponse>("/dashboard/weekly"),

  getHistory: (days: number = 30) =>
    api.get<HistoryResponse>("/dashboard/history", { params: { days } }),

  getHeatmap: (year: number) =>
    api.get<HeatmapEntry[]>("/stats/heatmap", { params: { year } }),

  getCompletionRate: (period: string) =>
    api.get<CompletionRateResponse>("/stats/completion-rate", { params: { period } }),

  getAllStreaks: () =>
    api.get<StreakResponseItem[]>("/streaks"),

  getStatsOverview: () =>
    api.get("/stats/overview"),
};

export type { WeeklySummaryDay, WeeklySummaryResponse, CompletionRateResponse, StreakResponseItem };
