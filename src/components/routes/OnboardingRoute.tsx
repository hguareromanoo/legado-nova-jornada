
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
  
  // Render the onboarding layout with the current step
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
