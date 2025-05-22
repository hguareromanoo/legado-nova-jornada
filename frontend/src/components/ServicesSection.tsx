
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useRef } from 'react';

interface ServiceCardProps {
  title: string;
  description: string;
  index: number;
}

const ServiceCard = ({ title, description, index }: ServiceCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, index * 200);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className={`w1-card transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-w1-secondary-text mb-6">{description}</p>
    </div>
  );
};

const ServicesSection = () => {
  const services = [
    {
      title: "Estruturação de Holdings Personalizadas",
      description: "Criamos estruturas de holding personalizadas que se adaptam às suas necessidades únicas. Isso significa mais controle, flexibilidade e eficiência tributária na gestão de seus ativos, garantindo que seu legado seja transmitido de acordo com seus desejos."
    },
    {
      title: "Planejamento Sucessório Detalhado",
      description: "Nossa abordagem detalhada ao planejamento sucessório garante uma transição suave dos seus bens, com clareza e previsibilidade. Isso assegura que suas vontades sejam respeitadas, e sua família esteja protegida e bem-informada em cada etapa."
    },
    {
      title: "Blindagem Patrimonial Robusta",
      description: "Implementamos estratégias robustas de blindagem patrimonial para proteger seus ativos contra riscos e incertezas, garantindo que seu patrimônio esteja seguro e permitindo que você e sua família desfrutem de maior tranquilidade e segurança."
    },
    {
      title: "Gestão de Patrimônio Inteligente",
      description: "Com nossa gestão de patrimônio inteligente e orientada por especialistas, você vai além da simples conservação dos seus ativos. Valorizamos e expandimos seu legado com estratégias personalizadas, alinhadas com suas metas de longo prazo e visão para o futuro."
    }
  ];

  return (
    <section className="w1-section bg-w1-bg-light" id="services">
      <div className="w1-container">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/3">
            <span className="text-w1-primary-accent uppercase tracking-wider">Preservar e Perpetuar</span>
            <h2 className="text-w1-text-dark mt-2 mb-8">
              Estratégias sob medida para o seu legado
            </h2>
            <Button className="w1-button-primary">
              Personalize seu plano <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                title={service.title}
                description={service.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
