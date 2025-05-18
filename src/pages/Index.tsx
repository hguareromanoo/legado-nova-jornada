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
    
    // Only redirect if the user is logged in
    if (isLoggedIn) {
      if (hasCompletedOnboarding) {
        // If the user is logged in and has completed onboarding, go to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // If the user is logged in but hasn't completed onboarding, get the current step
        const currentStep = localStorage.getItem('onboardingStep') || 'selection';
        
        // Map steps to routes
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
    // If not logged in, don't redirect - stay on the landing page
  }, [navigate, isLoggedIn, hasCompletedOnboarding]);

  // Only show loading state if we're going to redirect
  if (isLoggedIn) {
    return <div className="min-h-screen bg-white flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>;
  }

  // Otherwise render the full landing page
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
