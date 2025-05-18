
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import PublicLayout from "@/layouts/PublicLayout";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  const location = useLocation();
  
  // Never redirect if we're on the home page
  if (location.pathname === "/") {
    return (
      <PublicLayout>
        <Outlet />
      </PublicLayout>
    );
  }
  
  // If logged in and completed onboarding, redirect to dashboard
  if (isLoggedIn && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If logged in but not completed onboarding, redirect to appropriate step
  if (isLoggedIn && !hasCompletedOnboarding) {
    const currentStep = localStorage.getItem('onboardingStep') || 'selection';
    
    // Map steps to routes
    const stepRoutes: Record<string, string> = {
      'selection': '/onboarding',
      'chat': '/onboarding/chat',
      'schedule': '/onboarding/schedule',
      'documents': '/members',
      'review': '/document-review'
    };
    
    const redirectTo = stepRoutes[currentStep] || '/onboarding';
    return <Navigate to={redirectTo} replace />;
  }
  
  // If not logged in, render the public route with public layout
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
