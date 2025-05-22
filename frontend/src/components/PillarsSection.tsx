
import { Shield, Users, Building2, Coins, Home } from 'lucide-react';

const PillarCard = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg bg-gradient-to-b from-w1-primary-dark/90 to-w1-primary-dark border border-w1-primary-accent/20 transition-all hover:border-w1-primary-accent/50 hover:shadow-lg hover:shadow-w1-primary-accent/10 group">
      <div className="w-16 h-16 rounded-full bg-w1-primary-accent/10 flex items-center justify-center mb-4 group-hover:bg-w1-primary-accent/20 transition-all">
        <Icon className="w-8 h-8 text-w1-primary-accent" />
      </div>
      <h3 className="text-xl font-semibold mb-3 text-w1-text-light group-hover:text-w1-primary-accent transition-all">{title}</h3>
      <p className="text-w1-text-light/80 text-center">{description}</p>
    </div>
  );
};

const PillarsSection = () => {
  const pillars = [
    {
      icon: Shield,
      title: "Proteção",
      description: "Garantia de segurança para seus ativos físicos e cobertura de seguro abrangente."
    },
    {
      icon: Users,
      title: "Prevenção de Conflitos",
      description: "Planejamento sucessório e estratégias eficientes de distribuição de ativos."
    },
    {
      icon: Building2,
      title: "Estrutura de Holding",
      description: "Regras de sucessão definidas e transferência eficiente de participações da holding."
    },
    {
      icon: Coins,
      title: "Redução Tributária",
      description: "Estratégias para minimização ou isenção de impostos sobre seu patrimônio."
    },
    {
      icon: Home,
      title: "Renda de Aluguel",
      description: "Significativa redução de impostos sobre propriedades e rendas de aluguel."
    }
  ];

  return (
    <section className="bg-gradient-to-b from-w1-primary-dark to-w1-primary-dark/90 py-20 relative overflow-hidden">
      {/* Digital tree background element */}
      <div className="absolute right-0 top-0 w-full h-full opacity-10 pointer-events-none">
        <div 
          className="absolute right-0 h-full w-1/2"
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80")', 
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} 
        />
      </div>

      <div className="w1-container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-w1-primary-accent mb-4">Os 5 Pilares da Consultoria Patrimonial</h2>
          <p className="text-w1-text-light/90 max-w-3xl mx-auto">
            Nosso sistema completo para administração de bens e direitos, desenvolvido para 
            maximizar a proteção e o crescimento do seu patrimônio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 relative">
          {pillars.map((pillar, index) => (
            <PillarCard 
              key={index} 
              icon={pillar.icon} 
              title={pillar.title} 
              description={pillar.description}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <blockquote className="text-w1-text-light/80 text-xl italic">
            "Colhemos o que plantamos. Conquistamos o que planejamos."
          </blockquote>
          <p className="text-w1-primary-accent mt-2">— Filosofia W1</p>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
