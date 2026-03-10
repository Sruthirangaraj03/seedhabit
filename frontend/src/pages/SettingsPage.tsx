import { useState, type FormEvent } from "react";
import { Mail, Save, Camera, Shield, Calendar, Zap, LogOut, Pen } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useXPContext } from "../context/XPContext";
import { authService } from "../services/authService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { User as UserType } from "../types/user";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { xp, rankInfo, nextRank, xpInRank, xpForNextRank, rankPercent } = useXPContext();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);

  const initials = user?.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (!fullName.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setIsLoading(true);

    try {
      await authService.updateProfile({ full_name: fullName } as Partial<UserType>);
      setSuccessMessage("Profile updated!");
      setEditMode(false);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      setError("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8 pb-10"
    >
      {/* ─── HUNTER PROFILE ─── */}
      <div className="overflow-hidden rounded-lg border border-[#00d4ff]/20 bg-[#0a1628]/80 shadow-[0_0_30px_rgba(0,212,255,0.08)] backdrop-blur-md">
        {/* Cover: Dark system banner with cyan grid */}
        <div className="relative h-28 bg-[#060e1a]">
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Subtle glow at top */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#00d4ff]/5 to-transparent" />
          {/* System label */}
          <div className="absolute left-6 top-4 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00d4ff]/40">
            [ HUNTER PROFILE ]
          </div>
        </div>

        <div className="relative px-6 pb-6">
          {/* Avatar overlapping cover with rank border glow */}
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-20 w-20 rounded-lg object-cover"
                  style={{
                    border: `3px solid ${rankInfo.color}`,
                    boxShadow: `0 0 15px ${rankInfo.glowColor}, 0 0 30px ${rankInfo.glowColor}`,
                  }}
                />
              ) : (
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-lg bg-[#0a1628] text-2xl font-black text-white"
                  style={{
                    border: `3px solid ${rankInfo.color}`,
                    boxShadow: `0 0 15px ${rankInfo.glowColor}, 0 0 30px ${rankInfo.glowColor}`,
                  }}
                >
                  {initials}
                </div>
              )}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-md border border-[#00d4ff]/30 bg-[#0a1628] shadow-md transition-colors hover:bg-[#00d4ff]/10"
                aria-label="Change avatar"
              >
                <Camera className="h-3 w-3 text-[#00d4ff]" />
              </button>
              {/* Rank badge */}
              <div
                className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-md text-[10px] font-black"
                style={{
                  backgroundColor: rankInfo.color,
                  color: rankInfo.rank === "E" ? "#fff" : "#000",
                  boxShadow: `0 0 10px ${rankInfo.glowColor}`,
                }}
              >
                {rankInfo.rank}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1.5 rounded-lg border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#00d4ff] transition-colors hover:bg-[#00d4ff]/10"
              >
                <Pen className="h-3 w-3" />
                {editMode ? "Cancel" : "Edit"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ef4444] transition-colors hover:bg-[#ef4444]/10"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          </div>

          {/* Name & Email */}
          <div className="mb-5">
            <h2 className="text-xl font-black text-white">{user?.full_name || "Hunter"}</h2>
            <p className="font-mono text-xs text-[#00d4ff]/50">{user?.email}</p>
          </div>

          {/* ─── HUNTER STATUS ─── */}
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00d4ff]/40">
            Hunter Status
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {/* RANK */}
            <div className="rounded-lg border border-[#00d4ff]/10 bg-[#060e1a]/60 p-3">
              <div className="flex items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black"
                  style={{
                    backgroundColor: `${rankInfo.color}15`,
                    color: rankInfo.color,
                  }}
                >
                  {rankInfo.rank}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/40">Rank</p>
                  <p className="text-sm font-black" style={{ color: rankInfo.color }}>
                    {rankInfo.label.replace(" Hunter", "")}
                  </p>
                </div>
              </div>
            </div>

            {/* POWER (XP) */}
            <div className="rounded-lg border border-[#00d4ff]/10 bg-[#060e1a]/60 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00d4ff]/10">
                  <Zap className="h-4 w-4 text-[#00d4ff]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/40">Power</p>
                  <p className="text-lg font-black text-[#00d4ff]">{xp.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* AWAKENED (Joined) */}
            <div className="rounded-lg border border-[#00d4ff]/10 bg-[#060e1a]/60 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed]/10">
                  <Calendar className="h-4 w-4 text-[#7c3aed]" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/40">Awakened</p>
                  <p className="text-sm font-bold text-white">{memberSince}</p>
                </div>
              </div>
            </div>

            {/* STATUS */}
            <div className="rounded-lg border border-[#00d4ff]/10 bg-[#060e1a]/60 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Shield className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/40">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                    <p className="text-sm font-bold text-white">{user?.is_active ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─── RANK PROGRESS ─── */}
          <div className="mt-4 rounded-lg border border-[#00d4ff]/10 bg-[#060e1a]/60 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#00d4ff]/40">
                Rank Progress {nextRank ? `\u2192 ${nextRank.label}` : "[ MAX RANK ]"}
              </span>
              <span className="font-mono text-[10px] font-medium text-[#00d4ff]/60">
                {xpInRank.toLocaleString()} / {xpForNextRank.toLocaleString()} XP
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#0a1628]">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(to right, ${rankInfo.color}, ${nextRank ? nextRank.color : rankInfo.color})`,
                  boxShadow: `0 0 10px ${rankInfo.glowColor}`,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${rankPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Badges */}
          {(user?.is_verified || user?.oauth_provider) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {user?.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  <Shield className="h-3 w-3" />
                  Verified Hunter
                </span>
              )}
              {user?.oauth_provider && (
                <span className="inline-flex items-center gap-1 rounded-md border border-[#00d4ff]/20 bg-[#00d4ff]/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider capitalize text-[#00d4ff]">
                  <Mail className="h-3 w-3" />
                  {user.oauth_provider} Linked
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── MODIFY HUNTER DATA (collapsible) ─── */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-[#00d4ff]/20 bg-[#0a1628]/80 p-6 backdrop-blur-md"
        >
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-[#00d4ff]/40">
            [ System ]
          </div>
          <h3 className="mb-5 text-sm font-black uppercase tracking-wider text-[#00d4ff]"
            style={{ textShadow: "0 0 10px rgba(0,212,255,0.3)" }}
          >
            Modify Hunter Data
          </h3>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-2.5 font-mono text-sm font-medium text-emerald-400"
            >
              [SYSTEM] {successMessage}
            </motion.div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-[#ef4444]/20 bg-[#ef4444]/10 px-4 py-2.5 font-mono text-sm font-medium text-[#ef4444]">
              [ERROR] {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your hunter name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
              <div className="relative">
                <Input
                  label="Email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  helperText="Cannot be modified"
                />
                <Mail className="absolute right-3 top-9 h-4 w-4 text-[#00d4ff]/30" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setEditMode(false); setFullName(user?.full_name || ""); }}
                className="rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-wider text-gray-500 transition-colors hover:bg-[#00d4ff]/5 hover:text-[#00d4ff]"
              >
                Cancel
              </button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                Save Data
              </Button>
            </div>
          </form>
        </motion.div>
      )}

    </motion.div>
  );
}
