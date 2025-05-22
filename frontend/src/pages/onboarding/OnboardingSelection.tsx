
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';

const OnboardingSelection = () => {
  const navigate = useNavigate();
  const { setPath, completeStep } = useOnboarding();
  const { toast } = useToast();
  const [selectedPath, setSelectedPath] = useState<'ai' | 'human' | null>(null);
  
  const handleContinue = () => {
    if (!selectedPath) {
      toast({
        title: "Selecione uma opção",
        description: "Por favor, escolha um tipo de onboarding para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    // Set onboarding path in context
    setPath(selectedPath);
    
    // Mark current step as completed
    completeStep('selection');
    
    // Navigate to next step based on selected path
    if (selectedPath === 'ai') {
      navigate('/onboarding/chat');
    } else {
      // Updated to navigate to the new Human Touch flow
      navigate('/onboarding/human/schedule');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Como você prefere estruturar sua holding?
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Escolha o caminho que melhor se adapta ao seu perfil. Você pode optar por uma experiência
          guiada por nossa IA ou agendar uma conversa personalizada com nossos consultores.
        </p>
      </motion.div>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card 
            className={`h-full cursor-pointer transition-all ${
              selectedPath === 'ai' 
                ? 'border-blue-500 shadow-lg shadow-blue-100' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedPath('ai')}
          >
            <CardHeader className="pb-4">
              <div className="mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-center text-xl">Assistido por IA</CardTitle>
              <CardDescription className="text-center">
                Processo guiado por nossa inteligência artificial
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="font-medium text-gray-900">Ideal para quem valoriza:</p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Rapidez no processo
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Flexibilidade de horário
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Autonomia na tomada de decisões
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                  Processo 100% digital
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 flex justify-center">
              <div className="text-sm text-gray-500">Tempo estimado: 20-30 minutos</div>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card 
            className={`h-full cursor-pointer transition-all ${
              selectedPath === 'human' 
                ? 'border-green-500 shadow-lg shadow-green-100' 
                : 'hover:border-gray-300'
            }`}
            onClick={() => setSelectedPath('human')}
          >
            <CardHeader className="pb-4">
              <div className="mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-center text-xl">Toque Humano</CardTitle>
              <CardDescription className="text-center">
                Atendimento personalizado com consultores especializados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="font-medium text-gray-900">Ideal para quem valoriza:</p>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Atendimento personalizado
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Aconselhamento detalhado
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Casos mais complexos
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Suporte direto de especialistas
                </li>
              </ul>
            </CardContent>
            <CardFooter className="pt-4 flex justify-center">
              <div className="text-sm text-gray-500">Duração da consulta: 45-60 minutos</div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          onClick={handleContinue}
          className="bg-w1-primary-dark hover:bg-opacity-90 text-white px-8 py-6 text-lg"
          size="lg"
        >
          Continuar
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default OnboardingSelection;
