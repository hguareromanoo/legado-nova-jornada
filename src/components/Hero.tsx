
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  // Function to handle simulation button click
  const handleSimulationClick = () => {
    // In a real application, this would navigate to the simulation page or open a modal
    window.open('/simulation', '_blank');
  };

  return (
    <section className="relative bg-w1-primary-dark min-h-screen flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-w1-primary-dark to-w1-primary-dark/80 z-10"></div>
      
      {/* Digital tree background with subtle animation */}
      <div 
        className="absolute inset-0 z-0 opacity-50" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1524055988636-436cfa46e59e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} 
      />

      <div className="w1-container relative z-20 pt-24">
        <div className="w-full lg:w-1/2 animate-fade-in opacity-0" style={{ animationDelay: "300ms" }}>
          <span className="text-w1-primary-accent font-medium mb-2 block">W1 Consultoria Patrimonial</span>
          <h1 className="text-w1-text-light font-bold mb-6">
            Protegendo e maximizando seu legado
          </h1>
          <p className="text-w1-text-light/90 text-lg md:text-xl mb-10 max-w-2xl">
            Descubra como a W1 Consultoria Patrimonial transforma a gestão de patrimônios em uma arte sofisticada, 
            assegurando proteção, crescimento e transmissão eficiente do seu legado. 
            Seu futuro começa com a decisão de hoje.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-w1-primary-accent text-w1-primary-dark font-medium py-4 px-8 rounded-lg hover:opacity-90 transition-all text-lg md:text-xl shadow-lg hover:shadow-xl"
              onClick={handleSimulationClick}
            >
              Simular Criação de Holding <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>

          {/* Quote block - W1's philosophy */}
          <div className="mt-16 border-l-4 border-w1-primary-accent pl-6 py-2 opacity-80">
            <p className="text-w1-text-light italic text-xl">"Colhemos o que plantamos.</p>
            <p className="text-w1-text-light italic text-xl">Conquistamos o que planejamos."</p>
          </div>
        </div>
      </div>

      {/* Visual elements suggesting financial growth */}
      <div className="absolute bottom-10 right-10 z-20 hidden lg:block">
        <div className="relative w-80 h-80">
          <div className="absolute bottom-0 right-0 w-full h-full bg-w1-primary-accent/10 rounded-full animate-pulse" style={{animationDuration: "3s"}}></div>
          <div className="absolute bottom-10 right-10 w-3/4 h-3/4 bg-w1-primary-accent/20 rounded-full animate-pulse" style={{animationDuration: "4s"}}></div>
          <div className="absolute bottom-20 right-20 w-1/2 h-1/2 bg-w1-primary-accent/30 rounded-full animate-pulse" style={{animationDuration: "5s"}}></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
