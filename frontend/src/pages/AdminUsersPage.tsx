import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import api from "../services/api";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_verified: boolean;
  is_admin: boolean;
  created_at: string;
  habits_count: number;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUsers = async (query?: string) => {
    setIsLoading(true);
    try {
      const params: Record<string, string> = {};
      if (query) params.search = query;
      const { data } = await api.get<AdminUser[]>("/admin/users", { params });
      setUsers(data);
    } catch {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = () => {
    fetchUsers(search);
  };

  const handleToggleActive = async (userId: number, isActive: boolean) => {
    await api.put(`/admin/users/${userId}`, { is_active: !isActive });
    await fetchUsers(search);
  };

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm("Delete this user? This cannot be undone.");
    if (!confirmed) return;
    await api.delete(`/admin/users/${userId}`);
    await fetchUsers(search);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-400 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Admin
      </Link>

      <h1 className="text-gradient text-2xl font-bold">User Management</h1>

      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSearch(); }}
          />
        </div>
        <Button onClick={handleSearch}>
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      {isLoading ? (
        <div className="flex h-32 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary-500" />
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-primary-500/10 bg-surface-300/50">
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Habits</th>
                <th className="px-4 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-gray-500">Joined</th>
                <th className="px-4 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-primary-500/5 last:border-0 hover:bg-primary-500/5 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-200">{user.full_name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      user.is_active
                        ? "bg-neon-green/10 text-neon-green"
                        : "bg-red-500/10 text-red-400"
                    }`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-300">{user.habits_count}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="rounded-lg px-2.5 py-1 text-xs font-semibold text-primary-400 hover:bg-primary-500/10 transition-colors"
                        onClick={() => handleToggleActive(user.id, user.is_active)}
                      >
                        {user.is_active ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        className="rounded-lg p-1.5 text-red-400 hover:bg-red-500/10 transition-colors"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 ? (
            <p className="py-8 text-center text-sm text-gray-500">No users found</p>
          ) : null}
        </div>
      )}
    </motion.div>
  );
}
