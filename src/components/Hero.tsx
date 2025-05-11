
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-w1-primary-dark min-h-screen flex items-center overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-w1-primary-dark to-w1-primary-dark/80 z-10"></div>
      
      {/* Background image, we'll use an external image for now */}
      <div 
        className="absolute inset-0 z-0 opacity-50" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80")', 
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
            <Button className="w1-button-primary">
              Descubra Nossas Soluções <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
