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
        "relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        checked
          ? "border-transparent"
          : "border-gray-700 bg-transparent hover:border-primary-400/40 hover:scale-110"
      )}
      style={
        checked
          ? { backgroundColor: color, borderColor: color, boxShadow: `0 0 15px ${color}30` }
          : undefined
      }
      aria-label={checked ? "Mark as incomplete" : "Mark as complete"}
    >
      <motion.div
        initial={false}
        animate={checked ? { scale: [0, 1.2, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.35, type: "spring", stiffness: 400, damping: 15 }}
      >
        <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
      </motion.div>
    </button>
  );
}
