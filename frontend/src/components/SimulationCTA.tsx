
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SimulationCTA = () => {
  return <section className="bg-gradient-dark text-w1-text-light py-20">
      <div className="w1-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-slate-50">
            Personalize seu <span className="text-w1-primary-accent">plano</span>
          </h2>
          <p className="text-lg mb-8 text-white/80">
            Descubra quanto você pode economizar em impostos com uma holding personalizada para seu patrimônio.
            Assegure proteção, crescimento e transmissão eficiente do seu legado.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark text-lg px-8 py-6 h-auto font-medium" asChild>
              <Link to="/simulation">
                Fazer simulação gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="w1GhostLight" className="text-lg px-8 py-6 h-auto font-medium" asChild>
              <Link to="/cadastro">
                Cadastrar-se agora
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>;
};

export default SimulationCTA;
