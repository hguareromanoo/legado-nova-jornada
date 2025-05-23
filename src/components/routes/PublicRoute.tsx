
import { Outlet, Navigate } from "react-router-dom";
import PublicLayout from "@/layouts/PublicLayout";
import { useUser } from "@/contexts/UserContext";
import { useState, useEffect } from "react";

const PublicRoute = () => {
  const { isLoggedIn, hasCompletedOnboarding, userRole, userState, user } = useUser();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    console.log('[PublicRoute] Initial state:', { 
      isLoggedIn, 
      userRole, 
      userState, 
      userId: user?.id,
      hasUser: !!user
    });
    
    // Simple loading state management with a maximum wait time
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('[PublicRoute] Forced loading state to complete after timeout');
        setLoading(false);
      }
    }, 2000);
    
    // User role/state condition check
    if (isLoggedIn !== undefined) {
      if (isLoggedIn && userRole !== null && userState !== null) {
        console.log('[PublicRoute] User state loaded:', userState);
        setLoading(false);
      } else if (!isLoggedIn) {
        console.log('[PublicRoute] User not logged in');
        setLoading(false);
      }
    }
    
    return () => clearTimeout(timeoutId);
  }, [isLoggedIn, userRole, userState, loading, user]);
  
  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }
  
  // Se o usuário está autenticado, redirecione com base no estado
  if (isLoggedIn) {
    console.log('[PublicRoute] User is logged in with state:', userState);
    
    // Se o usuário é um consultor, redirecione para o dashboard do consultor
    if (userRole === 'consultant') {
      console.log("[PublicRoute] User is a consultant, redirecting to consultant dashboard");
      return <Navigate to="/consultant" replace />;
    }
    
    // Special case for welcome page - allow access to welcome page when in first_access state
    if (window.location.pathname === '/welcome' && userState === 'first_access') {
      console.log("[PublicRoute] User is in first_access state on welcome page, allowing access");
      return (
        <PublicLayout>
          <Outlet />
        </PublicLayout>
      );
    }
    
    // Redirecionamento baseado no estado do usuário
    switch (userState) {
      case 'first_access':
        console.log("[PublicRoute] User is in first_access state, redirecting to welcome page");
        return <Navigate to="/welcome" replace />;
        
      case 'onboarding_ai':
        console.log("[PublicRoute] User is in onboarding_ai state, redirecting to AI onboarding");
        return <Navigate to="/onboarding/chat" replace />;
        
      case 'onboarding_human':
        console.log("[PublicRoute] User is in onboarding_human state, redirecting to human onboarding");
        return <Navigate to="/onboarding/human/schedule" replace />;
        
      case 'holding_setup':
        console.log("[PublicRoute] User is in holding_setup state, redirecting to holding setup");
        return <Navigate to="/holding-setup" replace />;
        
      case 'holding_opened':
        console.log("[PublicRoute] User is in holding_opened state, redirecting to members page");
        return <Navigate to="/members" replace />;
        
      default:
        // Fallback para o estado de acesso inicial
        console.log("[PublicRoute] User state unknown, redirecting to welcome page as fallback");
        return <Navigate to="/welcome" replace />;
    }
  }
  
  console.log("[PublicRoute] User is not logged in, showing public content");
  // Se não estiver autenticado, renderizar a rota pública
  return (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  );
};

export default PublicRoute;
