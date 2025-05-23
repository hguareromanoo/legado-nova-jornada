
import { Outlet, Navigate } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import { useUser } from "@/contexts/UserContext";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding, userRole } = useUser();
  
  // If user is a consultant, redirect to consultant dashboard
  if (isLoggedIn && userRole === 'consultant') {
    return <Navigate to="/consultant" replace />;
  }
  
  // If user is logged in and has completed onboarding, redirect to dashboard
  if (isLoggedIn && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is logged in but has not completed onboarding, redirect to onboarding
  if (isLoggedIn && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }
  
  // Otherwise, render the public route
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
