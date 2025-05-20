
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useUser(); // Get user from context
  const { currentStep } = useOnboarding();
  
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // Mark that onboarding has started
    localStorage.setItem('hasStartedOnboarding', 'true');
    
    // Map steps to routes
    const stepRoutes: Record<string, string> = {
      'selection': '/onboarding',
      'chat': '/onboarding/chat',
      'schedule': '/onboarding/schedule',
      'documents': '/document-collection',
      'review': '/document-review'
    };
    
    // If we're already on the onboarding page, no need to redirect
    if (window.location.pathname === '/onboarding') {
      return;
    }
    
    // Navigate to the appropriate step or document collection as default
    const redirectTo = stepRoutes[currentStep] || '/document-collection';
    navigate(redirectTo);
  }, [navigate, isLoggedIn, currentStep]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecionando para o processo de abertura da holding...</p>
    </div>
  );
};

export default Onboarding;
