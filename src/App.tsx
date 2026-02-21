import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AreaDetail from "./pages/AreaDetail";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SimuladorPro from "./pages/SimuladorPro";
import Marketing from "./pages/Marketing";
import Certificaciones from "./pages/Certificaciones";
import AITutor from "./components/AITutor";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";
import PWAStatusBar from "./components/PWAStatusBar";
import { useNotifications } from "./hooks/useNotifications";
import { useSync } from "./hooks/useSync";
import { useOfflineCache } from "./hooks/useOfflineCache";
import { AchievementObserver } from "./components/AchievementObserver";

/** Routes starting with /~oauth are handled by Lovable Cloud infrastructure */
const OAuthPassthrough = () => {
  // Force a full-page navigation so the request reaches the server
  window.location.reload();
  return null;
};

/**
 * StreakAutoSync — invisible component that:
 * 1. Updates streak count when user studies today
 * 2. Triggers streak notifications
 * 3. Syncs progress automatically
 * 4. Caches viewed pages for offline
 */
const StreakAutoSync = () => {
  const { showStreakNotification, permission } = useNotifications();
  const { syncProgress, syncStreak } = useSync();
  const { cacheCurrentPage } = useOfflineCache();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const lastDate = localStorage.getItem("last_study_date");
    const currentStreak = parseInt(localStorage.getItem("study_streak_count") || "0");

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (lastDate === yesterdayStr) {
        // Continued streak!
        const newStreak = currentStreak + 1;
        localStorage.setItem("study_streak_count", String(newStreak));
        localStorage.setItem("last_study_date", today);
        // Congratulate on milestones
        if (permission === "granted" && (newStreak % 5 === 0 || newStreak === 3)) {
          showStreakNotification(newStreak, "congrats");
        }
        syncStreak();
      } else if (lastDate && lastDate !== today) {
        // Streak broken
        if (permission === "granted" && currentStreak > 2) {
          showStreakNotification(currentStreak, "lost");
        }
        localStorage.setItem("study_streak_count", "1");
        localStorage.setItem("last_study_date", today);
        syncStreak();
      } else {
        // First visit ever
        localStorage.setItem("study_streak_count", "1");
        localStorage.setItem("last_study_date", today);
      }
    }

    // Sync progress 5s after app load
    const syncTimeout = setTimeout(() => {
      syncProgress();
    }, 5000);

    // Cache current page for offline
    cacheCurrentPage();

    return () => clearTimeout(syncTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
};


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AITutor />
          <StreakAutoSync />
          <AchievementObserver />
          <PWAInstallBanner />
          <PWAStatusBar />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/area/:areaId" element={<ProtectedRoute><AreaDetail /></ProtectedRoute>} />
            <Route path="/simulador-pro" element={<ProtectedRoute><SimuladorPro /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="/certificaciones" element={<ProtectedRoute><Certificaciones /></ProtectedRoute>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/~oauth/*" element={<OAuthPassthrough />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
