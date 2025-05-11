
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BarChart2, Home, Car, Plane, Clock, Users } from "lucide-react";
import { 
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Simulation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    totalAssets: "",
    monthlyRentalIncome: "",
    businessIncome: "",
    familyMembers: "",
  });
  const [taxSavings, setTaxSavings] = useState<number | null>(null);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const calculateTaxSavings = () => {
    // Mock calculation - would be more sophisticated in real implementation
    const totalAssets = parseFloat(formData.totalAssets) || 0;
    const monthlyRental = parseFloat(formData.monthlyRentalIncome) || 0;
    const businessIncome = parseFloat(formData.businessIncome) || 0;
    
    // Simple calculation for demo purposes
    const estimatedSavings = (totalAssets * 0.02) + (monthlyRental * 12 * 0.15) + (businessIncome * 0.08);
    setTaxSavings(estimatedSavings);
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      if (step === 2) {
        calculateTaxSavings();
      }
    } else if (step === 3 && !showReport) {
      // Show the visual report after user clicks on the last step
      setShowReport(true);
    } else {
      // For demonstration, we'll just redirect to the login page
      navigate('/login');
    }
  };

  const prevStep = () => {
    if (step > 1 && !showReport) {
      setStep(step - 1);
    } else if (showReport) {
      setShowReport(false);
    }
  };

  // Data for charts
  const assetDistributionData = [
    { name: 'Imóveis', value: 65 },
    { name: 'Investimentos', value: 20 },
    { name: 'Empresas', value: 10 },
    { name: 'Outros', value: 5 }
  ];

  const savingsProjectionData = [
    { year: '2025', withoutHolding: 50000, withHolding: 120000 },
    { year: '2026', withoutHolding: 52000, withHolding: 130000 },
    { year: '2027', withoutHolding: 54000, withHolding: 142000 },
    { year: '2028', withoutHolding: 56000, withHolding: 156000 },
    { year: '2029', withoutHolding: 58000, withHolding: 170000 },
  ];

  const COLORS = ['#5ADBB5', '#36B37E', '#00875A', '#00C781'];

  // Savings objectives based on the tax savings
  const generateSavingsObjectives = (savings: number) => {
    const carValue = savings * 0.3;
    const travelValue = savings * 0.2;
    const familyTimeValue = savings * 0.5;
    
    const cars = Math.floor(carValue / 80000);
    
    return {
      cars: cars > 0 ? cars : 1,
      travel: true,
      familyTime: Math.floor(familyTimeValue / 20000) // Time measured in months
    };
  };

  const objectives = taxSavings ? generateSavingsObjectives(taxSavings) : { cars: 0, travel: false, familyTime: 0 };

  return (
    <div className="min-h-screen bg-w1-primary-dark text-w1-text-light">
      {/* Simple header with home button */}
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <a href="/" className="flex items-center text-w1-text-light">
          <Home size={20} className="mr-2" />
          <span className="font-bold">W1 Consultoria</span>
        </a>
      </div>
      
      <div className="w1-container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Simulação de Holding</h1>
          
          {!showReport ? (
            <>
              {/* Progress bar */}
              <div className="w-full bg-gray-700 h-2 rounded-full mb-8">
                <div 
                  className="bg-w1-primary-accent h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
              
              {/* Form steps */}
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg">
                {step === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-4">Informações de Patrimônio</h2>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="totalAssets">Valor total estimado dos ativos (R$)</Label>
                        <Input 
                          id="totalAssets"
                          name="totalAssets"
                          type="number" 
                          placeholder="Ex: 5000000"
                          value={formData.totalAssets}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="monthlyRentalIncome">Renda mensal com aluguéis (R$)</Label>
                        <Input 
                          id="monthlyRentalIncome"
                          name="monthlyRentalIncome"
                          type="number" 
                          placeholder="Ex: 20000"
                          value={formData.monthlyRentalIncome}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-4">Informações Adicionais</h2>
                    
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="businessIncome">Renda empresarial anual (R$)</Label>
                        <Input 
                          id="businessIncome"
                          name="businessIncome"
                          type="number" 
                          placeholder="Ex: 500000"
                          value={formData.businessIncome}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="familyMembers">Número de membros familiares para sucessão</Label>
                        <Input 
                          id="familyMembers"
                          name="familyMembers"
                          type="number" 
                          placeholder="Ex: 3"
                          value={formData.familyMembers}
                          onChange={handleInputChange}
                          className="bg-gray-700 border-gray-600 text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-2xl font-semibold mb-4">Resultado da Simulação</h2>
                    
                    <div className="text-center py-6">
                      <BarChart2 size={60} className="mx-auto mb-4 text-w1-primary-accent" />
                      <h3 className="text-xl font-medium mb-2">Economia Estimada em Impostos</h3>
                      <p className="text-4xl font-bold text-w1-primary-accent mb-4">
                        {taxSavings ? `R$ ${taxSavings.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}` : "Calculando..."}
                      </p>
                      <p className="text-gray-400">anualmente</p>
                    </div>

                    <div className="bg-gray-700/50 rounded p-4 text-sm">
                      <p className="mb-3">Para acessar seu relatório completo e começar o processo de criação da sua holding, registre-se ou faça login.</p>
                      <p>Nossa equipe especializada está pronta para auxiliá-lo em cada etapa do processo.</p>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="mt-8 flex justify-between">
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      className="text-w1-text-light border-gray-600"
                    >
                      Voltar
                    </Button>
                  )}
                  <div className={step === 1 ? "ml-auto" : ""}>
                    <Button 
                      onClick={nextStep}
                      className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90"
                    >
                      {step === 3 ? (
                        <span className="flex items-center">
                          Ver relatório detalhado <ChevronRight size={16} className="ml-1" />
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Próximo <ChevronRight size={16} className="ml-1" />
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Visual Report */
            <div className="animate-fade-in">
              <div className="bg-gray-800 rounded-lg p-8 shadow-lg mb-6">
                <h2 className="text-2xl font-semibold mb-6 text-center">Relatório de Economia Tributária</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-center">Distribuição de Ativos</h3>
                    <div className="h-64 flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={assetDistributionData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {assetDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-center">Projeção de Economia (5 anos)</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={savingsProjectionData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`R$ ${Number(value).toLocaleString('pt-BR')}`]} />
                          <Bar name="Sem Holding" dataKey="withoutHolding" fill="#8884d8" />
                          <Bar name="Com Holding" dataKey="withHolding" fill="#5ADBB5" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4 text-center">O Que Você Pode Fazer Com Sua Economia</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-700/50 p-6 rounded-lg text-center">
                      <div className="bg-w1-primary-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Car className="text-w1-primary-accent" size={32} />
                      </div>
                      <h4 className="font-medium text-lg mb-2">
                        {objectives.cars} {objectives.cars > 1 ? 'Carros de Luxo' : 'Carro de Luxo'}
                      </h4>
                      <p className="text-gray-400 text-sm">
                        Renovados a cada 2 anos
                      </p>
                    </div>
                    
                    <div className="bg-gray-700/50 p-6 rounded-lg text-center">
                      <div className="bg-w1-primary-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plane className="text-w1-primary-accent" size={32} />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Viagens Internacionais</h4>
                      <p className="text-gray-400 text-sm">
                        Uma viagem à Europa por ano
                      </p>
                    </div>
                    
                    <div className="bg-gray-700/50 p-6 rounded-lg text-center">
                      <div className="bg-w1-primary-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="text-w1-primary-accent" size={32} />
                      </div>
                      <h4 className="font-medium text-lg mb-2">Tempo com a Família</h4>
                      <p className="text-gray-400 text-sm">
                        {objectives.familyTime} meses adicionais de lazer
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-700/30 p-6 rounded-lg mb-8">
                  <h3 className="text-lg font-medium mb-3">Próximos Passos para Criar Sua Holding</h3>
                  <p className="text-gray-300 mb-4">
                    Ao criar sua holding personalizada, você terá acesso a todas essas vantagens e mais. Nossa equipe de especialistas irá guiá-lo em cada etapa do processo.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => navigate('/login')}
                      className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90 px-8"
                      size="lg"
                    >
                      Criar minha conta e iniciar o processo
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevStep}
                  className="text-w1-text-light border-gray-600"
                >
                  Voltar à simulação
                </Button>
                
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90"
                >
                  Criar minha conta
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
