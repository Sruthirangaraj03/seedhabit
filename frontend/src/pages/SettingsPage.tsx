import { useState, type FormEvent } from "react";
import { Mail, Save, Camera, Shield, Calendar, Zap, AlertTriangle, LogOut, Pen, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useXPContext } from "../context/XPContext";
import { authService } from "../services/authService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { User as UserType } from "../types/user";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const { level, xp, xpInLevel, xpForNext, xpPercent } = useXPContext();
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

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (confirmed) {
      logout();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-4xl space-y-8 pb-10"
    >
      {/* ─── Profile Header ─── */}
      <div className="glass overflow-hidden rounded-2xl">
        {/* Cover gradient */}
        <div className="relative h-28 bg-gradient-to-r from-primary-600/30 via-neon-purple/20 to-primary-500/30">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.15),transparent_60%)]" />
        </div>

        <div className="relative px-6 pb-6">
          {/* Avatar overlapping cover */}
          <div className="relative -mt-12 mb-4 flex items-end justify-between">
            <div className="relative">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="h-20 w-20 rounded-2xl border-4 border-surface-400 object-cover shadow-xl"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-surface-400 bg-gradient-to-br from-primary-500 to-neon-purple text-2xl font-bold text-white shadow-xl">
                  {initials}
                </div>
              )}
              <button
                type="button"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface-400 bg-surface-300 shadow-md transition-colors hover:bg-primary-500/20"
                aria-label="Change avatar"
              >
                <Camera className="h-3 w-3 text-gray-400" />
              </button>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-1.5 rounded-lg border border-primary-500/20 bg-primary-500/5 px-3 py-1.5 text-xs font-medium text-primary-400 transition-colors hover:bg-primary-500/10"
              >
                <Pen className="h-3 w-3" />
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-3 w-3" />
                Logout
              </button>
            </div>
          </div>

          {/* Name & Email */}
          <div className="mb-5">
            <h2 className="text-xl font-bold text-white">{user?.full_name || "User"}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-primary-500/10 bg-surface-300/30 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/10">
                  <Zap className="h-4 w-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Level</p>
                  <p className="text-lg font-bold text-white">{level}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary-500/10 bg-surface-300/30 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
                  <Zap className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Total XP</p>
                  <p className="text-lg font-bold text-white">{xp.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary-500/10 bg-surface-300/30 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                  <Calendar className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Joined</p>
                  <p className="text-sm font-bold text-white">{memberSince}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary-500/10 bg-surface-300/30 p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
                  <Shield className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Status</p>
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <p className="text-sm font-bold text-white">{user?.is_active ? "Active" : "Inactive"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* XP Progress bar */}
          <div className="mt-4 rounded-xl border border-primary-500/10 bg-surface-300/30 p-3">
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">Progress to Level {level + 1}</span>
              <span className="text-[10px] font-medium text-gray-500">{xpInLevel} / {xpForNext} XP</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-600">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-500 to-neon-purple"
                initial={{ width: 0 }}
                animate={{ width: `${xpPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Badges */}
          {(user?.is_verified || user?.oauth_provider) && (
            <div className="mt-3 flex flex-wrap gap-2">
              {user?.is_verified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
                  <Shield className="h-3 w-3" />
                  Verified Account
                </span>
              )}
              {user?.oauth_provider && (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/5 px-2.5 py-1 text-[11px] font-medium capitalize text-blue-400">
                  <Mail className="h-3 w-3" />
                  {user.oauth_provider} Connected
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─── Edit Profile (collapsible) ─── */}
      {editMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6"
        >
          <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-gray-400">Edit Profile</h3>

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 rounded-lg bg-emerald-500/10 px-4 py-2.5 text-sm font-medium text-emerald-400"
            >
              {successMessage}
            </motion.div>
          )}

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Input
                label="Full Name"
                type="text"
                placeholder="Your full name"
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
                  helperText="Cannot be changed"
                />
                <Mail className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => { setEditMode(false); setFullName(user?.full_name || ""); }}
                className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 transition-colors hover:bg-surface-300/50"
              >
                Cancel
              </button>
              <Button type="submit" isLoading={isLoading}>
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ─── Danger Zone ─── */}
      <div className="rounded-2xl border border-red-500/10 bg-surface-400/40 p-6 backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-400">Delete Account</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              Permanently remove your account, all habits, streaks, and history. This action is irreversible.
            </p>
          </div>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Delete
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
