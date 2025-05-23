
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useOnboarding } from "@/contexts/OnboardingContext";
import OnboardingLayout from "@/layouts/OnboardingLayout";

const OnboardingRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  const { currentStep } = useOnboarding();
  const location = useLocation();
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in and completed onboarding, redirect to dashboard
  if (hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Get current path
  const currentPath = location.pathname;
  
  // Map steps to routes
  const stepRoutes: Record<string, string> = {
    'selection': '/onboarding',
    'chat': '/onboarding/chat',
    'documents': '/members'
    // Removed the 'review' route
  };
  
  // Check if we're on the correct path for the current step
  const correctPath = stepRoutes[currentStep];
  console.log('Current onboarding step:', currentStep);
  console.log('Current path:', currentPath);
  console.log('Correct path should be:', correctPath);
  
  // If we're not on the correct path and we're not on a sub-path, redirect
  if (correctPath && currentPath !== correctPath && 
      !Object.values(stepRoutes).some(route => 
        route !== correctPath && currentPath.startsWith(route))) {
    console.log('Redirecting to:', correctPath);
    return <Navigate to={correctPath} replace />;
  }
  
  // Render the onboarding layout with the current step
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
