
import { Outlet, Navigate } from "react-router-dom";
import OnboardingLayout from "@/layouts/OnboardingLayout";
import { useUser } from "@/contexts/UserContext";

const OnboardingRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding, userState } = useUser();
  
  // Se o usuário não estiver autenticado, redirecione para a página de login
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Se o usuário estiver no estado holding_opened, redirecione para o dashboard
  if (userState === 'holding_opened' || hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Renderize o layout de onboarding com a etapa atual
  return (
    <OnboardingLayout>
      <Outlet />
    </OnboardingLayout>
  );
};

export default OnboardingRoute;
