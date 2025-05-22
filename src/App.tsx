
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { OnboardingProvider } from "./contexts/OnboardingContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ProtectedRoute, PublicRoute, OnboardingRoute, ConsultantRoute } from "./components/routes";

// Public Pages
import Index from "./pages/Index";
import SimulationIntro from "./pages/SimulationIntro";
import Simulation from "./pages/Simulation";
import SimulationReport from "./pages/SimulationReport"; 
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import NotFound from "./pages/NotFound";
import Cadastro from "./pages/Cadastro";

// Onboarding Flow
import OnboardingSelection from "./pages/onboarding/OnboardingSelection";
import OnboardingChat from "./pages/onboarding/OnboardingChat";
import HoldingSetup from "./pages/HoldingSetup";

// Human Onboarding Flow
import HumanConfirmation from "./pages/onboarding/human/Confirmation";
import HumanPortal from "./pages/onboarding/human/Portal";
import PlanApproval from "./pages/onboarding/human/PlanApproval";
import Schedule from "./pages/onboarding/human/Schedule"; 

// Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import Documents from "./pages/dashboard/Documents";
import Assets from "./pages/Assets";
import Structure from "./pages/dashboard/Structure";
import Assistant from "./pages/dashboard/Assistant";
import Members from "./pages/Members";

// Consultant Pages
import Consultant from "./pages/consultant/Consultant";
import Clients from "./pages/consultant/Clients";
import ClientDetail from "./pages/consultant/ClientDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <OnboardingProvider>
        <ChatProvider>
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
                  <Route path="/simulation-report" element={<SimulationReport />} /> 
                  <Route path="/login" element={<Login />} />
                  <Route path="/cadastro" element={<Cadastro />} />
                  <Route path="/welcome" element={<Welcome />} />
                </Route>
                
                {/* Onboarding Routes - Accessible only during onboarding process */}
                <Route element={<OnboardingRoute />}>
                  <Route path="/onboarding" element={<OnboardingSelection />} />
                  <Route path="/onboarding/chat" element={<OnboardingChat />} />
                  
                  {/* Human Touch Onboarding Flow */}
                  <Route path="/onboarding/human/schedule" element={<Schedule />} /> 
                  <Route path="/onboarding/human/confirmation" element={<HumanConfirmation />} />
                  <Route path="/onboarding/human/portal" element={<HumanPortal />} />
                  <Route path="/onboarding/human/plan-approval" element={<PlanApproval />} />
                  
                  {/* Add the Members route to the OnboardingRoute group as well to make it accessible during onboarding */}
                  <Route path="/members" element={<Members />} />
                  
                  {/* Route for HoldingSetup */}
                  <Route path="/holding-setup" element={<HoldingSetup />} />
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
                
                {/* Consultant Routes - Only accessible to consultants */}
                <Route element={<ConsultantRoute />}>
                  <Route path="/consultant" element={<Consultant />} />
                  <Route path="/consultant/clients" element={<Clients />} />
                  <Route path="/consultant/clients/:clientId" element={<ClientDetail />} />
                </Route>
                
                {/* Legacy route redirects */}
                <Route path="/document-collection" element={<Navigate to="/members" replace />} />
                <Route path="/document-opening" element={<Navigate to="/members" replace />} />
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ChatProvider>
      </OnboardingProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
