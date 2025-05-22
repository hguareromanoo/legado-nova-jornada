
import { Outlet, Navigate } from "react-router-dom";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import { useUser } from "@/contexts/UserContext";

const OnboardingRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If user has completed onboarding, redirect to dashboard
  if (hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the onboarding layout with the current step
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
