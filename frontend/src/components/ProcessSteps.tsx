
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface StepProps {
  number: string;
  title: string;
  description: string;
  isActive?: boolean;
}

const Step = ({ number, title, description, isActive = false }: StepProps) => {
  return (
    <div className={`relative flex items-start gap-4 md:gap-6 transition-all duration-300 ${isActive ? 'scale-105' : ''}`}>
      <div 
        className={`flex flex-shrink-0 w-12 h-12 rounded-full items-center justify-center text-lg font-semibold 
        ${isActive 
          ? 'bg-w1-primary-accent text-w1-primary-dark' 
          : 'bg-w1-primary-accent/20 text-w1-primary-accent'}`}
      >
        {number}
      </div>
      <div>
        <h3 className={`text-xl font-medium mb-2 ${isActive ? 'text-w1-primary-accent' : 'text-w1-text-dark'}`}>{title}</h3>
        <p className="text-w1-secondary-text">{description}</p>
      </div>
    </div>
  );
};

const ProcessSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepsRef = useRef<HTMLDivElement>(null);
  
  const steps = [
    {
      number: "01",
      title: "Responda algumas perguntas",
      description: "Preencha o formulário presente nesta página. Esse processo não leva sequer um minuto."
    },
    {
      number: "02",
      title: "Agende sua reunião sem compromisso",
      description: "Nossos especialistas entrarão em contato para agendar uma reunião personalizada para discutir suas necessidades específicas."
    },
    {
      number: "03",
      title: "Estruture sua Holding 100% personalizada",
      description: "Implementamos sua estratégia personalizada com acompanhamento em cada etapa do processo."
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev === steps.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="w1-section bg-white" id="process">
      <div className="w1-container">
        <div className="text-center mb-16">
          <h2 className="text-w1-text-dark mb-4">Seu Legado em Boas Mãos</h2>
          <p className="text-w1-secondary-text max-w-3xl mx-auto">
            Veja como é simples iniciar sua jornada com a W1 Consultoria Patrimonial
          </p>
        </div>

        <div ref={stepsRef} className="max-w-3xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <Step
              key={index}
              number={step.number}
              title={step.title}
              description={step.description}
              isActive={index === activeStep}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="w1-button-primary">
            Dê o primeiro passo <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
