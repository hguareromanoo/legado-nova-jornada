import { Outlet, Navigate } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding, userRole } = useUser();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false after userRole is fetched
    if (userRole !== null || !isLoggedIn) {
      setLoading(false);
    }
  }, [userRole, isLoggedIn]);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }
  
  // If user is a consultant, redirect to consultant dashboard
  if (isLoggedIn && userRole === 'consultant') {
    console.log("User is a consultant, redirecting to consultant dashboard");
    return <Navigate to="/consultant" replace />;
  }
  
  // If user is logged in and has completed onboarding, redirect to dashboard
  if (isLoggedIn && hasCompletedOnboarding) {
    console.log("User has completed onboarding, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  // If user is logged in but has not completed onboarding, redirect to onboarding
  if (isLoggedIn && !hasCompletedOnboarding) {
    console.log("User has not completed onboarding, redirecting to onboarding");
    return <Navigate to="/onboarding" replace />;
  }
  
  console.log("User is not logged in, showing public content");
  // Otherwise, render the public route
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
