import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CircleDollarSign, Shield, Clock, ArrowDownNarrowWide } from 'lucide-react';
import { motion } from 'framer-motion';

const SimulationIntro = () => {
  const navigate = useNavigate();
  
  const startSimulation = () => {
    navigate('/simulation-questions');
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark text-white py-20">
        <div className="w1-container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Descubra quanto você pode economizar com uma Holding Familiar
                </h1>
                
                <p className="text-xl mb-8 text-white/80">
                  Responda algumas perguntas simples e obtenha uma estimativa personalizada dos benefícios fiscais e sucessórios para seu patrimônio.
                </p>
                
                <Button 
                  onClick={startSimulation}
                  size="lg"
                  className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark text-lg px-8 py-6 h-auto font-medium"
                >
                  Iniciar simulação
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="hidden md:block"
            >
              <div className="relative">
                <div className="bg-white p-8 rounded-xl shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-w1-primary-accent/20 p-3 rounded-full">
                      <CircleDollarSign className="w-8 h-8 text-w1-primary-accent" />
                    </div>
                    <div>
                      <h3 className="text-w1-primary-dark text-xl font-semibold">Simulação de economia</h3>
                      <p className="text-gray-600">Holding Patrimonial</p>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="text-gray-500 mb-2">Economia estimada em 10 anos</p>
                      <p className="text-4xl font-bold text-w1-primary-dark">R$ 850.000</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">ITCMD</p>
                        <p className="text-xl font-semibold text-w1-primary-dark">R$ 300.000</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500 mb-1">IR anual</p>
                        <p className="text-xl font-semibold text-w1-primary-dark">R$ 55.000</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -right-6 bg-w1-primary-accent text-w1-primary-dark p-4 rounded-lg font-bold">
                  Exemplo ilustrativo
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-20 bg-gray-50">
        <div className="w1-container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-w1-primary-dark mb-4">
              Principais benefícios de uma Holding Patrimonial
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Uma holding familiar pode te ajudar a proteger seu patrimônio e garantir que ele seja transmitido conforme seus desejos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="bg-w1-primary-accent/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <CircleDollarSign className="w-8 h-8 text-w1-primary-accent" />
              </div>
              <h3 className="text-xl font-semibold text-w1-primary-dark mb-3">
                Economia fiscal
              </h3>
              <p className="text-gray-600">
                Reduza significativamente sua carga tributária em aluguéis, ganho de capital e na transmissão de bens aos seus herdeiros.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="bg-w1-primary-accent/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-w1-primary-accent" />
              </div>
              <h3 className="text-xl font-semibold text-w1-primary-dark mb-3">
                Sucessão simplificada
              </h3>
              <p className="text-gray-600">
                Elimine o processo de inventário e transmita seus bens de forma planejada, rápida e com menor custo.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-sm"
            >
              <div className="bg-w1-primary-accent/20 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-w1-primary-accent" />
              </div>
              <h3 className="text-xl font-semibold text-w1-primary-dark mb-3">
                Proteção patrimonial
              </h3>
              <p className="text-gray-600">
                Proteja seus bens de credores, processos judiciais e garanta que sejam transferidos conforme sua vontade.
              </p>
            </motion.div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Button 
              onClick={startSimulation}
              variant="outline" 
              size="lg"
              className="border-w1-primary-dark text-w1-primary-dark hover:bg-w1-primary-dark/10"
            >
              Simular minha economia
              <ArrowDownNarrowWide className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Final CTA */}
      <div className="bg-w1-primary-dark py-16">
        <div className="w1-container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Comece sua simulação gratuita agora
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Descubra quanto você pode economizar e como proteger melhor seu patrimônio em apenas 3 minutos.
          </p>
          <Button 
            onClick={startSimulation}
            size="lg"
            className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark text-lg px-8 py-6 h-auto font-medium"
          >
            Iniciar simulação
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <p className="text-sm text-white/60 mt-4">
            Sem compromisso ou cadastro obrigatório
          </p>
        </div>
      </div>
    </div>
  );
};

export default SimulationIntro;
