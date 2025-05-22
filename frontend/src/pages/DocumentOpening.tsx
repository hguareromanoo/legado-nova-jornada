
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleCheck, CircleDashed, FileText, Home, Building, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

// Define the steps for the opening process
const openingSteps = [
  {
    id: 1,
    title: 'Documentos Pessoais',
    description: 'Envie seus documentos de identificação',
    icon: <User className="h-5 w-5" />,
    status: 'completed', // 'current', 'completed', or 'pending'
  },
  {
    id: 2,
    title: 'Dados Financeiros',
    description: 'Declaração de IR e comprovantes',
    icon: <FileText className="h-5 w-5" />,
    status: 'current',
  },
  {
    id: 3,
    title: 'Propriedades',
    description: 'Escrituras e documentos de imóveis',
    icon: <Home className="h-5 w-5" />,
    status: 'pending',
  },
  {
    id: 4,
    title: 'Empresas',
    description: 'Contrato social e documentação',
    icon: <Building className="h-5 w-5" />,
    status: 'pending',
  }
];

const DocumentOpening = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progress, setProgress] = useState(25); // 25% as first step is completed
  const [userName, setUserName] = useState('Cliente');
  const [currentStep, setCurrentStep] = useState(2); // Starting with the second step as current

  useEffect(() => {
    // In a real app, you would fetch the user's name and current progress
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const handleContinue = () => {
    // In a real app, this would navigate to a specific document upload page
    // For now, we'll just simulate moving to the next step
    if (currentStep < openingSteps.length) {
      toast({
        title: "Prosseguindo para o próximo passo",
        description: `Você está indo para: ${openingSteps[currentStep].title}`,
      });
      navigate('/document-collection');
    } else {
      toast({
        title: "Processo finalizado!",
        description: "Sua holding está sendo criada.",
      });
      // Mark as completed in localStorage so next time user is directed to dashboard
      localStorage.setItem('holdingSetupCompleted', 'true');
      navigate('/members');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">Olá, {userName}</h1>
          <p className="text-lg text-gray-600 mt-2">
            Vamos continuar com a abertura da sua holding. Complete todos os passos para finalizar o processo.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="lg:w-2/3 bg-white rounded-xl shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                {openingSteps.find(step => step.status === 'current')?.title || "Próximo Passo"}
              </h2>
              <p className="text-gray-600 mt-1">
                {openingSteps.find(step => step.status === 'current')?.description || "Continue seu processo"}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
              <h3 className="font-medium text-blue-800 mb-2">O que você precisa preparar:</h3>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-center">
                  <CircleCheck className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Declaração de Imposto de Renda (último exercício)</span>
                </li>
                <li className="flex items-center">
                  <CircleCheck className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Extratos bancários dos últimos 3 meses</span>
                </li>
                <li className="flex items-center">
                  <CircleCheck className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Comprovantes de investimentos</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={handleContinue}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right sidebar - Progress tracker */}
          <div className="lg:w-1/3 bg-gray-50 rounded-xl shadow-sm border p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800">Progresso de abertura</h2>
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Concluído</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 mt-1" />
            </div>

            <div className="space-y-6 relative">
              {/* Vertical line connecting steps */}
              <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-gray-200 z-0" />

              {openingSteps.map((step) => (
                <div key={step.id} className="flex items-start relative z-10">
                  <div 
                    className={`rounded-full p-1.5 mr-4 flex-shrink-0 ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-blue-500 ring-2 ring-blue-200' : 'bg-gray-300'
                    }`}
                  >
                    {step.status === 'completed' ? (
                      <CircleCheck className="h-5 w-5 text-white" />
                    ) : (
                      <CircleDashed className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-medium ${
                      step.status === 'completed' ? 'text-green-600' : 
                      step.status === 'current' ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentOpening;
