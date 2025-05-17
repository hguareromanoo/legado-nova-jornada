
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsSection from '@/components/StatsSection';
import PillarsSection from '@/components/PillarsSection';
import ServicesSection from '@/components/ServicesSection';
import SimulationCTA from '@/components/SimulationCTA';
import ProcessSteps from '@/components/ProcessSteps';
import BenefitsSection from '@/components/BenefitsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index = () => {
  const navigate = useNavigate();
  const { isLoggedIn, hasCompletedOnboarding } = useUser();
  
  useEffect(() => {
    // Update the document title when the component mounts
    document.title = "W1 Consultoria Patrimonial | Simulação de Holding";
    
    // Só redireciona se o usuário estiver logado
    if (isLoggedIn) {
      if (hasCompletedOnboarding) {
        // Se o usuário estiver logado e tiver concluído o onboarding, vá para o dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Se o usuário estiver logado mas não concluiu o onboarding, obtenha a etapa atual
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
        navigate(redirectTo, { replace: true });
      }
    }
    // Se não estiver logado, não redirecione - continue na landing page
  }, [navigate, isLoggedIn, hasCompletedOnboarding]);

  // Renderizar o conteúdo da landing page somente se não estiver redirecionando
  if (isLoggedIn) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <StatsSection />
      <PillarsSection />
      <ServicesSection />
      <SimulationCTA />
      <ProcessSteps />
      <BenefitsSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
