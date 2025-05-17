import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  return <div className="relative min-h-screen flex items-center justify-center bg-w1-primary-dark text-w1-text-light pt-16">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/30 z-0"></div>
      
      {/* Background image */}
      <img src="/lovable-uploads/b955e097-2edd-4223-bf6f-4cbb102362f8.png" alt="Consultores financeiros ajudando cliente" className="absolute inset-0 w-full h-full object-cover object-center z-[-1]" />
      
      <div className="w1-container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-slate-50">
            Protegendo e maximizando seu legado
          </h1>
          <p className="text-xl md:text-2xl mb-8 leading-relaxed font-light text-gray-200 px-0">
            Descubra como a W1 Consultoria Patrimonial transforma a gestão de patrimônios em uma arte sofisticada, assegurando proteção, crescimento e transmissão eficiente do seu legado.
          </p>
          <Button size="lg" className="bg-w1-primary-accent hover:bg-w1-primary-accent/90 text-w1-primary-dark text-lg px-8 py-6 h-auto font-semibold" asChild>
            <Link to="/simulation">
              Fazer simulação de Holding
            </Link>
          </Button>
        </div>
      </div>
    </div>;
};
export default Hero;