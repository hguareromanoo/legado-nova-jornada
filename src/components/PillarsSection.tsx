
import { Shield, Users, Building2, ReceiptText, Home } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useState, useEffect, useRef } from 'react';

interface PillarCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  delay?: number;
}

const PillarCard = ({ title, description, icon, delay = 0 }: PillarCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
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
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <CardHeader className="pb-2">
          <div className="w-12 h-12 rounded-full bg-w1-primary-accent/10 flex items-center justify-center text-w1-primary-accent mb-4 group-hover:bg-w1-primary-accent group-hover:text-w1-primary-dark transition-colors duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-semibold">{title}</h3>
        </CardHeader>
        <CardContent>
          <p className="text-w1-secondary-text">{description}</p>
        </CardContent>
      </Card>
    </div>
  );
};

const PillarsSection = () => {
  const pillars = [
    {
      title: "Proteção",
      description: "Segurança completa para seus ativos físicos com cobertura de seguros personalizados que protegem seu patrimônio contra imprevistos.",
      icon: <Shield className="h-6 w-6" />,
    },
    {
      title: "Prevenção de Conflitos",
      description: "Planejamento sucessório detalhado que estabelece regras claras para a distribuição de ativos, evitando disputas familiares.",
      icon: <Users className="h-6 w-6" />,
    },
    {
      title: "Estrutura de Holding",
      description: "Criamos regras definidas de sucessão e transferência de ações da holding, garantindo uma transição patrimonial suave e segura.",
      icon: <Building2 className="h-6 w-6" />,
    },
    {
      title: "Redução Tributária",
      description: "Estratégias inteligentes e legais para minimização ou eliminação de carga tributária, maximizando o valor do seu patrimônio.",
      icon: <ReceiptText className="h-6 w-6" />,
    },
    {
      title: "Rendimento de Aluguel",
      description: "Implementação de estratégias específicas para redução significativa de impostos sobre receitas provenientes de imóveis alugados.",
      icon: <Home className="h-6 w-6" />,
    },
  ];

  return (
    <section className="w1-section bg-white" id="pillars">
      <div className="w1-container">
        <div className="text-center mb-12">
          <span className="text-w1-primary-accent uppercase tracking-wider">Preservar e Perpetuar</span>
          <h2 className="text-w1-text-dark mt-2 mb-4">
            Os 5 Pilares do Nosso Serviço Patrimonial
          </h2>
          <p className="text-w1-secondary-text max-w-3xl mx-auto">
            Nossa abordagem abrangente se baseia em cinco pilares fundamentais que garantem a proteção, 
            o crescimento e a transferência eficiente do seu patrimônio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, index) => (
            <PillarCard
              key={index}
              title={pillar.title}
              description={pillar.description}
              icon={pillar.icon}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
