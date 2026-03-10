import { motion, AnimatePresence } from "framer-motion";
import { Sword, Brain, Shield, Heart, Eye, Zap } from "lucide-react";
import type { StatGain } from "../../hooks/useHunterStats";

const iconMap: Record<string, typeof Sword> = {
  Sword, Brain, Shield, Heart, Eye, Zap,
};

const statIconMap: Record<string, string> = {
  Strength: "Sword",
  Intelligence: "Brain",
  Discipline: "Shield",
  Vitality: "Heart",
  Perception: "Eye",
};

interface StatNotificationProps {
  gains: StatGain[];
  onDismiss: (id: number) => void;
}

export function StatNotifications({ gains, onDismiss }: StatNotificationProps) {
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col-reverse gap-2">
      <AnimatePresence>
        {gains.map((gain) => {
          const iconName = statIconMap[gain.stat] ?? "Zap";
          const Icon = iconMap[iconName] ?? Zap;

          return (
            <motion.div
              key={gain.id}
              initial={{ opacity: 0, x: 80, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              onAnimationComplete={() => {
                setTimeout(() => onDismiss(gain.id), 2000);
              }}
              className="pointer-events-auto flex items-center gap-3 rounded-lg border px-4 py-2.5"
              style={{
                background: "rgba(5, 10, 25, 0.9)",
                borderColor: `${gain.color}30`,
                backdropFilter: "blur(20px)",
                boxShadow: `0 0 20px ${gain.color}20, 0 4px 20px rgba(0,0,0,0.4)`,
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded"
                style={{ background: `${gain.color}15` }}
              >
                <Icon className="h-4 w-4" style={{ color: gain.color }} />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {gain.stat}
                </span>
                <span
                  className="font-display text-lg font-bold leading-tight"
                  style={{
                    color: gain.color,
                    textShadow: `0 0 10px ${gain.color}50`,
                  }}
                >
                  +{gain.amount}
                </span>
              </div>

              {/* Animated arrow up */}
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  style={{ color: gain.color }}
                >
                  <path
                    d="M6 10V2M6 2L2 6M6 2L10 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
