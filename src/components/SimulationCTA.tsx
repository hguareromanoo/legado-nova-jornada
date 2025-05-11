
import { ArrowRight, LineChart, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SimulationCTA = () => {
  // Function to handle simulation button click
  const handleSimulationClick = () => {
    // In a real application, this would navigate to the simulation page or open a modal
    window.open('/simulation', '_blank');
  };

  return (
    <section className="w1-section bg-w1-primary-dark/95 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, ${hexToRgba('#5ADBB5', 0.2)} 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}></div>
      </div>
      
      <div className="w1-container relative z-10">
        <div className="bg-w1-primary-dark/50 backdrop-blur-sm border border-w1-primary-accent/20 p-8 md:p-12 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left max-w-xl">
              <h2 className="text-w1-primary-accent mb-4">Simule a Criação da Sua Holding</h2>
              <p className="text-w1-text-light/90 mb-6">
                Descubra quanto você pode economizar em impostos e como proteger seu patrimônio com 
                nossa ferramenta de simulação gratuita. O processo é simples e leva apenas alguns minutos.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center text-w1-text-light/80">
                  <Shield className="h-5 w-5 mr-2 text-w1-primary-accent" />
                  <span>Proteção Patrimonial</span>
                </div>
                <div className="flex items-center text-w1-text-light/80">
                  <LineChart className="h-5 w-5 mr-2 text-w1-primary-accent" />
                  <span>Economia Tributária</span>
                </div>
              </div>
            </div>
            
            <div>
              <Button 
                className="bg-w1-primary-accent text-w1-primary-dark font-medium py-6 px-8 rounded-lg hover:opacity-90 transition-all text-lg shadow-lg hover:shadow-xl w-full md:w-auto"
                onClick={handleSimulationClick}
              >
                Iniciar Simulação <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Helper function to convert hex to rgba
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default SimulationCTA;
