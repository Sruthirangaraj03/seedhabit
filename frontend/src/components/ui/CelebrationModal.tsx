import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { useXPContext } from "../../context/XPContext";

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CelebrationModal({ open, onClose }: CelebrationModalProps) {
  const { rankInfo } = useXPContext();

  useEffect(() => {
    if (!open) return;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#00d4ff", "#7c3aed", "#0099cc", "#00b4d8", "#a855f7"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#00d4ff", "#7c3aed", "#0099cc", "#00b4d8", "#a855f7"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#00d4ff", "#7c3aed", "#0099cc", "#00b4d8", "#a855f7", "#fbbf24"],
    });
  }, [open]);

  // Determine old rank for the transition display
  const rankOrder = ["E", "D", "C", "B", "A", "S"];
  const currentIdx = rankOrder.indexOf(rankInfo.rank);
  const oldRank = currentIdx > 0 ? rankOrder[currentIdx - 1] : "E";
  const oldRankColors: Record<string, string> = {
    E: "#6b7280",
    D: "#22c55e",
    C: "#00d4ff",
    B: "#7c3aed",
    A: "#fbbf24",
    S: "#ef4444",
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-lg border border-[#00d4ff]/40 bg-[#0a1628]/95 p-8 text-center shadow-[0_0_40px_rgba(0,212,255,0.15)] backdrop-blur-xl"
          >
            {/* Scan line effect */}
            <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,212,255,0.03)_2px,rgba(0,212,255,0.03)_4px)]" />

            {/* Glow accents */}
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#00d4ff]/15 blur-[80px]" />
            <div className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-[#7c3aed]/10 blur-[60px]" />

            <div className="relative">
              {/* System header */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00d4ff]/60"
              >
                [ SYSTEM NOTIFICATION ]
              </motion.div>

              {/* RANK UP title */}
              <motion.h2
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                className="mb-6 text-3xl font-black uppercase tracking-wider"
                style={{
                  color: "#00d4ff",
                  textShadow: "0 0 20px rgba(0,212,255,0.5), 0 0 40px rgba(0,212,255,0.3)",
                }}
              >
                RANK UP!
              </motion.h2>

              {/* Rank transition: Old -> New */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-5 flex items-center justify-center gap-4"
              >
                {/* Old rank */}
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-lg border-2 text-2xl font-black opacity-50"
                  style={{
                    borderColor: oldRankColors[oldRank],
                    color: oldRankColors[oldRank],
                  }}
                >
                  {oldRank}
                </div>

                {/* Arrow */}
                <motion.div
                  initial={{ x: -5 }}
                  animate={{ x: 5 }}
                  transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
                >
                  <ChevronRight className="h-6 w-6 text-[#00d4ff]" />
                </motion.div>

                {/* New rank */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", bounce: 0.5 }}
                  className="flex h-16 w-16 items-center justify-center rounded-lg border-2 text-2xl font-black"
                  style={{
                    borderColor: rankInfo.color,
                    color: rankInfo.color,
                    boxShadow: `0 0 20px ${rankInfo.glowColor}, 0 0 40px ${rankInfo.glowColor}`,
                  }}
                >
                  {rankInfo.rank}
                </motion.div>
              </motion.div>

              {/* Achievement label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mb-3 text-sm font-bold uppercase tracking-widest"
                style={{ color: rankInfo.color }}
              >
                {rankInfo.label} Achieved
              </motion.div>

              {/* System message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mb-6 font-mono text-xs leading-relaxed text-[#00d4ff]/70"
              >
                [SYSTEM] Congratulations, Hunter.
                <br />
                You have been promoted to {rankInfo.rank}-Rank.
                <br />
                Continue your ascension.
              </motion.p>

              {/* XP Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                className="mb-6 inline-flex items-center gap-2 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-4 py-2"
              >
                <span
                  className="text-lg font-black"
                  style={{ color: rankInfo.color }}
                >
                  {rankInfo.rank}-RANK
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <Button onClick={onClose} size="lg" className="w-full">
                  CONTINUE
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
