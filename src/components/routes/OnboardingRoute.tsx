
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import OnboardingLayout from "@/layouts/OnboardingLayout";

const OnboardingRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  
  // If not logged in, redirect to login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If logged in and completed onboarding, redirect to dashboard
  if (hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Get current onboarding step - default to 'selection' if not set
  const currentStep = localStorage.getItem('onboardingStep') || 'selection';
  const currentPath = window.location.pathname;
  
  // Define the allowed paths for each step
  const stepPaths: Record<string, string[]> = {
    'selection': ['/onboarding'],
    'chat': ['/onboarding/chat'],
    'schedule': ['/onboarding/schedule'],
    'documents': ['/document-collection'],
    'review': ['/document-review']
  };
  
  // Get allowed paths for current step
  const allowedPaths = stepPaths[currentStep] || ['/onboarding'];
  
  // Only redirect if current path doesn't match allowed paths and we're not on a general onboarding path
  if (!allowedPaths.some(path => currentPath.startsWith(path)) && 
      !currentPath.startsWith('/onboarding/human')) {
    return <Navigate to={allowedPaths[0]} replace />;
  }
  
  // Render the onboarding layout with the current step
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
