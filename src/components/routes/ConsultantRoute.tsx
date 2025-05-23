
import { Outlet, Navigate } from "react-router-dom";
import ConsultantLayout from "@/layouts/ConsultantLayout";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

const ConsultantRoute = () => {
  const { isLoggedIn, user, userRole } = useUser();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to false after userRole is fetched
    if (userRole !== null || !isLoggedIn) {
      setLoading(false);
    }
  }, [userRole, isLoggedIn]);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-pulse text-white">Carregando...</div>
      </div>
    );
  }
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // If user is not a consultant, redirect to dashboard
  if (userRole !== 'consultant') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Render the consultant dashboard if the user is a consultant
  return (
    <ConsultantLayout>
      <Outlet />
    </ConsultantLayout>
  );
};

export default ConsultantRoute;
