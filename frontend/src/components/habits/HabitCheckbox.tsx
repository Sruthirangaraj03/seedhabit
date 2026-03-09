import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

interface HabitCheckboxProps {
  checked: boolean;
  color: string;
  onChange: () => void;
}

export function HabitCheckbox({ checked, color, onChange }: HabitCheckboxProps) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        "relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 transition-all duration-200",
        checked
          ? "border-transparent"
          : "border-gray-600 bg-transparent hover:border-gray-400 hover:scale-110"
      )}
      style={
        checked
          ? { backgroundColor: color, borderColor: color, boxShadow: `0 0 12px ${color}40` }
          : undefined
      }
      aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
    >
      <motion.div
        initial={false}
        animate={checked ? { scale: [0, 1.3, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring" }}
      >
        <Check className="h-4 w-4 text-white" />
      </motion.div>
    </button>
  );
}
