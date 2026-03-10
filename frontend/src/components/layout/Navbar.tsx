import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Flame, Sun, Moon } from "lucide-react";
import { useXPContext } from "../../context/XPContext";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";
import { dashboardService } from "../../services/dashboardService";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Navbar({ sidebarCollapsed, onMenuClick }: NavbarProps) {
  const { xp, rankInfo } = useXPContext();
  const { theme, toggleTheme } = useTheme();
  const [bestStreak, setBestStreak] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(({ data }) => {
        setBestStreak(data.streaks.best_current?.streak ?? 0);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 10) {
        setHidden(true);
      } else if (currentY < lastScrollY) {
        setHidden(false);
      }
      lastScrollY = currentY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between bg-[rgba(5,10,25,0.85)] px-6 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <div className="relative z-10 flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-[#00d4ff]/40 transition-colors hover:bg-[#00d4ff]/10 hover:text-[#00d4ff] lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 hover:bg-[#00d4ff]/10"
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div
                key="sun"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Sun className="h-4 w-4 text-amber-400" style={{ filter: "drop-shadow(0 0 4px rgba(251,191,36,0.5))" }} />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Moon className="h-4 w-4 text-blue-500" style={{ filter: "drop-shadow(0 0 4px rgba(59,130,246,0.5))" }} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Streak with animated fire */}
        <div className="relative flex items-center gap-1 rounded px-2 py-1.5">
          <div className="relative h-5 w-5">
            {/* Outer fire glow */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(251,146,60,0.4) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Fire particles rising */}
            <motion.div
              className="absolute left-1/2 top-0 h-1.5 w-1.5 rounded-full"
              style={{ background: "#fbbf24", marginLeft: -3 }}
              animate={{ y: [-2, -8, -2], opacity: [0.8, 0, 0.8], scale: [0.8, 0.3, 0.8] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            />
            <motion.div
              className="absolute left-1/2 top-0 h-1 w-1 rounded-full"
              style={{ background: "#fb923c", marginLeft: 1 }}
              animate={{ y: [0, -10, 0], opacity: [0.6, 0, 0.6], scale: [0.6, 0.2, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
            />
            {/* Main flame icon with flicker */}
            <motion.div
              animate={{ scale: [1, 1.15, 0.95, 1.1, 1], rotate: [0, -3, 3, -2, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Flame
                className="h-5 w-5"
                style={{
                  color: "#fb923c",
                  filter: "drop-shadow(0 0 6px rgba(251,146,60,0.8)) drop-shadow(0 0 12px rgba(239,68,68,0.4))",
                }}
              />
            </motion.div>
          </div>
          <span
            className="text-sm font-bold font-mono"
            style={{ color: "#fb923c", textShadow: "0 0 8px rgba(251,146,60,0.5)" }}
          >
            {bestStreak}
          </span>
        </div>

        {/* Rank + XP Badge */}
        <div
          className="relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 overflow-hidden"
          style={{
            borderColor: `${rankInfo.color}55`,
            backgroundColor: `${rankInfo.color}1a`,
            boxShadow: `0 0 14px ${rankInfo.glowColor}, 0 0 30px ${rankInfo.glowColor}40`,
          }}
        >
          {/* Burning fire layers */}
          <div
            className="pointer-events-none absolute inset-0 animate-pulse"
            style={{
              background: `radial-gradient(ellipse 80% 120% at 50% 100%, ${rankInfo.color}, transparent 70%)`,
              opacity: 0.25,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 60% 80% at 50% 110%, ${rankInfo.color}, transparent 60%)`,
              opacity: 0.15,
              animation: "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
            }}
          />
          <Flame
            className="relative h-3.5 w-3.5"
            style={{
              color: rankInfo.color,
              filter: `drop-shadow(0 0 4px ${rankInfo.color})`,
              opacity: 0.6,
            }}
          />
          <span
            className="relative text-xs font-black font-mono"
            style={{ color: rankInfo.color, textShadow: `0 0 8px ${rankInfo.glowColor}` }}
          >
            {rankInfo.rank}
          </span>
          <span
            className="relative text-sm font-black font-mono"
            style={{ color: "#fff", textShadow: `0 0 10px ${rankInfo.color}, 0 0 20px ${rankInfo.glowColor}` }}
          >
            {xp.toLocaleString()} XP
          </span>
        </div>
      </div>
    </header>
  );
}
