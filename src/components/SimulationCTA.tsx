
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SimulationCTA = () => {
  return (
    <section className="bg-w1-primary-dark text-white py-20">
      <div className="w1-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Personalize seu plano</h2>
          <p className="text-lg mb-8">
            Descubra quanto você pode economizar em impostos com uma holding personalizada para seu patrimônio.
          </p>
          <Button
            size="lg"
            className="bg-w1-primary-accent hover:bg-w1-primary-accent/90 text-w1-primary-dark text-lg px-8 py-6 h-auto font-semibold"
            asChild
          >
            <Link to="/simulation">
              Fazer simulação gratuita
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SimulationCTA;
