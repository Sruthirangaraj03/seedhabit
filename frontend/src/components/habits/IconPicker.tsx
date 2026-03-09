import {
  Check,
  Heart,
  Brain,
  Dumbbell,
  BookOpen,
  Sun,
  Moon,
  Music,
  Coffee,
  Droplets,
  Target,
  Flame,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../lib/utils";

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

interface IconOption {
  name: string;
  label: string;
  Icon: LucideIcon;
}

const ICON_OPTIONS: IconOption[] = [
  { name: "check", label: "Check", Icon: Check },
  { name: "heart", label: "Heart", Icon: Heart },
  { name: "brain", label: "Brain", Icon: Brain },
  { name: "dumbbell", label: "Dumbbell", Icon: Dumbbell },
  { name: "book-open", label: "Book", Icon: BookOpen },
  { name: "sun", label: "Sun", Icon: Sun },
  { name: "moon", label: "Moon", Icon: Moon },
  { name: "music", label: "Music", Icon: Music },
  { name: "coffee", label: "Coffee", Icon: Coffee },
  { name: "droplets", label: "Water", Icon: Droplets },
  { name: "target", label: "Target", Icon: Target },
  { name: "flame", label: "Flame", Icon: Flame },
];

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">Icon</label>
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {ICON_OPTIONS.map(({ name, label, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-xl border p-3 transition-all duration-200",
              value === name
                ? "border-primary-500/30 bg-primary-500/10 text-primary-400 shadow-md shadow-primary-500/10"
                : "border-primary-500/10 text-gray-500 hover:border-primary-500/20 hover:text-gray-400"
            )}
            aria-label={`Select ${label} icon`}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function getHabitIcon(iconName: string): LucideIcon {
  const found = ICON_OPTIONS.find((opt) => opt.name === iconName);
  return found ? found.Icon : Check;
}
