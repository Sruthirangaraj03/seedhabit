import { useState, useEffect, useCallback } from "react";
import { habitService } from "../services/habitService";
import type { Habit } from "../types/habit";
import { isAxiosError } from "axios";

interface UseHabitsOptions {
  category?: string;
  frequency?: string;
  includeArchived?: boolean;
}

interface UseHabitsReturn {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: () => Promise<void>;
  toggleComplete: (habitId: number) => Promise<void>;
  deleteHabit: (habitId: number) => Promise<boolean>;
  archiveHabit: (habitId: number) => Promise<void>;
}

export function useHabits(options?: UseHabitsOptions): UseHabitsReturn {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data } = await habitService.getHabits({
        category: options?.category,
        frequency: options?.frequency,
        include_archived: options?.includeArchived,
      });
      setHabits(data);
    } catch (err) {
      if (isAxiosError(err)) {
        setError(err.response?.data?.detail || "Failed to load habits");
      } else {
        setError("Failed to load habits");
      }
    } finally {
      setIsLoading(false);
    }
  }, [options?.category, options?.frequency, options?.includeArchived]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggleComplete = useCallback(
    async (habitId: number) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      try {
        if (habit.completed_today) {
          await habitService.uncompleteHabit(habitId);
        } else {
          await habitService.completeHabit(habitId);
        }
        await fetchHabits();
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data?.detail || "Failed to update habit");
        } else {
          setError("Failed to update habit");
        }
      }
    },
    [habits, fetchHabits]
  );

  const deleteHabit = useCallback(
    async (habitId: number): Promise<boolean> => {
      const confirmed = window.confirm(
        "Are you sure you want to delete this habit? This action cannot be undone."
      );
      if (!confirmed) return false;

      try {
        await habitService.deleteHabit(habitId);
        await fetchHabits();
        return true;
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data?.detail || "Failed to delete habit");
        } else {
          setError("Failed to delete habit");
        }
        return false;
      }
    },
    [fetchHabits]
  );

  const archiveHabit = useCallback(
    async (habitId: number) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit) return;

      try {
        if (habit.is_archived) {
          await habitService.unarchiveHabit(habitId);
        } else {
          await habitService.archiveHabit(habitId);
        }
        await fetchHabits();
      } catch (err) {
        if (isAxiosError(err)) {
          setError(err.response?.data?.detail || "Failed to archive habit");
        } else {
          setError("Failed to archive habit");
        }
      }
    },
    [habits, fetchHabits]
  );

  return {
    habits,
    isLoading,
    error,
    fetchHabits,
    toggleComplete,
    deleteHabit,
    archiveHabit,
  };
}
