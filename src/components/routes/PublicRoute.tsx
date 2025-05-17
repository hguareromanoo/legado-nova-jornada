
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import PublicLayout from "@/layouts/PublicLayout";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  
  // If logged in and completed onboarding, redirect to dashboard
  if (isLoggedIn && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If logged in but not completed onboarding, redirect to appropriate onboarding step
  if (isLoggedIn && !hasCompletedOnboarding) {
    const currentStep = localStorage.getItem('onboardingStep') || 'selection';
    
    // Map steps to routes
    const stepRoutes: Record<string, string> = {
      'selection': '/onboarding',
      'chat': '/onboarding/chat',
      'schedule': '/onboarding/schedule',
      'documents': '/document-collection',
      'review': '/document-review'
    };
    
    const redirectTo = stepRoutes[currentStep] || '/document-collection';
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
