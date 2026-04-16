import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import AreaDetail from "./pages/AreaDetail";
import Auth from "./pages/Auth";
import Tokens from "./pages/Tokens";
import Admin from "./pages/Admin";
import AdminMonitoring from "./pages/AdminMonitoring";
import NotFound from "./pages/NotFound";
import SimuladorPro from "./pages/SimuladorPro";
import Marketing from "./pages/Marketing";
import Certificaciones from "./pages/Certificaciones";
import Reportes from "./pages/Reportes";
import Blog from "./pages/Blog";
import BlogPostDetail from "./pages/BlogPostDetail";
import Modalidades from "./pages/Modalidades";
import Sugerencias from "./pages/Sugerencias";
import AITutor from "./components/AITutor";
import AdminAnalytics from "./components/AdminAnalytics";
import { ProtectedRoute } from "./components/ProtectedRoute";
import PWAInstallBanner from "./components/PWAInstallBanner";
import PWAStatusBar from "./components/PWAStatusBar";
import { useNotifications } from "./hooks/useNotifications";
import { useSync } from "./hooks/useSync";
import { useOfflineCache } from "./hooks/useOfflineCache";
import { AchievementObserver } from "./components/AchievementObserver";
import { usePageView } from "./hooks/useAnalytics";
import GlobalAnnouncementBanner from "./components/GlobalAnnouncementBanner";
import WhatsAppButton from "./components/WhatsAppButton";

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

/** Tracks page views on every route change */
const PageViewTracker = () => {
  usePageView();
  return null;
};

const AuthenticatedStudyTools = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <>
      <AITutor />
      <StreakAutoSync />
      <AchievementObserver />
    </>
  );
};

// Prevent ref warnings - these are plain functional components rendered directly, not via forwardRef
// The warnings come from React internals when components return null inside fragments

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <GlobalAnnouncementBanner />
          <PageViewTracker />
          <AuthenticatedStudyTools />
          <PWAInstallBanner />
          <PWAStatusBar />
          <WhatsAppButton />
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/area/:areaId" element={<ProtectedRoute><AreaDetail /></ProtectedRoute>} />
            <Route path="/simulador-pro" element={<ProtectedRoute><SimuladorPro /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
            <Route path="/certificaciones" element={<ProtectedRoute><Certificaciones /></ProtectedRoute>} />
            <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPostDetail />} />
            <Route path="/modalidades" element={<ProtectedRoute><Modalidades /></ProtectedRoute>} />
            <Route path="/sugerencias" element={<ProtectedRoute><Sugerencias /></ProtectedRoute>} />
            <Route path="/subscription" element={<Navigate to="/tokens" replace />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/admin/monitoring" element={<ProtectedRoute><AdminMonitoring /></ProtectedRoute>} />
            <Route path="/master-admin" element={<Admin />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
