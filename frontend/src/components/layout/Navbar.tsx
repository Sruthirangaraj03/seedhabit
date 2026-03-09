import { useState, useEffect } from "react";
import { LogOut, Menu, Flame, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useXPContext } from "../../context/XPContext";
import { cn } from "../../lib/utils";
import { dashboardService } from "../../services/dashboardService";

interface NavbarProps {
  sidebarCollapsed: boolean;
  onMenuClick: () => void;
}

export function Navbar({ sidebarCollapsed, onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const { xp } = useXPContext();
  const [bestStreak, setBestStreak] = useState(0);

  useEffect(() => {
    dashboardService
      .getDashboard()
      .then(({ data }) => {
        setBestStreak(data.streaks.best_current?.streak ?? 0);
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header
      className={cn(
        "fixed right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-primary-500/10 bg-surface-400/60 px-6 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "left-16" : "left-64"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-primary-500/10 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-base font-semibold text-gray-200"
        >
          {getGreeting()}{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}
        </motion.h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Streak Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 px-3 py-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-xs font-bold text-amber-400">{bestStreak}</span>
        </div>

        {/* XP Badge */}
        <div className="flex items-center gap-1.5 rounded-full border border-primary-500/20 bg-primary-500/5 px-3 py-1.5">
          <Zap className="h-3.5 w-3.5 text-primary-400" />
          <span className="text-xs font-bold text-primary-400">{xp.toLocaleString()} XP</span>
        </div>

        <button
          onClick={logout}
          className="ml-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          aria-label="Logout"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
