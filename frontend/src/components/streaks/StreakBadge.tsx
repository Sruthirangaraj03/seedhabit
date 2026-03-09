import { Flame } from "lucide-react";
import { cn } from "../../lib/utils";

interface StreakBadgeProps {
  streak: number;
}

export function StreakBadge({ streak }: StreakBadgeProps) {
  if (streak <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        streak >= 7
          ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
          : streak >= 3
          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400"
          : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
      )}
    >
      <Flame className="h-3 w-3" />
      {streak}
    </span>
  );
}
