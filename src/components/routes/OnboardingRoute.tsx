
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
  
  // Check if current path matches the current onboarding step
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
  
  // If the current path is not allowed for the current step, redirect
  const allowedPaths = stepPaths[currentStep] || ['/onboarding'];
  if (!allowedPaths.some(path => currentPath.startsWith(path))) {
    return <Navigate to={allowedPaths[0]} replace />;
  }
  
  // If logged in but not completed onboarding, render the onboarding route with onboarding layout
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
