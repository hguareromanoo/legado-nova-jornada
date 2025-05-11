
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ChevronRight, BarChart2, Home } from "lucide-react";

const Simulation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    totalAssets: "",
    monthlyRentalIncome: "",
    businessIncome: "",
    familyMembers: "",
  });
  const [taxSavings, setTaxSavings] = useState<number | null>(null);
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
    } else {
      // For demonstration, we'll just redirect to the login page
      navigate('/login');
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

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
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Simulação de Holding</h1>
          
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
                      Criar minha conta <ChevronRight size={16} className="ml-1" />
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
        </div>
      </div>
    </div>
  );
};

export default Simulation;
