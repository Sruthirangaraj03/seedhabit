import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

const PRESET_COLORS = [
  "#6366f1", "#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#ec4899",
  "#8b5cf6", "#14b8a6", "#f97316", "#06b6d4", "#84cc16", "#a855f7",
];

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Color</label>
      <div className="flex flex-wrap gap-2">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-110",
              value === color ? "ring-2 ring-offset-2 ring-offset-surface-400 scale-110" : ""
            )}
            style={{
              backgroundColor: color,
              boxShadow: value === color ? `0 0 12px ${color}50` : undefined,
              ...(value === color ? { ringColor: color } : {}),
            }}
            aria-label={`Select color ${color}`}
          >
            {value === color && <Check className="h-3.5 w-3.5 text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
