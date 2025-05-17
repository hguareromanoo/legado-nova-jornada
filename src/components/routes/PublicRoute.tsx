
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import PublicLayout from "@/layouts/PublicLayout";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  
  // Se estiver logado e completou o onboarding, redirecione para o dashboard
  if (isLoggedIn && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Se estiver logado mas não completou o onboarding, redirecione para a etapa apropriada
  if (isLoggedIn && !hasCompletedOnboarding) {
    const currentStep = localStorage.getItem('onboardingStep') || 'selection';
    
    // Mapeie as etapas para rotas
    const stepRoutes: Record<string, string> = {
      'selection': '/onboarding',
      'chat': '/onboarding/chat',
      'schedule': '/onboarding/schedule',
      'documents': '/members',
      'review': '/document-review'
    };
    
    const redirectTo = stepRoutes[currentStep] || '/onboarding';
    return <Navigate to={redirectTo} replace />;
  }
  
  // Se não estiver logado, renderize a rota pública com o layout público
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
