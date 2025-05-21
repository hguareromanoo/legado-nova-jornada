
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  // Obter o primeiro nome do usuário
  const firstName = user?.user_metadata?.first_name || 
                   user?.user_metadata?.full_name?.split(' ')[0] || 
                   'Cliente';
  
  const handleContinue = () => {
    // Marcar que o usuário já viu a tela de boas-vindas
    localStorage.setItem('hasSeenWelcome', 'true');
    // Redirecionar para a próxima etapa do onboarding
    navigate('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col items-center justify-center px-4 md:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-3xl"
      >
        {/* Logo e saudação */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl text-white font-light mb-4">
            <span className="font-bold">W1</span>
            <span className="text-w1-primary-accent">.</span>
          </h1>
          
          <h2 className="text-2xl md:text-4xl text-white font-light mt-12 mb-3">
            Olá, <span className="font-semibold">{firstName}</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 font-light">
            Seja bem-vindo à W1 Consultoria Patrimonial
          </p>
        </div>
        
        {/* Conteúdo principal */}
        <motion.div 
          className="bg-white/10 backdrop-blur-lg rounded-xl p-8 md:p-12 text-white border border-white/10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
        >
          <h3 className="text-xl md:text-2xl font-medium mb-6 text-w1-primary-accent">
            O caminho para o seu planejamento patrimonial começa aqui
          </h3>
          
          <p className="text-base md:text-lg mb-8 leading-relaxed font-light">
            Preparamos uma jornada personalizada para você organizar e proteger seu patrimônio.
            Nas próximas etapas, vamos conhecer melhor suas necessidades e objetivos para 
            desenvolver uma estratégia de holding familiar sob medida.
          </p>
          
          <p className="text-base md:text-lg mb-12 leading-relaxed font-light">
            Nossa equipe está comprometida em garantir que sua família e seu patrimônio
            estejam protegidos com soluções jurídicas eficazes e fiscalmente inteligentes.
          </p>
          
          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleContinue}
              className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark font-medium text-lg px-8 py-6 rounded-md transition-all duration-300 transform hover:scale-105"
            >
              Continuar para próxima etapa
            </Button>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Decoração visual */}
      <motion.div 
        className="absolute bottom-12 right-12 w-32 h-32 md:w-48 md:h-48 bg-w1-primary-accent/20 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      <motion.div 
        className="absolute top-24 left-24 w-40 h-40 md:w-64 md:h-64 bg-w1-secondary-dark/30 rounded-full blur-3xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </div>
  );
};

export default Welcome;
