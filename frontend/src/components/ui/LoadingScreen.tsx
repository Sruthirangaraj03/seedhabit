import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number; // ms, default 2000
}

export function LoadingScreen({ onComplete, minDuration = 2000 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setShow(false);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ background: "#050a15" }}
        >
          {/* Scan lines */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.1) 2px, rgba(0,212,255,0.1) 4px)",
            }}
          />

          {/* Floating particles */}
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-1 w-1 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: i % 3 === 0 ? "#7c3aed" : "#00d4ff",
              }}
              animate={{
                y: [0, -80 - Math.random() * 120],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* System icon - glowing diamond */}
            <motion.div
              initial={{ scale: 0, rotate: 45 }}
              animate={{ scale: 1, rotate: 45 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="mb-8 h-16 w-16 rounded-lg border"
              style={{
                borderColor: "#00d4ff",
                background: "rgba(0, 212, 255, 0.05)",
                boxShadow: "0 0 30px rgba(0, 212, 255, 0.3), 0 0 60px rgba(0, 212, 255, 0.1), inset 0 0 30px rgba(0, 212, 255, 0.1)",
              }}
            >
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(0, 212, 255, 0.2)",
                    "0 0 40px rgba(0, 212, 255, 0.5)",
                    "0 0 20px rgba(0, 212, 255, 0.2)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full w-full rounded-lg"
              />
            </motion.div>

            {/* SYSTEM text */}
            <motion.h1
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.3em" }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mb-4 font-display text-2xl font-bold"
              style={{
                color: "#00d4ff",
                textShadow: "0 0 20px rgba(0, 212, 255, 0.5), 0 0 40px rgba(0, 212, 255, 0.2)",
              }}
            >
              SYSTEM
            </motion.h1>

            {/* Initializing text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mb-8 font-mono text-xs tracking-widest"
              style={{ color: "rgba(0, 212, 255, 0.5)" }}
            >
              INITIALIZING HUNTER PROTOCOL...
            </motion.p>

            {/* Progress bar */}
            <div className="w-64">
              <div
                className="h-[2px] overflow-hidden rounded-full"
                style={{ background: "rgba(0, 212, 255, 0.1)" }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #00d4ff, #7c3aed)",
                    boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                  }}
                />
              </div>
              <div className="mt-2 flex justify-between">
                <span className="font-mono text-[10px]" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
                  LOADING
                </span>
                <span className="font-mono text-[10px]" style={{ color: "rgba(0, 212, 255, 0.4)" }}>
                  {Math.round(progress)}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
