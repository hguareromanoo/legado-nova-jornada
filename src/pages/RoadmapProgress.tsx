
import { useState, useEffect } from 'react';
import { ArrowDown, Leaf, TreeDeciduous, TreePalm, CircleCheck, Award } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    id: 1,
    title: 'Simulação',
    description: 'Análise preliminar das vantagens para seu patrimônio',
    complete: true,
    icon: CircleCheck
  },
  {
    id: 2,
    title: 'Cadastro',
    description: 'Criação da sua conta na W1',
    complete: true,
    icon: CircleCheck
  },
  {
    id: 3,
    title: 'Envio de Documentos',
    description: 'Upload dos documentos necessários para análise jurídica',
    complete: false,
    icon: CircleCheck
  },
  {
    id: 4,
    title: 'Análise Jurídica',
    description: 'Nossos especialistas analisam seu patrimônio e definem a melhor estratégia',
    complete: false,
    icon: CircleCheck
  },
  {
    id: 5,
    title: 'Estruturação da Holding',
    description: 'Criação da estrutura societária e documentação',
    complete: false,
    icon: CircleCheck
  },
  {
    id: 6,
    title: 'Assinatura de Contrato',
    description: 'Formalização legal da sua holding familiar',
    complete: false,
    icon: CircleCheck
  },
  {
    id: 7,
    title: 'Holding Estabelecida',
    description: 'Sua holding está pronta e operando!',
    complete: false,
    icon: Award
  },
];

const RoadmapProgress = () => {
  const [activeStep, setActiveStep] = useState(2); // Starting at step 2 (Cadastro) as complete
  const [treeGrowth, setTreeGrowth] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const navigate = useNavigate();

  // Handle scroll to update parallax effect
  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      
      // Calculate tree growth based on scroll position (0-100%)
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      const growthPercentage = (position / scrollHeight) * 100;
      setTreeGrowth(Math.min(Math.max(growthPercentage, 0), 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getTreeComponent = () => {
    if (treeGrowth < 20) {
      return <Leaf size={48} className="text-green-500 animate-pulse" />;
    } else if (treeGrowth < 40) {
      return <TreeDeciduous size={64} className="text-green-500" />;
    } else if (treeGrowth < 70) {
      return <TreeDeciduous size={96} className="text-green-500" />;
    } else {
      return <TreePalm size={128} className="text-green-600" />;
    }
  };

  const handleContinue = () => {
    // Navigate to members dashboard
    navigate('/members');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="w1-container py-16">
        <div className="max-w-5xl mx-auto">
          <div className="mb-16 text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-w1-primary-dark mb-6">
              Sua jornada de proteção patrimonial
            </h1>
            <p className="text-w1-secondary-text text-lg md:text-xl">
              Acompanhe o progresso da abertura da sua holding familiar
            </p>
          </div>

          {/* Gamified roadmap container */}
          <div className="relative flex justify-between">
            {/* Left side: Roadmap steps */}
            <div className="w-3/5 pr-8">
              {/* Vertical line */}
              <div className="absolute left-[40px] top-[40px] bottom-0 w-1 bg-gray-200 -z-1"></div>

              {/* Steps */}
              <div className="space-y-16 relative">
                {steps.map((step, index) => {
                  const isActive = index <= activeStep;
                  const isCurrentStep = index === activeStep;
                  
                  return (
                    <div 
                      key={step.id}
                      className={`relative flex items-start gap-6 transition-all duration-500 ${
                        isActive ? 'opacity-100' : 'opacity-50'
                      } ${isCurrentStep ? 'scale-105' : ''}`}
                      style={{ 
                        transform: `translateY(${scrollPosition * 0.1 * (index % 2 === 0 ? -1 : 1)}px)` 
                      }}
                    >
                      {/* Step circle with icon */}
                      <div 
                        className={`flex items-center justify-center w-12 h-12 rounded-full z-10 transition-colors duration-500 ${
                          index <= activeStep 
                            ? 'bg-w1-primary-accent text-w1-primary-dark' 
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {index < activeStep ? (
                          <step.icon size={20} />
                        ) : (
                          <span className="text-lg font-semibold">{step.id}</span>
                        )}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-semibold mb-2 ${isActive ? 'text-w1-primary-dark' : 'text-gray-500'}`}>
                          {step.title}
                        </h3>
                        <p className={`text-base ${isActive ? 'text-w1-secondary-text' : 'text-gray-400'}`}>
                          {step.description}
                        </p>
                        
                        {isCurrentStep && (
                          <div className="mt-4">
                            <Button 
                              className="bg-w1-primary-accent text-w1-primary-dark hover:bg-w1-primary-accent/90"
                              onClick={handleContinue}
                            >
                              Continuar
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Right side: Growing tree visualization */}
            <div className="w-2/5 sticky top-0 h-screen flex flex-col items-center justify-center">
              {/* Tree container with parallax effect */}
              <div 
                className="relative h-[500px] flex flex-col items-center justify-end"
                style={{ transform: `translateY(${scrollPosition * -0.1}px)` }}
              >
                {/* Tree growth visualization */}
                <div className="relative w-full h-full flex flex-col items-center justify-end">
                  {/* Tree trunk/stem that grows with progress */}
                  <div 
                    className="absolute bottom-0 w-4 bg-gradient-to-t from-brown-600 to-green-700 rounded-t-full transition-all duration-700"
                    style={{ height: `${treeGrowth * 3}px`, maxHeight: '300px' }}
                  ></div>
                  
                  {/* Roots that spread out with progress */}
                  {treeGrowth > 20 && (
                    <div className="absolute bottom-0 w-32 h-16">
                      <div className="absolute bottom-0 left-1/2 w-1 h-8 bg-brown-700 rotate-45 origin-bottom"></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-10 bg-brown-700 -rotate-45 origin-bottom"></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-6 bg-brown-700 rotate-[30deg] origin-bottom"></div>
                      <div className="absolute bottom-0 left-1/2 w-1 h-7 bg-brown-700 -rotate-[30deg] origin-bottom"></div>
                    </div>
                  )}
                  
                  {/* Tree canopy/leaves */}
                  <div className="relative z-10" style={{ transform: `scale(${0.5 + (treeGrowth / 100) * 1})` }}>
                    {getTreeComponent()}
                  </div>
                  
                  {/* Fruits (W1 logo-styled) appear when progress is high */}
                  {treeGrowth > 60 && (
                    <div className="absolute" style={{ top: `${200 - treeGrowth}px` }}>
                      <div className="relative">
                        {[...Array(3)].map((_, i) => (
                          <div 
                            key={i} 
                            className="absolute rounded-full bg-w1-primary-accent w-6 h-6 flex items-center justify-center text-xs font-bold text-w1-primary-dark animate-bounce"
                            style={{ 
                              left: `${(i-1) * 30}px`, 
                              animationDelay: `${i * 0.2}s`,
                              animationDuration: '2s'
                            }}
                          >
                            W1
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Progress indicator */}
                <div className="mt-8 w-full max-w-[200px]">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-w1-primary-accent h-2.5 rounded-full transition-all duration-700" 
                      style={{ width: `${treeGrowth}%` }}
                    ></div>
                  </div>
                  <p className="text-center mt-2 text-w1-secondary-text">
                    {Math.round(treeGrowth)}% completo
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action at bottom */}
          <div className="mt-20 text-center">
            <p className="text-w1-secondary-text mb-4">
              Precisa de ajuda com o próximo passo?
            </p>
            <Button 
              variant="outline" 
              className="border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10"
              asChild
            >
              <Link to="/members">
                Acessar Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapProgress;
