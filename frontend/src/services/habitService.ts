import api from "./api";
import type { Habit, HabitCreate, HabitUpdate } from "../types/habit";
import type { StreakInfo, HabitLog } from "../types/streak";

interface HabitQueryParams {
  include_archived?: boolean;
  category?: string;
  frequency?: string;
}

interface HabitLogQueryParams {
  start_date?: string;
  end_date?: string;
}

export const habitService = {
  getHabits: (params?: HabitQueryParams) =>
    api.get<Habit[]>("/habits/", { params }),

  getHabit: (id: number) =>
    api.get<Habit>(`/habits/${id}`),

  createHabit: (data: HabitCreate) =>
    api.post<Habit>("/habits/", data),

  updateHabit: (id: number, data: HabitUpdate) =>
    api.put<Habit>(`/habits/${id}`, data),

  deleteHabit: (id: number) =>
    api.delete(`/habits/${id}`),

  completeHabit: (id: number) =>
    api.post<HabitLog>(`/habits/${id}/complete`),

  uncompleteHabit: (id: number) =>
    api.post(`/habits/${id}/uncomplete`),

  archiveHabit: (id: number) =>
    api.put<Habit>(`/habits/${id}/archive`),

  unarchiveHabit: (id: number) =>
    api.put<Habit>(`/habits/${id}/unarchive`),

  getHabitLogs: (id: number, params?: HabitLogQueryParams) =>
    api.get<HabitLog[]>(`/habits/${id}/logs`, { params }),

  getHabitStreak: (id: number) =>
    api.get<StreakInfo>(`/habits/${id}/streak`),
};
