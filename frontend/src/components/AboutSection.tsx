
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const AboutSection = () => {
  return (
    <section className="w1-section bg-w1-bg-light" id="about">
      <div className="w1-container">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          {/* Image side */}
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <div className="rounded-xl overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1527576539890-dfa815648363?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="W1 Consultoria Patrimonial" 
                className="w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
          </div>
          
          {/* Content side */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <span className="text-w1-primary-accent uppercase tracking-wider">Quem somos</span>
            <h2 className="text-w1-text-dark mt-2 mb-8">
              W1 Consultoria Patrimonial: Sinônimo de Excelência em Gestão Patrimonial
            </h2>
            
            <div className="space-y-6">
              <p className="text-w1-secondary-text">
                Com um legado de mais de 40 anos de sucesso na Europa, a W1 se estabeleceu como pioneira e 
                líder no mercado de consultoria financeira no Brasil.
              </p>
              <p className="text-w1-secondary-text">
                Desde 2010, ajudamos mais de 100 mil clientes a alcançar seus objetivos financeiros, e hoje 
                contamos com uma equipe de mais de 800 consultores especializados.
              </p>
              <p className="text-w1-secondary-text">
                Em 2022, demos um passo além com o nascimento da W1 Consultoria Patrimonial. Nossa visão é 
                simples mas poderosa: oferecer uma gestão patrimonial e planejamento sucessório incomparáveis.
              </p>
              <p className="text-w1-secondary-text">
                Com uma equipe multidisciplinar de profissionais nas áreas jurídica, tributária, contábil, 
                econômica e gerencial, estamos equipados para fornecer um serviço que é tão único quanto cada 
                um de nossos clientes.
              </p>
            </div>
            
            <div className="mt-8">
              <Button className="w1-button-primary">
                Dê o Primeiro Passo <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
