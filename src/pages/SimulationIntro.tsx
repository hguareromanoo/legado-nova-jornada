
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PublicLayout from '@/layouts/PublicLayout';

const SimulationIntro = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/simulation-questions');
  };

  return (
    <PublicLayout>
      <div className="w-full bg-w1-bg-light py-16 md:py-24">
        <div className="w1-container">
          <div className="flex flex-col md:flex-row items-center">
            {/* Left side - Content */}
            <motion.div 
              className="w-full md:w-1/2 md:pr-12 mb-12 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-w1-primary-dark mb-6 leading-tight">
                Descubra o poder de uma <span className="text-w1-primary-accent">Holding Familiar</span>
              </h1>
              
              <p className="text-lg md:text-xl text-w1-secondary-text mb-10 leading-relaxed">
                Economize impostos, proteja seu patrimônio e planeje a sucessão de forma inteligente. 
                Transforme seus objetivos em conquistas patrimoniais.
              </p>
              
              <Button 
                onClick={handleStart} 
                size="lg"
                className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark font-medium text-lg px-8 py-6 h-auto"
              >
                Começar Simulação
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
            
            {/* Right side - Image */}
            <motion.div 
              className="w-full md:w-1/2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <div className="rounded-lg overflow-hidden shadow-lg">
                <div className="relative">
                  {/* Image with overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-w1-primary-dark/40 to-transparent z-10"></div>
                  <img 
                    src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80" 
                    alt="Consultoria patrimonial especializada"
                    className="w-full h-auto object-cover aspect-[4/3]"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Benefits section */}
      <div className="w-full bg-white py-16">
        <div className="w1-container">
          <h2 className="text-2xl md:text-3xl font-medium text-center mb-12">
            Vantagens de uma <span className="text-w1-primary-accent">Holding Familiar</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="w1-card">
              <div className="w-12 h-12 bg-w1-primary-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-w1-primary-accent"><path d="M20.91 8.84 8.56 2.23a1.93 1.93 0 0 0-1.81 0L3.1 4.13a2.12 2.12 0 0 0-.05 3.69l12.22 6.93a2 2 0 0 0 1.94 0L21 12.51a2.12 2.12 0 0 0-.09-3.67Z"/><path d="m3.09 8.84 12.35-6.61a1.93 1.93 0 0 1 1.81 0l3.65 1.9a2.12 2.12 0 0 1 .1 3.69L8.73 14.75a2 2 0 0 1-1.94 0L3 12.51a2.12 2.12 0 0 1 .09-3.67Z"/><line x1="12" y1="22" x2="12" y2="13"/><path d="M20 13.5v3.37a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13.5"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Economia Tributária</h3>
              <p className="text-w1-secondary-text">
                Reduza significativamente sua carga tributária sobre rendimentos de aluguel e transferência de bens.
              </p>
            </div>
            
            <div className="w1-card">
              <div className="w-12 h-12 bg-w1-primary-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-w1-primary-accent"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Proteção Patrimonial</h3>
              <p className="text-w1-secondary-text">
                Proteja seus bens contra riscos comerciais, disputas judiciais e outros imprevistos.
              </p>
            </div>
            
            <div className="w1-card">
              <div className="w-12 h-12 bg-w1-primary-accent/10 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-w1-primary-accent"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Sucessão Planejada</h3>
              <p className="text-w1-secondary-text">
                Evite conflitos familiares e custos judiciais com um planejamento sucessório eficiente.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Button
              onClick={handleStart}
              className="w1-button-primary text-base"
            >
              Simular minha economia <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SimulationIntro;
