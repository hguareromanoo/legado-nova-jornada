
import { Outlet, Navigate } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { useUser } from "@/contexts/UserContext";

const ProtectedRoute = () => {
  const { isLoggedIn, userState } = useUser();
  
  // Se o usuário não estiver autenticado, redirecione para a página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Se o usuário não concluiu o setup (não está no estado holding_opened), 
  // redirecione para a página adequada com base no seu estado
  if (userState !== 'holding_opened') {
    switch (userState) {
      case 'first_access':
        return <Navigate to="/welcome" replace />;
      case 'onboarding_ai':
        return <Navigate to="/onboarding/chat" replace />;
      case 'onboarding_human':
        return <Navigate to="/onboarding/human/schedule" replace />;
      case 'holding_setup':
        return <Navigate to="/holding-setup" replace />;
      default:
        return <Navigate to="/welcome" replace />;
    }
  }
  
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
