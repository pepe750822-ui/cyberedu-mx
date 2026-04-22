import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy-loaded pages
const Index = lazy(() => import("./pages/Index"));
const AreaDetail = lazy(() => import("./pages/AreaDetail"));
const Auth = lazy(() => import("./pages/Auth"));
const Tokens = lazy(() => import("./pages/Tokens"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminMonitoring = lazy(() => import("./pages/AdminMonitoring"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SimuladorPro = lazy(() => import("./pages/SimuladorPro"));
const Marketing = lazy(() => import("./pages/Marketing"));
const Certificaciones = lazy(() => import("./pages/Certificaciones"));
const Reportes = lazy(() => import("./pages/Reportes"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPostDetail = lazy(() => import("./pages/BlogPostDetail"));
const Modalidades = lazy(() => import("./pages/Modalidades"));
const Sugerencias = lazy(() => import("./pages/Sugerencias"));
const PromoEcoems = lazy(() => import("./pages/PromoEcoems"));
const AITutor = lazy(() => import("./components/AITutor"));
const AdminAnalytics = lazy(() => import("./components/AdminAnalytics"));
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
  return (
    <Suspense fallback={null}>
      <AITutor />
      {user && <StreakAutoSync />}
      {user && <AchievementObserver />}
    </Suspense>
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
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/area/:areaId" element={<AreaDetail />} />
              <Route path="/simulador-pro" element={<SimuladorPro />} />
              <Route path="/promo-ecoems" element={<PromoEcoems />} />
              <Route path="/marketing" element={<ProtectedRoute><Marketing /></ProtectedRoute>} />
              <Route path="/certificaciones" element={<ProtectedRoute><Certificaciones /></ProtectedRoute>} />
              <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPostDetail />} />
              <Route path="/modalidades" element={<ProtectedRoute><Modalidades /></ProtectedRoute>} />
              <Route path="/sugerencias" element={<Sugerencias />} />
              <Route path="/subscription" element={<Navigate to="/tokens" replace />} />
              <Route path="/tokens" element={<Tokens />} />
              <Route path="/admin/monitoring" element={<ProtectedRoute><AdminMonitoring /></ProtectedRoute>} />
              <Route path="/admin/analytics" element={<ProtectedRoute><AdminAnalytics /></ProtectedRoute>} />
              <Route path="/master-admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
