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
import AITutor from "./components/AITutor";

/** Routes starting with /~oauth are handled by Lovable Cloud infrastructure */
const OAuthPassthrough = () => {
  // Force a full-page navigation so the request reaches the server
  window.location.reload();
  return null;
};


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AITutor />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/area/:areaId" element={<AreaDetail />} />
            <Route path="/simulador-pro" element={<SimuladorPro />} />
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
