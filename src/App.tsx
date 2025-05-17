
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import Members from "./pages/Members";
import Assets from "./pages/Assets";
import Onboarding from "./pages/Onboarding";
import OnboardingChat from "./pages/OnboardingChat";
import ScheduleConsultant from "./pages/ScheduleConsultant";
import DocumentCollection from "./pages/DocumentCollection";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/simulation" element={<Simulation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/onboarding/chat" element={<OnboardingChat />} />
          <Route path="/onboarding/schedule" element={<ScheduleConsultant />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/document-collection" element={<DocumentCollection />} />
          <Route path="/members" element={<Members />} />
          <Route path="/assets" element={<Assets />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
