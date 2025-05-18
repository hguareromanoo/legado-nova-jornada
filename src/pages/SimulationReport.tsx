
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  CircleCheck, 
  ArrowRight, 
  Building, 
  FileText, 
  Users, 
  Clock, 
  Shield, 
  Euro
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const SimulationReport = () => {
  const navigate = useNavigate();
  const [simulationData, setSimulationData] = useState(null);
  const [estimatedSavings, setEstimatedSavings] = useState(null);
  const [taxBreakdown, setTaxBreakdown] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Retrieve simulation data and calculated savings from localStorage
    const storedSimulationData = localStorage.getItem('simulationData');
    const storedEstimatedSavings = localStorage.getItem('estimatedSavings');
    const storedTaxBreakdown = localStorage.getItem('taxBreakdown');
    
    if (storedSimulationData) {
      setSimulationData(JSON.parse(storedSimulationData));
    }
    
    if (storedEstimatedSavings) {
      setEstimatedSavings(JSON.parse(storedEstimatedSavings));
    }
    
    if (storedTaxBreakdown) {
      setTaxBreakdown(JSON.parse(storedTaxBreakdown));
    }
    
    setLoading(false);
  }, []);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <Progress value={80} className="w-40 h-2" />
          </div>
          <p className="text-gray-600">Preparando seu relatório personalizado...</p>
        </div>
      </div>
    );
  }
  
  // If no simulation data is found, redirect to simulation page
  if (!simulationData || !estimatedSavings || !taxBreakdown) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-6">Nenhum dado de simulação encontrado</h1>
          <p className="mb-6">Para obter um relatório personalizado, complete nossa simulação.</p>
          <Button 
            onClick={() => navigate('/simulation')}
            className="bg-w1-primary-dark hover:bg-opacity-90"
          >
            Fazer simulação
          </Button>
        </div>
      </div>
    );
  }
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Extract relevant data
  const finalYear = estimatedSavings[estimatedSavings.length - 1];
  const totalSavings = taxBreakdown.total;
  const annualSavings = Math.round(totalSavings / 10); // 10-year projection to annual
  
  // Calculate equivalents for visualization
  const euroTripCost = 20000; // estimated cost of Europe trip
  const euroTripsPerYear = Math.floor(annualSavings / euroTripCost);
  const bmwX1Cost = 300000; // cost of BMW X1
  const bmwsAfterFiveYears = Math.floor((annualSavings * 5) / bmwX1Cost);
  
  // Get user's main objective
  const getUserObjective = () => {
    if (!simulationData.goals || simulationData.goals.length === 0) {
      return 'proteger seu patrimônio';
    }
    
    const goalMapping = {
      'reduceTax': 'reduzir impostos sobre renda de aluguel',
      'avoidProbate': 'evitar inventário e conflitos familiares',
      'protectAssets': 'proteger patrimônio contra riscos',
      'planSuccession': 'planejar sucessão para seus filhos',
      'professionalizeManagement': 'profissionalizar gestão patrimonial'
    };
    
    return goalMapping[simulationData.goals[0]] || 'proteger seu patrimônio';
  };
  
  const stateAliquot = {
    'SP': 4,
    'RJ': 4,
    'MG': 5,
    'RS': 4,
    'SC': 8,
    'PR': 4,
    'DF': 4,
    'GO': 4,
    // default values for other states
    'default': 4
  };
  
  const userState = simulationData.state || 'SP';
  const itcmdRate = stateAliquot[userState] || stateAliquot['default'];
  
  // Get estimated value based on net worth
  const getEstimatedPatrimony = () => {
    switch(simulationData.netWorth) {
      case 'under500k': return 500000;
      case '500kTo2m': return 2000000;
      case '2mTo5m': return 5000000;
      case '5mTo10m': return 10000000;
      case 'above10m': return 15000000;
      default: return 2000000;
    }
  };
  
  const estimatedPatrimony = getEstimatedPatrimony();
  const estimatedITCMD = Math.round(estimatedPatrimony * (itcmdRate / 100));
  const monthlyRentalIncome = simulationData.rentalIncome * 1000;
  const annualRentalIncome = monthlyRentalIncome * 12;
  const currentRentalTax = annualRentalIncome * 0.275; // 27.5% IRPF
  const holdingRentalTax = annualRentalIncome * 0.1133; // 11.33% for Lucro Presumido
  const rentalTaxSavings = currentRentalTax - holdingRentalTax;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark py-20 px-4 text-white">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center justify-center bg-white/10 rounded-full px-4 py-2 mb-6">
              <CircleCheck className="w-5 h-5 mr-2 text-w1-primary-accent" />
              <span className="text-sm">Sua simulação foi concluída com sucesso</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Você pode economizar até {' '}
              <span className="text-w1-primary-accent">
                {formatCurrency(totalSavings)}
              </span> em impostos
            </h1>
            
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Com uma holding patrimonial, você pode reduzir significativamente sua carga tributária e 
              proteger seu patrimônio para as próximas gerações.
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/cadastro')}
              size="lg"
              className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark text-lg px-8 py-6 h-auto font-medium"
            >
              Quero me proteger
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-white"></path>
          </svg>
        </div>
      </section>
      
      {/* Comparison Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-2 text-center">
            Sua Estrutura Atual vs Com Holding Patrimonial
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Veja como uma holding patrimonial pode transformar sua situação financeira e sucessória
          </p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="overflow-hidden rounded-xl shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100 w-1/3">Aspecto</TableHead>
                    <TableHead className="bg-gray-100">Estrutura Atual</TableHead>
                    <TableHead className="bg-w1-primary-dark/10">Com Holding</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-w1-primary-accent" />
                      ITCMD estimado
                    </TableCell>
                    <TableCell>
                      {formatCurrency(estimatedITCMD)}
                    </TableCell>
                    <TableCell className="bg-w1-primary-dark/5 text-w1-primary-dark font-medium">
                      Economia potencial de até {formatCurrency(estimatedITCMD * 0.9)}
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-w1-primary-accent" />
                      Tempo de inventário
                    </TableCell>
                    <TableCell>
                      2 a 4 anos com custo elevado
                    </TableCell>
                    <TableCell className="bg-w1-primary-dark/5 text-w1-primary-dark font-medium">
                      Imediato com doação de quotas
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium flex items-center">
                      <Building className="w-5 h-5 mr-2 text-w1-primary-accent" />
                      Imposto sobre aluguel
                    </TableCell>
                    <TableCell>
                      Até 27,5% (IRPF)
                    </TableCell>
                    <TableCell className="bg-w1-primary-dark/5 text-w1-primary-dark font-medium">
                      Cerca de 11,33% via lucro presumido
                    </TableCell>
                  </TableRow>
                  
                  <TableRow>
                    <TableCell className="font-medium flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-w1-primary-accent" />
                      Risco patrimonial
                    </TableCell>
                    <TableCell>
                      Bens em seu nome, sujeitos a disputas
                    </TableCell>
                    <TableCell className="bg-w1-primary-dark/5 text-w1-primary-dark font-medium">
                      Proteção com cláusulas e controle total
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Personalized Estimate */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-2 text-center">
            Sua Estimativa Personalizada
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Com base nas informações que você forneceu, veja o impacto financeiro de uma holding
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-6 h-full">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-w1-primary-dark">
                  <FileText className="w-5 h-5 mr-2 text-w1-primary-accent" />
                  Dados da sua situação
                </h3>
                
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Patrimônio estimado:</span>
                    <span className="font-medium">{formatCurrency(estimatedPatrimony)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-gray-600">Estado:</span>
                    <span className="font-medium">{userState}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-gray-600">Alíquota ITCMD:</span>
                    <span className="font-medium">{itcmdRate}%</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-gray-600">Renda mensal de aluguel:</span>
                    <span className="font-medium">{formatCurrency(monthlyRentalIncome)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-gray-600">Nº de herdeiros:</span>
                    <span className="font-medium">{simulationData.heirs || "Não informado"}</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-w1-primary-dark to-w1-secondary-dark text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Euro className="w-5 h-5 mr-2 text-w1-primary-accent text-white" />
                  Suas economias potenciais
                </h3>
                
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-white/80">Economia total em 10 anos:</span>
                    <span className="font-bold text-lg">{formatCurrency(totalSavings)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-white/80">Economia em ITCMD:</span>
                    <span className="font-bold">{formatCurrency(taxBreakdown.successionTax)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-white/80">Economia em IR sobre aluguel:</span>
                    <span className="font-bold">{formatCurrency(taxBreakdown.incomeTax)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-white/80">Economia anual média:</span>
                    <span className="font-bold">{formatCurrency(annualSavings)}</span>
                  </li>
                  
                  <li className="flex justify-between">
                    <span className="text-white/80">Economia mensal média:</span>
                    <span className="font-bold">{formatCurrency(annualSavings/12)}</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Visual Equivalents Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-2 text-center">
            O Que Sua Economia Representa
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Veja na prática o que você poderia fazer com o valor economizado ao longo dos anos
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1499856871958-5b9088d4677f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-w1-primary-dark">
                  Economia anual = {euroTripsPerYear} {euroTripsPerYear > 1 ? 'viagens' : 'viagem'} para Europa
                </h3>
                <p className="text-gray-600">
                  Com {formatCurrency(annualSavings)} economizados a cada ano, você poderia fazer 
                  {euroTripsPerYear > 1 ? ` ${euroTripsPerYear} viagens` : ' uma viagem'} para Europa com a família.
                </p>
                <div className="mt-4 flex">
                  {Array.from({ length: Math.min(euroTripsPerYear, 5) }).map((_, i) => (
                    <span key={i} className="text-2xl mr-2">✈️</span>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="h-48 bg-[url('https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')] bg-cover bg-center"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-w1-primary-dark">
                  Economia de 5 anos = {bmwsAfterFiveYears} {bmwsAfterFiveYears > 1 ? 'BMW X1' : 'BMW X1'}
                </h3>
                <p className="text-gray-600">
                  Com {formatCurrency(annualSavings * 5)} economizados em 5 anos, você poderia comprar 
                  {bmwsAfterFiveYears > 1 ? ` ${bmwsAfterFiveYears} carros de luxo` : ' um carro de luxo'}.
                </p>
                <div className="mt-4 flex">
                  {Array.from({ length: Math.min(bmwsAfterFiveYears, 5) }).map((_, i) => (
                    <span key={i} className="text-2xl mr-2">🚗</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* What is a Holding Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-2 text-center">
            O que é uma Holding e por que ela importa para você
          </h2>
          <p className="text-gray-600 text-center mb-10">
            Descubra como uma Holding pode especificamente ajudar você a {getUserObjective()}
          </p>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-start mb-6">
              <div className="bg-w1-primary-accent/20 p-3 rounded-full mr-4">
                <Building className="w-6 h-6 text-w1-primary-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-w1-primary-dark mb-2">
                  Holding patrimonial é uma "fortaleza" jurídica para seu patrimônio
                </h3>
                <p className="text-gray-600">
                  Você mantém o controle total — e ainda protege, organiza e antecipa sua sucessão com inteligência.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <FileText className="w-5 h-5 text-w1-primary-accent mr-2" />
                  <h4 className="font-medium text-w1-primary-dark">Redução de ITCMD</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  A economia equivale a {euroTripsPerYear > 1 ? `${euroTripsPerYear} viagens` : 'uma viagem'} para Europa por ano, apenas planejando sua sucessão com inteligência.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Clock className="w-5 h-5 text-w1-primary-accent mr-2" />
                  <h4 className="font-medium text-w1-primary-dark">Fim do inventário</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Sem filas, sem travas, sem desgaste emocional. A transferência de bens ocorre de forma planejada e sem burocracia.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Building className="w-5 h-5 text-w1-primary-accent mr-2" />
                  <h4 className="font-medium text-w1-primary-dark">Aluguel com menos imposto</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Mais dinheiro todo mês para reinvestir ou curtir. A economia mensal pode chegar a {formatCurrency(rentalTaxSavings/12)}.
                </p>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Users className="w-5 h-5 text-w1-primary-accent mr-2" />
                  <h4 className="font-medium text-w1-primary-dark">Família protegida</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Sem disputas, com tudo previamente planejado. Você define em vida como seu patrimônio será distribuído.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-w1-primary-dark via-w1-secondary-dark to-w1-primary-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transforme esse plano em ação
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Agora que você já entendeu o impacto da holding no seu patrimônio, que tal dar o primeiro passo?
              Crie sua conta e comece a estruturar sua proteção hoje mesmo.
            </p>
            
            <Button
              onClick={() => navigate('/cadastro')}
              size="lg"
              className="bg-white hover:bg-gray-100 text-w1-primary-dark text-lg px-8 py-6 h-auto font-medium"
            >
              Quero me proteger
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SimulationReport;
