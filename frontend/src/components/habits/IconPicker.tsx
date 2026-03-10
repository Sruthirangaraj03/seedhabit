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
      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
        {ICON_OPTIONS.map(({ name, label, Icon }) => (
          <button
            key={name}
            type="button"
            onClick={() => onChange(name)}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-lg border p-3 transition-all duration-200",
              value === name
                ? "border-[#00d4ff]/40 bg-[#00d4ff]/10 text-[#00d4ff] shadow-[0_0_15px_rgba(0,212,255,0.15),inset_0_0_10px_rgba(0,212,255,0.05)]"
                : "border-gray-700/30 bg-[#0a1628]/50 text-gray-500 hover:border-[#00d4ff]/15 hover:text-gray-400"
            )}
            aria-label={`Select ${label} icon`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider">{label}</span>
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
