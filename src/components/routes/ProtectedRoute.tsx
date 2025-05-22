
import { Outlet } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";

const ProtectedRoute = () => {
  // Removed authentication check - all users can access protected routes now
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
