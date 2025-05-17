
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import DashboardLayout from "@/layouts/DashboardLayout";

const ProtectedRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();

  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in but onboarding not complete, redirect to appropriate step
  if (!hasCompletedOnboarding) {
    // Get the current onboarding step from localStorage or context
    const currentStep = localStorage.getItem('onboardingStep') || 'selection';
    
    // Map steps to routes
    const stepRoutes: Record<string, string> = {
      'selection': '/onboarding',
      'chat': '/onboarding/chat',
      'documents': '/members',
      'review': '/document-review'
    };
    
    const redirectTo = stepRoutes[currentStep] || '/onboarding';
    return <Navigate to={redirectTo} replace />;
  }
  
  // If logged in and onboarding complete, render the protected route with dashboard layout
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
