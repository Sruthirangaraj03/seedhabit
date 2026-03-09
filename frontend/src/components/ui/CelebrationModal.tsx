import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Zap, Star } from "lucide-react";
import { Button } from "./Button";

interface CelebrationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CelebrationModal({ open, onClose }: CelebrationModalProps) {
  useEffect(() => {
    if (!open) return;

    // Fire multiple confetti bursts
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();

    // Big burst at start
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ["#6366f1", "#a855f7", "#ec4899", "#10b981", "#f59e0b", "#00d4ff"],
    });
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="relative mx-4 w-full max-w-sm overflow-hidden rounded-2xl border border-primary-500/20 bg-surface-400/95 p-8 text-center shadow-2xl backdrop-blur-xl"
          >
            {/* Glow background */}
            <div className="absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-primary-500/20 blur-[80px]" />
            <div className="absolute -bottom-10 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-neon-purple/15 blur-[60px]" />

            <div className="relative">
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", delay: 0.2, bounce: 0.5 }}
                className="mb-4 flex justify-center"
              >
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30">
                  <Trophy className="h-10 w-10 text-white" />
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-40 blur-xl" />
                </div>
              </motion.div>

              {/* Stars */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-2 flex justify-center gap-1"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                    transition={{ delay: 0.5 + i * 0.1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  </motion.div>
                ))}
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gradient mb-2 text-2xl font-extrabold"
              >
                3000 XP Reached!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-6 text-sm text-gray-400"
              >
                You&apos;re absolutely crushing it! Your consistency is legendary.
                Keep going and unlock even greater achievements!
              </motion.p>

              {/* XP Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-500/10 px-4 py-2"
              >
                <Zap className="h-5 w-5 text-primary-400" />
                <span className="text-lg font-bold text-primary-400">3,000 XP</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Button onClick={onClose} size="lg" className="w-full">
                  Keep Going!
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
