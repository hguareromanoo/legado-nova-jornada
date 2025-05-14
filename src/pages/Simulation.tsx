
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Simulation = () => {
  const navigate = useNavigate();
  
  const handleStartOnboarding = () => {
    navigate('/onboarding');
  };
  
  return (
    <div className="min-h-screen bg-white py-16">
      <div className="w1-container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Simulação de Holding Familiar</h1>
        
        {/* Simulation content would go here */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Resultados da sua simulação</h2>
          <p className="mb-6">
            Com base nas informações fornecidas, sua estrutura de holding pode proporcionar:
          </p>
          <ul className="list-disc pl-6 mb-8 space-y-2">
            <li>Economia tributária estimada de até 32%</li>
            <li>Proteção patrimonial contra litígios futuros</li>
            <li>Sucessão facilitada para seus herdeiros</li>
            <li>Organização dos seus ativos em uma estrutura centralizada</li>
          </ul>
        </div>
        
        <div className="flex justify-center">
          <Button 
            onClick={handleStartOnboarding}
            size="lg"
            className="bg-w1-primary-dark hover:bg-opacity-90 text-lg"
          >
            Quero abrir uma holding
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
