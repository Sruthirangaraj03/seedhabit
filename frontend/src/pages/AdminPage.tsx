import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Layers, CheckCircle, Activity, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";

interface PlatformStats {
  total_users: number;
  active_users_7d: number;
  total_habits: number;
  total_completions: number;
}

export function AdminPage() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get<PlatformStats>("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: stats?.total_users ?? 0, icon: Users, text: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Active (7d)", value: stats?.active_users_7d ?? 0, icon: Activity, text: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Total Habits", value: stats?.total_habits ?? 0, icon: Layers, text: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Completions", value: stats?.total_completions ?? 0, icon: CheckCircle, text: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-gradient text-2xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}>
                <card.icon className={`h-5 w-5 ${card.text}`} />
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Link
        to="/admin/users"
        className="inline-flex items-center gap-2 rounded-xl bg-primary-500/10 border border-primary-500/20 px-4 py-2.5 text-sm font-semibold text-primary-400 hover:bg-primary-500/20 transition-all"
      >
        <Users className="h-4 w-4" />
        Manage Users
      </Link>
    </motion.div>
  );
}
