
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mark that onboarding has started
    localStorage.setItem('hasStartedOnboarding', 'true');
    // Redirect to the members page with the dashboard view
    navigate('/members');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Redirecionando para área de membros...</p>
    </div>
  );
};

export default Onboarding;
