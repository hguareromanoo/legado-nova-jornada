
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const SimulationIntro = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/simulation-questions');
  };

  return (
    <div className="min-h-screen bg-white py-12 md:py-20">
      <div className="w1-container max-w-3xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-w1-primary-dark mb-6">
            Descubra o poder de uma Holding Familiar
          </h1>
          
          <p className="text-xl text-gray-600 mb-12">
            Economize impostos, proteja seu patrimônio e planeje a sucessão de forma inteligente.
          </p>

          <Button 
            onClick={handleStart} 
            size="lg" 
            className="bg-w1-primary-dark hover:bg-opacity-90 text-white text-lg px-8 py-6 h-auto"
          >
            Começar Simulação
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SimulationIntro;
