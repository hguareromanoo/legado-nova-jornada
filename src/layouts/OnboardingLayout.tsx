
import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OnboardingLayoutProps {
  children: ReactNode;
}

const OnboardingLayout = ({ children }: OnboardingLayoutProps) => {
  const { progress, currentStep, steps } = useOnboarding();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleBack = () => {
    const currentStepIndex = steps.findIndex(step => step.id === currentStep);
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      navigate(previousStep.path);
    } else {
      navigate('/');
    }
  };
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sessão finalizada",
      description: "Você foi desconectado com sucesso.",
    });
    navigate('/login');
  };
  
  const currentStepObj = steps.find(step => step.id === currentStep);
  
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Header */}
      <header className="bg-w1-primary-dark text-white py-4 shadow-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-w1-secondary-dark/80"
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                W1<span className="text-w1-primary-accent">.</span>
              </h1>
              <p className="text-sm opacity-80">
                {currentStepObj ? currentStepObj.name : 'Onboarding'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {user && (
              <div className="hidden md:block text-right">
                <p className="font-medium">Olá, {user.name.split(' ')[0]}</p>
                <p className="text-sm opacity-80">{user.email}</p>
              </div>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-white text-white hover:bg-white/10"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      {/* Progress bar */}
      <div className="bg-w1-bg-light py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between text-sm text-w1-secondary-text mb-1">
            <span>Progresso</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" indicatorClassName="bg-w1-primary-accent" />
        </div>
      </div>
      
      {/* Main content */}
      <main className="flex-grow bg-white">
        {children}
      </main>
    </div>
  );
};

export default OnboardingLayout;
