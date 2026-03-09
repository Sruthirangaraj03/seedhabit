import { useState, type FormEvent } from "react";
import { Mail, Save, Camera, Shield, Calendar, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useXPContext } from "../context/XPContext";
import { authService } from "../services/authService";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import type { User } from "../types/user";

export function ProfilePage() {
  const { user } = useAuth();
  const { level } = useXPContext();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

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
      await authService.updateProfile({ full_name: fullName } as Partial<User>);
      setSuccessMessage("Profile updated successfully.");
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
      className="mx-auto max-w-3xl space-y-6"
    >
      <div>
        <h1 className="text-gradient text-2xl font-bold">Profile</h1>
        <p className="mt-0.5 text-sm text-gray-500">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="glass rounded-xl p-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          <div className="relative">
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.full_name}
                className="h-20 w-20 rounded-2xl object-cover ring-2 ring-primary-500/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-neon-purple text-xl font-bold text-white shadow-lg shadow-primary-500/20">
                {initials}
              </div>
            )}
            <button
              type="button"
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface-300 shadow-md transition-colors hover:bg-primary-500/20"
              aria-label="Change avatar"
            >
              <Camera className="h-3.5 w-3.5 text-gray-400" />
            </button>
          </div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg font-bold text-white">
              {user?.full_name || "User"}
            </h3>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 px-2.5 py-0.5 text-xs font-bold text-primary-400">
                <Zap className="h-3 w-3" />
                Level {level}
              </span>
              {user?.is_verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-neon-green/10 px-2.5 py-0.5 text-xs font-medium text-neon-green">
                  <Shield className="h-3 w-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                  Unverified
                </span>
              )}
              {user?.oauth_provider ? (
                <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 capitalize">
                  {user.oauth_provider}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="glass rounded-xl p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Edit Profile</h3>

        {successMessage ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 rounded-xl bg-neon-green/10 p-3 text-sm text-neon-green"
          >
            {successMessage}
          </motion.div>
        ) : null}

        {error ? (
          <div className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-400">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              helperText="Email cannot be changed"
            />
            <Mail className="absolute right-3 top-9 h-4 w-4 text-gray-600" />
          </div>

          <div className="flex justify-end">
            <Button type="submit" isLoading={isLoading}>
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="glass rounded-xl p-6">
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Account Information</h3>
        <div className="divide-y divide-primary-500/10">
          <div className="flex items-center gap-3 py-3">
            <Mail className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-300">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Member Since</p>
              <p className="text-sm font-medium text-gray-300">{memberSince}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Shield className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-xs text-gray-500">Status</p>
              <p className="text-sm font-medium text-gray-300">{user?.is_active ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
