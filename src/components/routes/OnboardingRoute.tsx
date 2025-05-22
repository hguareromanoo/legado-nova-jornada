
import { Outlet } from "react-router-dom";
import OnboardingLayout from "@/layouts/OnboardingLayout";

const OnboardingRoute = () => {
  // Removed authentication checks - all users can access onboarding routes now
  
  // Render the onboarding layout with the current step
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
