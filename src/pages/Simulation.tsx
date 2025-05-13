import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Simulation = () => {
  const [step, setStep] = useState(1);
  const [propertyValue, setPropertyValue] = useState('');
  const [hasChildren, setHasChildren] = useState<string | null>(null);
  const [numProperties, setNumProperties] = useState('1');
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const calculateSavings = () => {
    const value = parseFloat(propertyValue.replace(/[^0-9]/g, ''));
    
    // Basic calculation (simplified for demonstration)
    const withoutHolding = value * 0.04; // 4% ITCMD tax example
    const withHolding = value * 0.015; // 1.5% with holding structure
    const savings = withoutHolding - withHolding;
    
    return {
      withoutHolding: withoutHolding,
      withHolding: withHolding,
      savings: savings
    };
  };

  const handleNextStep = () => {
    if (step === 1 && !propertyValue) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe o valor aproximado do seu patrimônio.",
        variant: "destructive",
      });
      return;
    }

    if (step === 2 && !hasChildren) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe se você tem filhos.",
        variant: "destructive",
      });
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Show results after completing all steps
      setShowResults(true);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const formatCurrency = (value: string) => {
    const onlyNumbers = value.replace(/\D/g, '');
    if (!onlyNumbers) return '';
    
    const number = parseInt(onlyNumbers, 10) / 100;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(number);
  };

  const handlePropertyValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCurrency(e.target.value);
    setPropertyValue(formattedValue);
  };

  const savings = calculateSavings();

  const handleContinue = () => {
    // Navigate to onboarding page instead of login
    navigate('/onboarding');
  };

  const savingsObjectives = [
    { title: "Viagem para Europa", value: (savings.savings * 0.2), icon: "✈️" },
    { title: "Investimentos", value: (savings.savings * 0.4), icon: "📈" },
    { title: "Educação dos filhos", value: (savings.savings * 0.3), icon: "🎓" },
    { title: "Renovação de veículos", value: (savings.savings * 0.1), icon: "🚗" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="w1-container">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <Link to="/" className="text-w1-primary-dark font-bold text-2xl mb-8 inline-block hover:opacity-80">
              W1
            </Link>
            
            {!showResults ? (
              <>
                <div className="mb-8">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">Simulação de Holding Familiar</h1>
                  <p className="text-gray-600">
                    Descubra quanto você pode economizar em impostos com uma estrutura de holding personalizada.
                  </p>
                </div>
                
                <div className="flex items-center mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          i <= step ? 'bg-w1-primary-accent text-w1-primary-dark' : 'bg-gray-200 text-gray-500'
                        } font-semibold`}
                      >
                        {i < step ? <CheckCircle size={16} /> : i}
                      </div>
                      {i < 3 && (
                        <div 
                          className={`h-1 w-16 ${i < step ? 'bg-w1-primary-accent' : 'bg-gray-200'}`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Step 1: Property Value */}
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Qual o valor aproximado do seu patrimônio?</h2>
                    <p className="text-gray-600 text-sm">
                      Incluindo imóveis, investimentos, participações societárias e outros bens.
                    </p>
                    <div className="space-y-2">
                      <Label htmlFor="property-value">Valor</Label>
                      <Input
                        id="property-value"
                        placeholder="R$ 0,00"
                        value={propertyValue}
                        onChange={handlePropertyValueChange}
                        className="text-lg"
                      />
                    </div>
                  </div>
                )}
                
                {/* Step 2: Family Information */}
                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Você tem filhos?</h2>
                    <RadioGroup value={hasChildren || ""} onValueChange={setHasChildren}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="has-children-yes" />
                        <Label htmlFor="has-children-yes">Sim</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="has-children-no" />
                        <Label htmlFor="has-children-no">Não</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                {/* Step 3: Property Details */}
                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold">Quantos imóveis compõem seu patrimônio?</h2>
                    <RadioGroup value={numProperties} onValueChange={setNumProperties}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="1" id="properties-1" />
                        <Label htmlFor="properties-1">1 imóvel</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="2-3" id="properties-2-3" />
                        <Label htmlFor="properties-2-3">2 a 3 imóveis</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="4+" id="properties-4+" />
                        <Label htmlFor="properties-4+">4 ou mais imóveis</Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}
                
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <Button 
                      variant="outline" 
                      onClick={handlePrevStep}
                    >
                      Voltar
                    </Button>
                  )}
                  <Button 
                    className="ml-auto bg-w1-primary-dark text-white hover:bg-opacity-90"
                    onClick={handleNextStep}
                  >
                    {step < 3 ? 'Avançar' : 'Ver resultados'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              // Results screen with visual report
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Excelente Oportunidade!</h2>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <p className="text-xl font-semibold text-green-800 mb-2">
                      Você pode economizar aproximadamente
                    </p>
                    <p className="text-4xl font-bold text-green-700">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savings.savings)}
                    </p>
                    <p className="text-sm text-green-600 mt-2">em impostos com uma estrutura de holding familiar</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Sem Holding</h3>
                    <p className="text-2xl font-bold text-red-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savings.withoutHolding)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">em impostos sobre herança (ITCMD)</p>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-3">Com Holding</h3>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(savings.withHolding)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">em impostos com planejamento</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">O que você poderia fazer com essa economia:</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {savingsObjectives.map((objective, index) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">{objective.icon}</div>
                          <div>
                            <h4 className="font-medium">{objective.title}</h4>
                            <p className="text-w1-primary-accent font-bold">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(objective.value)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mt-6">
                  <h3 className="font-semibold mb-2">Próximo passo</h3>
                  <p className="text-gray-700 mb-4">
                    Escolha como você deseja prosseguir com a criação da sua holding familiar.
                  </p>
                  <Button
                    className="w-full bg-w1-primary-dark text-white hover:bg-opacity-90"
                    onClick={handleContinue}
                  >
                    Quero abrir uma holding
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
