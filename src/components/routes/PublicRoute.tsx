
import { Outlet } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";

const PublicRoute = () => {
  // Removed all authentication checks and redirects
  
  // Render the public route with public layout for all users
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
