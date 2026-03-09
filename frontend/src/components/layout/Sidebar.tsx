import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  History,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";
import { useXPContext } from "../../context/XPContext";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "My Habits", path: "/habits", icon: ListChecks },
  { label: "History", path: "/history", icon: History },
  { label: "Settings", path: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const { level, xpInLevel, xpForNext, xpPercent } = useXPContext();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-primary-500/10 bg-surface-400/80 backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-primary-500/10 px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-neon-purple">
            <Zap className="h-4 w-4 text-white" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary-500 to-neon-purple opacity-50 blur-md" />
          </div>
          {!collapsed ? (
            <span className="text-gradient text-base font-bold tracking-tight">
              SeedHabit
            </span>
          ) : null}
        </div>
        <button
          onClick={onToggle}
          className="rounded-md p-1 text-gray-500 transition-colors hover:bg-primary-500/10 hover:text-primary-400"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Level Badge */}
      {!collapsed ? (
        <div className="mx-3 mt-3 rounded-lg border border-primary-500/10 bg-primary-500/5 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-neon-purple text-[10px] font-bold text-white">
                {level}
              </div>
              <span className="text-xs font-semibold text-primary-300">Level {level}</span>
            </div>
            <span className="text-[10px] font-medium text-gray-500">{xpInLevel}/{xpForNext} XP</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-surface-600">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-neon-purple"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      ) : null}

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "text-white"
                  : "text-gray-400 hover:bg-primary-500/5 hover:text-gray-200",
                collapsed && "justify-center px-2"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-600/20 to-neon-purple/10 border border-primary-500/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                ) : null}
                <item.icon className={cn("relative h-[18px] w-[18px]", isActive && "text-primary-400")} />
                {!collapsed ? <span className="relative">{item.label}</span> : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      {!collapsed ? (
        <div className="border-t border-primary-500/10 p-3">
          <div className="glass flex items-center gap-3 rounded-lg p-3">
            <div className="relative">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-neon-purple text-xs font-semibold text-white">
                {user?.full_name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-400 bg-neon-green" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-200">
                {user?.full_name ?? "User"}
              </p>
              <p className="truncate text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      ) : null}
    </aside>
  );
}
