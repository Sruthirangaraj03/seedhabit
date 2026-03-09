import { useState, useEffect, useCallback } from "react";
import type { DashboardResponse } from "../types/dashboard";
import { dashboardService, type WeeklySummaryDay } from "../services/dashboardService";

interface UseDashboardReturn {
  dashboard: DashboardResponse | null;
  weeklyData: WeeklySummaryDay[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklySummaryDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [dashRes, weeklyRes] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getWeeklySummary(),
      ]);
      setDashboard(dashRes.data);
      setWeeklyData(weeklyRes.data.days);
    } catch {
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { dashboard, weeklyData, isLoading, error, refresh };
}
