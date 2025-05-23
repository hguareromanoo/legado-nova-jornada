
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import DashboardLayout from "@/layouts/DashboardLayout";

const ProtectedRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();

  // Se não estiver logado, redirecionar para login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Em vez de redirecionar para etapas de onboarding, vamos mostrar o modo de preview
  // com dados mock para todos os usuários, mesmo que não tenham completado o onboarding
  
  // Renderizamos o layout do dashboard com o conteúdo protegido
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
