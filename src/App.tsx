
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Simulation from "./pages/Simulation";
import Login from "./pages/Login";
import Members from "./pages/Members";
import Assets from "./pages/Assets";
import Onboarding from "./pages/Onboarding";
import OnboardingChat from "./pages/OnboardingChat";
import ScheduleConsultant from "./pages/ScheduleConsultant";
import DocumentCollection from "./pages/DocumentCollection";
import DocumentOpening from "./pages/DocumentOpening";
import Documents from "./pages/Documents";
import NotFound from "./pages/NotFound";

// Create a route guard component for protected routes
const ProtectedRoute = ({ component: Component }) => {
  // Check if the user has completed the holding setup
  const isSetupCompleted = localStorage.getItem('holdingSetupCompleted') === 'true';
  
  // If not completed, redirect to the document opening page
  if (!isSetupCompleted) {
    return <Navigate to="/document-opening" />;
  }
  
  return <Component />;
};

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
          
          {/* New document opening flow */}
          <Route path="/document-opening" element={<DocumentOpening />} />
          <Route path="/document-collection" element={<DocumentCollection />} />
          
          {/* Protected routes - only accessible after holding setup is complete */}
          <Route path="/members" element={<Members />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/assets" element={<Assets />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
