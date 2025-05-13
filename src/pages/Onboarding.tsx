
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, UserRound, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Onboarding = () => {
  const navigate = useNavigate();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const handlePathSelection = (path: string) => {
    setSelectedPath(path);
    
    // Store the selected path in localStorage
    localStorage.setItem('onboardingPath', path);
    
    // Navigate based on selection
    if (path === 'self') {
      navigate('/roadmap-progress');
    } else {
      navigate('/onboarding/schedule');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen bg-white py-16">
      <div className="w1-container max-w-5xl mx-auto">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-bold text-w1-primary-dark mb-4"
            variants={itemVariants}
          >
            Você está a um passo de construir sua holding familiar
          </motion.h1>
          <motion.p 
            className="text-lg text-gray-600 max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Agora, vamos escolher como você deseja prosseguir. Você está no controle — e estaremos aqui sempre que precisar.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Option A – Start by Yourself */}
          <motion.div variants={itemVariants}>
            <PathCard
              title="Iniciar por Conta Própria"
              description="Responda a algumas perguntas guiadas e avance no seu próprio ritmo. Você pode solicitar suporte a qualquer momento."
              icon={<Brain size={48} className="text-w1-primary-accent" />}
              buttonText="Começar Agora"
              onClick={() => handlePathSelection('self')}
              isSelected={selectedPath === 'self'}
            />
          </motion.div>

          {/* Option B – Talk to a Specialist */}
          <motion.div variants={itemVariants}>
            <PathCard
              title="Falar com um Especialista"
              description="Prefere um toque humano? Agende uma sessão com um consultor de confiança que ajudará a adaptar a melhor solução para você."
              icon={<UserRound size={48} className="text-w1-primary-accent" />}
              buttonText="Agendar com Especialista"
              onClick={() => handlePathSelection('specialist')}
              isSelected={selectedPath === 'specialist'}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center text-gray-600 bg-gray-50 p-4 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Save className="mr-2 text-w1-primary-accent" />
          <p>Seu progresso será salvo e pode ser retomado a qualquer momento — de forma independente ou com suporte.</p>
        </motion.div>
      </div>
    </div>
  );
};

interface PathCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  onClick: () => void;
  isSelected: boolean;
}

const PathCard = ({ title, description, icon, buttonText, onClick, isSelected }: PathCardProps) => (
  <Card className={`h-full transition-all duration-300 hover:shadow-lg ${
    isSelected ? 'ring-2 ring-w1-primary-accent shadow-lg' : ''
  }`}>
    <CardContent className="p-8 flex flex-col h-full">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 text-w1-primary-dark">{title}</h3>
      <p className="text-gray-600 mb-6 flex-grow">{description}</p>
      <Button 
        onClick={onClick}
        className="w-full bg-w1-primary-dark text-white hover:bg-opacity-90"
      >
        {buttonText}
      </Button>
    </CardContent>
  </Card>
);

export default Onboarding;
