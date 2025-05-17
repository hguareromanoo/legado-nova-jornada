
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ProtectedRoute, PublicRoute, OnboardingRoute } from "./components/routes";

// Public Pages
import Index from "./pages/Index";
import SimulationIntro from "./pages/SimulationIntro";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Cadastro from "./pages/Cadastro";

// Onboarding Flow
import OnboardingSelection from "./pages/onboarding/OnboardingSelection";
import OnboardingChat from "./pages/onboarding/OnboardingChat";
import ScheduleConsultant from "./pages/ScheduleConsultant";
import DocumentCollection from "./pages/onboarding/DocumentCollection";
import DocumentReview from "./pages/onboarding/DocumentReview";

// Human Onboarding Flow
import HumanSchedule from "./pages/onboarding/human/Schedule";
import HumanConfirmation from "./pages/onboarding/human/Confirmation";
import HumanPortal from "./pages/onboarding/human/Portal";
import PlanApproval from "./pages/onboarding/human/PlanApproval";

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import Assets from "./pages/Assets"; // Using the more comprehensive Assets page
import Structure from "./pages/dashboard/Structure";
import Assistant from "./pages/dashboard/Assistant";
import Members from "./pages/Members";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <OnboardingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Index />} />
                <Route path="/simulation" element={<SimulationIntro />} />
                <Route path="/simulation-questions" element={<Simulation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
              </Route>
              
              {/* Onboarding Routes - Accessible only during onboarding process */}
              <Route element={<OnboardingRoute />}>
                <Route path="/onboarding" element={<OnboardingSelection />} />
                <Route path="/onboarding/chat" element={<OnboardingChat />} />
                <Route path="/onboarding/schedule" element={<ScheduleConsultant />} />
                
                {/* Human Touch Onboarding Flow */}
                <Route path="/onboarding/human/schedule" element={<HumanSchedule />} />
                <Route path="/onboarding/human/confirmation" element={<HumanConfirmation />} />
                <Route path="/onboarding/human/portal" element={<HumanPortal />} />
                <Route path="/onboarding/human/plan-approval" element={<PlanApproval />} />
                
                <Route path="/document-collection" element={<DocumentCollection />} />
                <Route path="/document-review" element={<DocumentReview />} />
              </Route>
              
              {/* Dashboard Routes - Protected, only accessible after holding setup */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/members" element={<Members />} />
                <Route path="/structure" element={<Structure />} />
                <Route path="/assistant" element={<Assistant />} />
              </Route>
              
              {/* Legacy route redirect */}
              <Route path="/document-opening" element={<Navigate to="/document-collection" replace />} />
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </OnboardingProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
