
import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useUser } from "@/contexts/UserContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useUser();
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
