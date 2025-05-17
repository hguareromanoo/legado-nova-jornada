
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  
  useEffect(() => {
    // Update the document title when the component mounts
    document.title = "W1 Consultoria Patrimonial | Simulação de Holding";
    
    // Check if the user is logged in 
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (isLoggedIn === 'true') {
      // Check if the user has completed the holding setup
      const isSetupCompleted = localStorage.getItem('holdingSetupCompleted') === 'true';
      
      if (isSetupCompleted) {
        // If setup is completed, redirect to members dashboard
        navigate('/members');
      } else {
        // If not completed, redirect to document opening process
        navigate('/document-opening');
      }
    }
  }, [navigate]);

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
