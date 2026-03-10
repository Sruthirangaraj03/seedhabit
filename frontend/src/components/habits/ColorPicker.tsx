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
      <div className="flex flex-wrap gap-2.5">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 hover:scale-110",
              value === color
                ? "ring-2 ring-[#00d4ff]/60 ring-offset-2 ring-offset-[#0a1628] scale-110 shadow-[0_0_12px_rgba(0,212,255,0.3)]"
                : "ring-1 ring-gray-700/30 hover:ring-gray-600/50"
            )}
            style={{
              backgroundColor: color,
              boxShadow: value === color ? `0 0 16px ${color}50` : undefined,
            }}
            aria-label={`Select color ${color}`}
          >
            {value === color && <Check className="h-3.5 w-3.5 text-white drop-shadow-md" />}
          </button>
        ))}
      </div>
    </div>
  );
}
