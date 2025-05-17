
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mark that onboarding has started
    localStorage.setItem('hasStartedOnboarding', 'true');
    // Redirect to document opening page instead of members
    navigate('/document-opening');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecionando para o processo de abertura da holding...</p>
    </div>
  );
};

export default Onboarding;
