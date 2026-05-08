import { useEffect, useState, lazy, Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "./components/LoadingSpinner";
import { Bot } from "lucide-react";

import { shouldLoadDirect } from "./utils/deviceDetect";

// Lazy-loaded pages for performance
const Index = lazy(() => import("./pages/Index"));
const AreaDetail = lazy(() => import("./pages/AreaDetail"));
const AITutor = lazy(() => import("./components/AITutor"));
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
const LandingPage = lazy(() => import("./pages/LandingPage"));
const PromoEcoems = lazy(() => import("./pages/PromoEcoems"));
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
import TelegramButton from "./components/TelegramButton";
import ExamCountdown from "./components/ExamCountdown";
import { PendingResultSync } from "./components/PendingResultSync";


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

const OnboardingModal = lazy(() => import("./components/OnboardingModal"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminResumen = lazy(() => import("./pages/AdminResumen"));

const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return user?.email === "pepe750822@gmail.com"
    ? <AdminDashboard />
    : <Navigate to="/" replace />;
};

const AdminResumenRoute = () => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner />;
  return user?.email === "pepe750822@gmail.com"
    ? <AdminResumen />
    : <Navigate to="/" replace />;
};

const AuthenticatedStudyTools = () => {
  const { user, profile } = useAuth();
  const [tutorOpen, setTutorOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setTutorOpen(true);
    const handleClose = () => setTutorOpen(false);
    window.addEventListener('cyberedu:opened', handleOpen);
    window.addEventListener('cyberedu:closed', handleClose);
    return () => {
      window.removeEventListener('cyberedu:opened', handleOpen);
      window.removeEventListener('cyberedu:closed', handleClose);
    };
  }, []);

  const showOnboarding =
    !!user &&
    !!profile &&
    profile.onboarding_completed === false &&
    !localStorage.getItem("cyberedu_onboarding_done");

  return (
    <Suspense fallback={null}>
      <AITutor />
      {user && !tutorOpen && (
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('cyberedu:open-chat'))}
          className="fixed bottom-6 right-6 z-40 bg-violet-600 hover:bg-violet-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:shadow-violet-500/25 transition-all hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-300"
        >
          <Bot className="h-7 w-7" />
        </button>
      )}
      <PendingResultSync />
      {user && <StreakAutoSync />}
      {user && <AchievementObserver />}
      {showOnboarding && <OnboardingModal />}
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
          <ExamCountdown />
          <PageViewTracker />
          <AuthenticatedStudyTools />
          <PWAInstallBanner />
          <PWAStatusBar />
          <TelegramButton />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/area/:areaId" element={<AreaDetail />} />
              <Route path="/simulador-pro" element={<SimuladorPro />} />
              <Route path="/landing" element={<LandingPage />} />
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
              <Route path="/admin" element={<AdminRoute />} />
              <Route path="/admin/resumen" element={<AdminResumenRoute />} />
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
    <Analytics />
  </QueryClientProvider>
);

export default App;
