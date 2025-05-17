
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
    
    // Handle redirection based on authentication and onboarding status
    if (isLoggedIn) {
      if (hasCompletedOnboarding) {
        // If user is logged in and has completed onboarding, go to dashboard
        navigate('/dashboard');
      } else {
        // If user is logged in but hasn't completed onboarding, get current step
        const currentStep = localStorage.getItem('onboardingStep') || 'selection';
        
        // Map steps to routes
        const stepRoutes: Record<string, string> = {
          'selection': '/onboarding',
          'chat': '/onboarding/chat',
          'schedule': '/onboarding/schedule',
          'documents': '/document-collection',
          'review': '/document-review'
        };
        
        const redirectTo = stepRoutes[currentStep] || '/onboarding';
        navigate(redirectTo);
      }
    }
    // If not logged in, stay on landing page
  }, [navigate, isLoggedIn, hasCompletedOnboarding]);

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
