
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
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-w1-primary-dark mb-6">
            Descubra o poder de uma Holding Familiar
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Economize impostos, proteja seu patrimônio e planeje a sucessão de forma inteligente.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-gray-50 p-6 md:p-10 rounded-xl mb-10 shadow-sm"
        >
          <div className="grid md:grid-cols-3 gap-6 text-left mb-8">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                <span className="text-blue-600 text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Economia Fiscal</h3>
              <p className="text-gray-600">
                Reduza significativamente sua carga tributária sobre rendimentos e transferência de bens.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                <span className="text-green-600 text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Proteção Patrimonial</h3>
              <p className="text-gray-600">
                Blindagem eficiente contra riscos comerciais e disputas judiciais.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="inline-block p-3 bg-purple-100 rounded-full mb-4">
                <span className="text-purple-600 text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Sucessão Planejada</h3>
              <p className="text-gray-600">
                Evite conflitos e custos judiciais com um planejamento sucessório eficiente.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
            <h3 className="font-semibold text-lg mb-3">Como funciona nossa simulação:</h3>
            <ol className="space-y-2 text-left">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 text-sm font-medium mr-2 mt-0.5">1</span>
                <span>Responda algumas perguntas simples sobre seu patrimônio</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 text-sm font-medium mr-2 mt-0.5">2</span>
                <span>Nosso sistema calcula sua economia potencial</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-200 text-gray-800 text-sm font-medium mr-2 mt-0.5">3</span>
                <span>Receba um diagnóstico personalizado para seu caso</span>
              </li>
            </ol>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            A simulação leva aproximadamente 3 minutos para ser concluída
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
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
