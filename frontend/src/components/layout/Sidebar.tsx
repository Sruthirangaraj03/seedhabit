import { NavLink } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  ListChecks,
  History,
  Settings,
  Swords,
  Trophy,
  Crown,
  LogOut,
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
  { label: "STATUS", path: "/dashboard", icon: LayoutDashboard },
  { label: "DAILY QUESTS", path: "/habits", icon: ListChecks },
  { label: "QUEST LOG", path: "/history", icon: History },
  { label: "ACHIEVEMENTS", path: "/achievements", icon: Trophy },
  { label: "RANKINGS", path: "/leaderboard", icon: Crown },
  { label: "HUNTER PROFILE", path: "/settings", icon: Settings },
];

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { user, logout } = useAuth();
  const { xp, rankInfo, nextRank, xpInRank, xpForNextRank, rankPercent } =
    useXPContext();

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[#00d4ff]/20 bg-[rgba(5,10,25,0.95)] backdrop-blur-xl transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* System Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[#00d4ff]/20 px-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-[#00d4ff]/30 bg-[#00d4ff]/10">
            <Swords className="h-4 w-4 text-[#00d4ff]" />
            <div className="absolute inset-0 rounded-lg bg-[#00d4ff]/10 blur-md" />
          </div>
          {!collapsed ? (
            <span
              className="text-base font-bold tracking-[0.2em] text-[#00d4ff]"
              style={{
                textShadow: "0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)",
              }}
            >
              HunterHabit
            </span>
          ) : null}
        </div>
        <button
          onClick={onToggle}
          className="rounded-md p-1 text-[#00d4ff]/50 transition-colors hover:bg-[#00d4ff]/10 hover:text-[#00d4ff]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Hunter Rank & XP */}
      {collapsed ? (
        <div className="mx-auto mt-3 flex flex-col items-center gap-1.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-black"
            style={{
              borderColor: `${rankInfo.color}60`,
              color: rankInfo.color,
              boxShadow: `0 0 10px ${rankInfo.glowColor}, inset 0 0 8px ${rankInfo.glowColor}`,
              background: `rgba(0,0,0,0.5)`,
            }}
          >
            <Swords className="h-4 w-4" style={{ color: rankInfo.color, filter: `drop-shadow(0 0 4px ${rankInfo.color})` }} />
          </div>
          <span
            className="font-mono text-[9px] font-black"
            style={{ color: rankInfo.color, textShadow: `0 0 6px ${rankInfo.glowColor}` }}
          >
            {xp.toLocaleString()}
          </span>
        </div>
      ) : (
        <div className="mx-3 mt-3 rounded-lg border border-[#00d4ff]/15 bg-[rgba(5,10,25,0.8)] p-3">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center rounded border"
                style={{
                  borderColor: `${rankInfo.color}60`,
                  boxShadow: `0 0 8px ${rankInfo.glowColor}, inset 0 0 8px ${rankInfo.glowColor}`,
                  background: `rgba(0,0,0,0.5)`,
                }}
              >
                <Swords className="h-3.5 w-3.5" style={{ color: rankInfo.color, filter: `drop-shadow(0 0 3px ${rankInfo.color})` }} />
              </div>
              <div className="flex flex-col">
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{ color: rankInfo.color }}
                >
                  {rankInfo.label}
                </span>
                <span
                  className="font-mono text-[10px] font-black"
                  style={{ color: rankInfo.color, textShadow: `0 0 8px ${rankInfo.glowColor}` }}
                >
                  {xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#00d4ff]/60">
              {xpInRank} / {xpForNextRank} XP
            </span>
            {nextRank ? (
              <span
                className="text-[10px] font-mono"
                style={{ color: nextRank.color }}
              >
                NEXT: {nextRank.rank}
              </span>
            ) : (
              <span className="text-[10px] font-mono text-amber-400">
                MAX RANK
              </span>
            )}
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#0a1628] border border-[#00d4ff]/10">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: `linear-gradient(90deg, ${rankInfo.color}, ${nextRank?.color ?? rankInfo.color})`,
                boxShadow: `0 0 6px ${rankInfo.glowColor}`,
              }}
              initial={{ width: 0 }}
              animate={{ width: `${rankPercent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}

      {/* Navigation Header */}
      {!collapsed ? (
        <div className="mx-3 mt-4 mb-1">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#00d4ff]/40">
            NAVIGATION
          </span>
        </div>
      ) : null}

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 p-3 pt-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded px-3 py-2.5 text-xs font-semibold tracking-wider transition-all duration-200",
                isActive
                  ? "text-[#00d4ff]"
                  : "text-gray-500 hover:bg-[#00d4ff]/5 hover:text-gray-300",
                collapsed && "justify-center px-2"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded border-l-2 border-[#00d4ff] bg-[#00d4ff]/5"
                    style={{
                      boxShadow: "inset 4px 0 8px -4px rgba(0, 212, 255, 0.3)",
                    }}
                    transition={{
                      type: "spring",
                      bounce: 0.2,
                      duration: 0.6,
                    }}
                  />
                ) : null}
                <item.icon
                  className={cn(
                    "relative h-[18px] w-[18px]",
                    isActive && "text-[#00d4ff]"
                  )}
                />
                {!collapsed ? (
                  <span className="relative font-mono">{item.label}</span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Hunter Info Header */}
      {!collapsed ? (
        <div className="mx-3 mb-1">
          <span className="text-[10px] font-bold tracking-[0.15em] text-[#00d4ff]/40">
            HUNTER INFO
          </span>
        </div>
      ) : null}

      {/* User Card + Logout */}
      <div className="border-t border-[#00d4ff]/10 p-3">
        {!collapsed ? (
          <div className="mb-2 flex items-center gap-3 rounded-lg border border-[#00d4ff]/15 bg-[rgba(5,10,25,0.8)] p-3">
            <div className="relative">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold"
                style={{
                  borderColor: rankInfo.color,
                  color: rankInfo.color,
                  background: "rgba(0,0,0,0.5)",
                }}
              >
                {user?.full_name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div
                className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full border border-[rgba(5,10,25,0.95)] text-[6px] font-black"
                style={{
                  backgroundColor: rankInfo.color,
                  color: "#050a15",
                }}
              >
                {rankInfo.rank}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-200">
                {user?.full_name ?? "Hunter"}
              </p>
              <p className="truncate text-xs text-gray-600 font-mono">
                {user?.email}
              </p>
            </div>
          </div>
        ) : null}

        <button
          onClick={logout}
          className={cn(
            "flex w-full items-center gap-3 rounded px-3 py-2.5 text-xs font-semibold tracking-wider text-red-400/70 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400",
            collapsed && "justify-center px-2"
          )}
        >
          <LogOut className="h-[18px] w-[18px]" />
          {!collapsed ? <span className="font-mono">LOGOUT</span> : null}
        </button>
      </div>
    </aside>
  );
}
