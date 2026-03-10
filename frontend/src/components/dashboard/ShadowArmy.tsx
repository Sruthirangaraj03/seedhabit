import { motion } from "framer-motion";

interface ShadowArmyProps {
  habits: Array<{
    id: number;
    name: string;
    completed: boolean;
    color: string;
  }>;
}

function SoldierSVG({ completed, color }: { completed: boolean; color: string }) {
  return (
    <svg
      width="48"
      height="72"
      viewBox="0 0 48 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Aura glow behind soldier */}
      {completed && (
        <ellipse
          cx="24"
          cy="36"
          rx="20"
          ry="32"
          fill="url(#aura)"
          opacity="0.3"
        />
      )}

      {/* Head */}
      <circle
        cx="24"
        cy="14"
        r="8"
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />

      {/* Eyes - glowing cyan */}
      {completed && (
        <>
          <circle cx="21" cy="13" r="1.5" fill="#00d4ff">
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </circle>
          <circle cx="27" cy="13" r="1.5" fill="#00d4ff">
            <animate attributeName="opacity" values="1;0.5;1" dur="3s" repeatCount="indefinite" />
          </circle>
          {/* Eye glow */}
          <circle cx="21" cy="13" r="3" fill="#00d4ff" opacity="0.2" />
          <circle cx="27" cy="13" r="3" fill="#00d4ff" opacity="0.2" />
        </>
      )}

      {/* Body / torso */}
      <path
        d={completed
          ? "M24 22 L16 44 L20 44 L22 34 L24 44 L26 34 L28 44 L32 44 Z"
          : "M24 22 L18 44 L30 44 Z"
        }
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />

      {/* Arms */}
      <path
        d="M16 26 L8 36 L12 37 L18 28"
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />
      <path
        d="M32 26 L40 36 L36 37 L30 28"
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />

      {/* Legs */}
      <path
        d="M18 44 L14 64 L20 64 L22 48"
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />
      <path
        d="M30 44 L34 64 L28 64 L26 48"
        fill={completed ? "#0f172a" : "transparent"}
        stroke={completed ? "#1e293b" : "#334155"}
        strokeWidth="1.5"
        opacity={completed ? 1 : 0.3}
      />

      {/* Ground shadow */}
      <ellipse
        cx="24"
        cy="66"
        rx="14"
        ry="3"
        fill={completed ? color : "#334155"}
        opacity={completed ? 0.3 : 0.1}
      />

      <defs>
        <radialGradient id="aura">
          <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#00d4ff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function ShadowArmy({ habits }: ShadowArmyProps) {
  const completedCount = habits.filter((h) => h.completed).length;
  const allCompleted = habits.length > 0 && completedCount === habits.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl"
      style={{
        background: "rgba(15, 23, 42, 0.8)",
        border: "1px solid rgba(124, 58, 237, 0.2)",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 20px rgba(124, 58, 237, 0.08), inset 0 1px 0 rgba(124, 58, 237, 0.1)",
      }}
    >
      <div className="p-5">
        {/* Header */}
        <p
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em]"
          style={{
            color: "#7c3aed",
            textShadow: "0 0 8px rgba(124,58,237,0.4)",
          }}
        >
          SHADOW ARMY
          <span className="ml-2" style={{ color: "#64748b" }}>
            [{completedCount}/{habits.length}]
          </span>
        </p>

        {/* ARISE text when all completed */}
        {allCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="mb-4 text-center"
          >
            <p
              className="text-2xl font-black uppercase tracking-[0.4em]"
              style={{
                fontFamily: "'Clash Display', sans-serif",
                color: "#00d4ff",
                textShadow: "0 0 20px rgba(0,212,255,0.6), 0 0 40px rgba(0,212,255,0.3), 0 0 60px rgba(124,58,237,0.2)",
              }}
            >
              ARISE!
            </p>
          </motion.div>
        )}

        {/* Soldiers Grid */}
        {habits.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-xs" style={{ color: "#64748b" }}>
              No shadows summoned today. Complete quests to build your army.
            </p>
          </div>
        ) : (
          <div className="relative">
            {/* Soldiers Row */}
            <div className="flex flex-wrap items-end justify-center gap-4 pb-6 pt-2">
              {habits.map((habit, idx) => (
                <motion.div
                  key={habit.id}
                  initial={habit.completed ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: habit.completed ? idx * 0.1 : 0,
                    type: "spring",
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center gap-1"
                >
                  <SoldierSVG completed={habit.completed} color={habit.color} />
                  <span
                    className="max-w-[64px] truncate text-center text-[9px] font-bold uppercase tracking-wider"
                    style={{
                      color: habit.completed ? "#e2e8f0" : "#475569",
                      textShadow: habit.completed
                        ? "0 0 6px rgba(0,212,255,0.3)"
                        : "none",
                    }}
                    title={habit.name}
                  >
                    {habit.name}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Fog / mist at bottom */}
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 h-12"
              style={{
                background: "linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent)",
              }}
            />
          </div>
        )}

        {/* No completions message */}
        {habits.length > 0 && completedCount === 0 && (
          <p
            className="-mt-2 pb-2 text-center text-[10px]"
            style={{ color: "#475569" }}
          >
            No shadows summoned today. Complete quests to build your army.
          </p>
        )}
      </div>
    </motion.div>
  );
}
