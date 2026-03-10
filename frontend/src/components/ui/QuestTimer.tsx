import { useState, useEffect } from "react";
import { Timer } from "lucide-react";
import { cn } from "../../lib/utils";

export function QuestTimer() {
  const [timeLeft, setTimeLeft] = useState("");
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();

      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);

      setTimeLeft(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
      setUrgent(hours < 1);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded border px-2.5 py-1 transition-all duration-300",
        urgent
          ? "border-neon-red/30 bg-neon-red/5"
          : "border-[#00d4ff]/15 bg-[#00d4ff]/5"
      )}
      style={urgent ? {
        boxShadow: "0 0 8px rgba(239, 68, 68, 0.15)",
        animation: "pulse-glow 2s ease-in-out infinite",
      } : {}}
    >
      <Timer className={cn(
        "h-3 w-3",
        urgent ? "text-neon-red" : "text-[#00d4ff]/60"
      )} />
      <span className={cn(
        "font-mono text-[10px] font-bold tracking-wider",
        urgent ? "text-neon-red/70" : "text-[#00d4ff]/40"
      )}>
        RESET
      </span>
      <span className={cn(
        "font-mono text-[11px] font-bold tabular-nums",
        urgent ? "text-neon-red" : "text-[#00d4ff]"
      )}
      style={!urgent ? { textShadow: "0 0 6px rgba(0, 212, 255, 0.3)" } : { textShadow: "0 0 6px rgba(239, 68, 68, 0.3)" }}
      >
        {timeLeft}
      </span>
    </div>
  );
}
