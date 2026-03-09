import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CelebrationModal } from "./components/ui/CelebrationModal";
import { useXPContext } from "./context/XPContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { HabitDetailPage } from "./pages/HabitDetailPage";
import { HabitNewPage } from "./pages/HabitNewPage";
import { HabitEditPage } from "./pages/HabitEditPage";
// ProfilePage merged into SettingsPage
import { SettingsPage } from "./pages/SettingsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AdminPage } from "./pages/AdminPage";
import { AdminUsersPage } from "./pages/AdminUsersPage";

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requireAdmin>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

export default function App() {
  const { showCelebration, closeCelebration } = useXPContext();

  return (
    <>
    <CelebrationModal open={showCelebration} onClose={closeCelebration} />
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedLayout>
            <DashboardPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/habits"
        element={
          <ProtectedLayout>
            <HabitsPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/habits/new"
        element={
          <ProtectedLayout>
            <HabitNewPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/habits/:id"
        element={
          <ProtectedLayout>
            <HabitDetailPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/habits/:id/edit"
        element={
          <ProtectedLayout>
            <HabitEditPage />
          </ProtectedLayout>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedLayout>
            <HistoryPage />
          </ProtectedLayout>
        }
      />
      <Route path="/profile" element={<Navigate to="/settings" replace />} />
      <Route
        path="/settings"
        element={
          <ProtectedLayout>
            <SettingsPage />
          </ProtectedLayout>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <AdminPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUsersPage />
          </AdminLayout>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
    </>
  );
}
