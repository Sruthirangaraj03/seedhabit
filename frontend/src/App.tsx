import { useState, useCallback } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { Layout } from "./components/layout/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CelebrationModal } from "./components/ui/CelebrationModal";
import { LoadingScreen } from "./components/ui/LoadingScreen";
import { PageTransition } from "./components/ui/PageTransition";
import { StatNotifications } from "./components/ui/StatNotification";
import { useXPContext } from "./context/XPContext";
import { useHunterStatsContext } from "./context/HunterStatsContext";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { DashboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { HabitDetailPage } from "./pages/HabitDetailPage";
import { HabitNewPage } from "./pages/HabitNewPage";
import { HabitEditPage } from "./pages/HabitEditPage";
import { SettingsPage } from "./pages/SettingsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { AchievementsPage } from "./pages/AchievementsPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
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
  const { pendingGains, dismissGain } = useHunterStatsContext();
  const [appReady, setAppReady] = useState(false);
  const location = useLocation();

  const handleLoadingComplete = useCallback(() => {
    setAppReady(true);
  }, []);

  return (
    <>
      {!appReady && <LoadingScreen onComplete={handleLoadingComplete} />}
      <CelebrationModal open={showCelebration} onClose={closeCelebration} />
      <StatNotifications gains={pendingGains} onDismiss={dismissGain} />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public routes */}
          <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
          <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
          <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedLayout>
                <PageTransition><DashboardPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/habits"
            element={
              <ProtectedLayout>
                <PageTransition><HabitsPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/habits/new"
            element={
              <ProtectedLayout>
                <PageTransition><HabitNewPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/habits/:id"
            element={
              <ProtectedLayout>
                <PageTransition><HabitDetailPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/habits/:id/edit"
            element={
              <ProtectedLayout>
                <PageTransition><HabitEditPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedLayout>
                <PageTransition><HistoryPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/achievements"
            element={
              <ProtectedLayout>
                <PageTransition><AchievementsPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedLayout>
                <PageTransition><LeaderboardPage /></PageTransition>
              </ProtectedLayout>
            }
          />
          <Route path="/profile" element={<Navigate to="/settings" replace />} />
          <Route
            path="/settings"
            element={
              <ProtectedLayout>
                <PageTransition><SettingsPage /></PageTransition>
              </ProtectedLayout>
            }
          />

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <AdminLayout>
                <PageTransition><AdminPage /></PageTransition>
              </AdminLayout>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminLayout>
                <PageTransition><AdminUsersPage /></PageTransition>
              </AdminLayout>
            }
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}
