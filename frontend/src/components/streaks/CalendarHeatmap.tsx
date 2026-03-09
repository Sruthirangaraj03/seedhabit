import { useMemo } from "react";
import type { HeatmapEntry } from "../../types/streak";
import { cn } from "../../lib/utils";

interface CalendarHeatmapProps {
  data: HeatmapEntry[];
  year: number;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getColor(count: number): string {
  if (count === 0) return "bg-gray-100 dark:bg-gray-700";
  if (count === 1) return "bg-green-200 dark:bg-green-900";
  if (count === 2) return "bg-green-400 dark:bg-green-700";
  return "bg-green-600 dark:bg-green-500";
}

export function CalendarHeatmap({ data, year }: CalendarHeatmapProps) {
  const dataMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const entry of data) {
      map.set(entry.date, entry.count);
    }
    return map;
  }, [data]);

  const weeks = useMemo(() => {
    const result: { date: Date; count: number }[][] = [];
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    // Align to Sunday
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay());

    let currentWeek: { date: Date; count: number }[] = [];
    const current = new Date(start);

    while (current <= endDate || currentWeek.length > 0) {
      const dateStr = current.toISOString().split("T")[0];
      const isInYear = current.getFullYear() === year;

      currentWeek.push({
        date: new Date(current),
        count: isInYear ? (dataMap.get(dateStr) ?? 0) : -1,
      });

      if (currentWeek.length === 7) {
        result.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
      if (current > endDate && currentWeek.length === 0) break;
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [year, dataMap]);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">{year} Activity</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex gap-0.5">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-0.5">
              {week.map((day, di) => (
                <div
                  key={di}
                  className={cn(
                    "h-3 w-3 rounded-sm",
                    day.count === -1 ? "bg-transparent" : getColor(day.count)
                  )}
                  title={day.count >= 0 ? `${day.date.toLocaleDateString()}: ${day.count} completions` : ""}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-4 text-xs text-gray-400">
          {MONTHS.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1 text-xs text-gray-400">
        <span>Less</span>
        <div className="h-3 w-3 rounded-sm bg-gray-100 dark:bg-gray-700" />
        <div className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
        <div className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
        <div className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
        <span>More</span>
      </div>
    </div>
  );
}
