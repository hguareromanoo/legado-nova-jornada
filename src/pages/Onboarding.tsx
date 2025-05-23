
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, userState, updateUserState } = useUser(); 
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
    
    // Map user states to steps (if needed)
    if (userState === 'first_access') {
      // Update user state to onboarding_ai if coming from welcome page
      const updateState = async () => {
        await updateUserState('onboarding_ai');
      };
      updateState();
    }
    
    // If we're already on the onboarding page, no need to redirect
    if (window.location.pathname === '/onboarding') {
      return;
    }
    
    // Navigate to the appropriate step or document collection as default
    const redirectTo = stepRoutes[currentStep] || '/document-collection';
    navigate(redirectTo);
  }, [navigate, isLoggedIn, currentStep, userState, updateUserState]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecionando para o processo de abertura da holding...</p>
    </div>
  );
};

export default Onboarding;
