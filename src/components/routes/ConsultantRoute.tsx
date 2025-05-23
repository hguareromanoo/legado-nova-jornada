
import { Outlet, Navigate } from "react-router-dom";
import ConsultantLayout from "@/layouts/ConsultantLayout";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

const ConsultantRoute = () => {
  const { isLoggedIn, user, userRole } = useUser();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // User role condition check
    if (isLoggedIn && userRole !== null) {
      console.log('ConsultantRoute - User role loaded:', userRole);
      setLoading(false);
    } else if (!isLoggedIn) {
      console.log('ConsultantRoute - User not logged in');
      setLoading(false);
    }
  }, [isLoggedIn, userRole]);
  
  // Show loading while checking auth status and role
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-white">Carregando...</div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    console.log("User is not logged in, redirecting to login");
    return <Navigate to="/login" replace />;
  }
  
  // If user is not a consultant, redirect to dashboard
  if (userRole !== 'consultant') {
    console.log("User is not a consultant, role is:", userRole);
    console.log("Redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  console.log("User is a consultant, showing consultant dashboard");
  // Render the consultant dashboard if the user is a consultant
  return (
    <ConsultantLayout>
      <Outlet />
    </ConsultantLayout>
  );
};

export default ConsultantRoute;
