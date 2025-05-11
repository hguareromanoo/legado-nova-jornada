
import { Lock, BarChart2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface BenefitProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitProps) => {
  return (
    <div className="flex flex-col items-center text-center p-8 bg-white rounded-xl shadow-lg transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="w-14 h-14 rounded-full bg-w1-primary-accent/10 flex items-center justify-center text-w1-primary-accent mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-w1-secondary-text">{description}</p>
    </div>
  );
};

const BenefitsSection = () => {
  const benefits = [
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Confidencialidade Absoluta",
      description: "Nós valorizamos sua privacidade tanto quanto você. Seus detalhes e decisões são tratados com o mais alto grau de discrição."
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: "Governança Fortalecida",
      description: "Decisões sobre o seu patrimônio devem ser claras e eficientes. Nossas estruturas garantem que cada escolha reflita seus objetivos e reduza conflitos."
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Soluções Adaptativas",
      description: "Conforme a vida muda, suas necessidades também. Nossas estratégias evoluem com você, garantindo que seu legado permaneça resiliente e relevante."
    }
  ];

  return (
    <section className="w1-section bg-gradient-to-b from-w1-primary-dark to-[#1A2C3E] text-white" id="benefits">
      <div className="w1-container">
        <div className="text-center mb-16">
          <h2 className="text-white mb-4">Vantagens únicas</h2>
          <p className="text-white/80 max-w-3xl mx-auto">
            Por que escolher a W1 Consultoria Patrimonial? Porque seu legado merece nada menos que excelência:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              icon={benefit.icon}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button className="w1-button-primary">
            Explore as Vantagens <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
