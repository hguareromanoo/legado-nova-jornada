import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Simulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [simulationData, setSimulationData] = useState({
    netWorth: '',
    realEstateShare: 0,
    rentalIncome: 0, // Changed to numeric value for slider
    heirs: '',
    maritalStatus: '',
    state: '',
    ownsCompany: null,
    companyType: '',
    companyRevenue: '',
    goals: [],
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const totalSteps = 8; // Reduced from 9 since we removed the contact step
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field, value) => {
    setSimulationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMultiSelect = (field, value) => {
    setSimulationData(prev => {
      const currentValues = prev[field] || [];
      
      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          [field]: [...currentValues, value]
        };
      }
    });
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      // If this is the final step, handle submission
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Calculate estimated savings based on simulation data
  const estimatedSavings = useMemo(() => {
    let baseValue = 0;
    
    // Adjust based on net worth
    switch(simulationData.netWorth) {
      case 'under500k': baseValue = 50000; break;
      case '500kTo2m': baseValue = 200000; break;
      case '2mTo5m': baseValue = 500000; break;
      case '5mTo10m': baseValue = 1000000; break;
      case 'above10m': baseValue = 2000000; break;
      default: baseValue = 0;
    }
    
    // Adjust based on rental income
    baseValue += (simulationData.rentalIncome * 1000);
    
    // Adjust based on real estate share
    baseValue = baseValue * (1 + simulationData.realEstateShare / 100);
    
    // Generate 10-year projection
    return Array.from({ length: 10 }, (_, i) => ({
      year: new Date().getFullYear() + i,
      withHolding: Math.round(baseValue * (1 + i * 0.08)), // 8% growth with holding
      withoutHolding: Math.round(baseValue * (1 + i * 0.04) * 0.6), // 4% growth without holding, 40% less due to taxes
    }));
  }, [simulationData.netWorth, simulationData.rentalIncome, simulationData.realEstateShare]);

  // Calculate tax breakdown for the final year
  const taxBreakdown = useMemo(() => {
    if (!estimatedSavings.length) return { incomeTax: 0, successionTax: 0, total: 0 };
    
    const finalYear = estimatedSavings[estimatedSavings.length - 1];
    const totalSavings = finalYear.withHolding - finalYear.withoutHolding;
    
    // Approximate breakdown based on common distribution
    return {
      incomeTax: Math.round(totalSavings * 0.65), // 65% from income tax savings
      successionTax: Math.round(totalSavings * 0.35), // 35% from succession tax savings
      total: totalSavings
    };
  }, [estimatedSavings]);

  const handleSubmit = () => {
    setIsComplete(true);
    // Store simulation data and calculated savings in localStorage
    localStorage.setItem('simulationData', JSON.stringify(simulationData));
    localStorage.setItem('estimatedSavings', JSON.stringify(estimatedSavings));
    localStorage.setItem('taxBreakdown', JSON.stringify(taxBreakdown));
    
    // Here you would typically send the data to your backend
    console.log("Simulation data:", simulationData);
    
    // Navigate to simulation report after a short delay to show the completion message
    setTimeout(() => {
      navigate('/simulation-report');
    }, 2000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-white py-8 md:py-16">
      <div className="w1-container max-w-2xl mx-auto px-4">
        {!isComplete ? (
          <>
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-w1-primary-dark mb-2 text-center">
                Simulação de Holding Familiar
              </h1>
              <p className="text-gray-600 text-center">
                Responda algumas perguntas rápidas para avaliarmos o potencial de economia
              </p>
              <div className="mt-6">
                <Progress value={progress} className="h-2 bg-gray-200" />
                <p className="text-right text-sm text-gray-500 mt-1">
                  Passo {currentStep} de {totalSteps}
                </p>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={stepVariants}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 md:p-8 shadow-md rounded-xl">
                  {currentStep === 1 && (
                    <StepNetWorth 
                      value={simulationData.netWorth} 
                      onChange={(value) => handleInputChange('netWorth', value)} 
                    />
                  )}
                  
                  {currentStep === 2 && (
                    <StepRealEstate 
                      value={simulationData.realEstateShare} 
                      onChange={(value) => handleInputChange('realEstateShare', value)} 
                    />
                  )}
                  
                  {currentStep === 3 && (
                    <StepRentalIncome 
                      value={simulationData.rentalIncome} 
                      onChange={(value) => handleInputChange('rentalIncome', value)} 
                    />
                  )}
                  
                  {currentStep === 4 && (
                    <StepHeirs 
                      value={simulationData.heirs} 
                      onChange={(value) => handleInputChange('heirs', value)} 
                    />
                  )}
                  
                  {currentStep === 5 && (
                    <StepMaritalStatus 
                      value={simulationData.maritalStatus} 
                      onChange={(value) => handleInputChange('maritalStatus', value)} 
                    />
                  )}
                  
                  {currentStep === 6 && (
                    <StepState 
                      value={simulationData.state} 
                      onChange={(value) => handleInputChange('state', value)} 
                    />
                  )}
                  
                  {currentStep === 7 && (
                    <StepCompany 
                      ownsCompany={simulationData.ownsCompany}
                      companyType={simulationData.companyType}
                      companyRevenue={simulationData.companyRevenue}
                      onChange={(field, value) => handleInputChange(field, value)} 
                    />
                  )}
                  
                  {currentStep === 8 && (
                    <StepGoals 
                      selectedGoals={simulationData.goals} 
                      onChange={(value) => handleMultiSelect('goals', value)} 
                    />
                  )}
                </Card>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-6">
              <Button
                onClick={prevStep}
                variant="outline"
                className="text-gray-500"
                disabled={currentStep === 1}
              >
                Voltar
              </Button>
              
              <Button 
                onClick={nextStep}
                className="bg-w1-primary-dark hover:bg-opacity-90"
              >
                {currentStep === totalSteps ? 'Concluir' : 'Próximo'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-3 rounded-full bg-w1-primary-accent/20 mb-4">
              <CircleCheck className="w-12 h-12 text-w1-primary-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Simulação Concluída!</h2>
            <p className="text-gray-600 mb-8">
              Estamos analisando seus dados para preparar um relatório personalizado.
            </p>
            <div className="animate-pulse">
              <p className="text-sm text-gray-500">Redirecionando...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const StepNetWorth = ({ value, onChange }) => {
  const options = [
    { label: 'Até R$ 500 mil', value: 'under500k' },
    { label: 'R$ 500 mil a R$ 2 milhões', value: '500kTo2m' },
    { label: 'R$ 2 milhões a R$ 5 milhões', value: '2mTo5m' },
    { label: 'R$ 5 milhões a R$ 10 milhões', value: '5mTo10m' },
    { label: 'Acima de R$ 10 milhões', value: 'above10m' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Estimativa de patrimônio total
      </h2>
      <p className="text-gray-600 mb-6">
        Para avaliar suas economias potenciais, precisamos de uma estimativa do seu patrimônio total
        (imóveis, investimentos, empresas, etc).
      </p>
      
      <div className="space-y-3">
        {options.map(option => (
          <div 
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              value === option.value 
                ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                value === option.value 
                  ? 'border-w1-primary-accent' 
                  : 'border-gray-400'
              }`}>
                {value === option.value && (
                  <div className="w-3 h-3 rounded-full bg-w1-primary-accent" />
                )}
              </div>
              <span>{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StepRealEstate = ({ value, onChange }) => {
  const handleSliderChange = (values) => {
    onChange(values[0]);
  };

  const percentLabels = [
    { value: 0, label: '0%' },
    { value: 25, label: '25%' },
    { value: 50, label: '50%' },
    { value: 75, label: '75%' },
    { value: 100, label: '100%' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Participação de imóveis
      </h2>
      <p className="text-gray-600 mb-8">
        Você possui imóveis? Aproximadamente quanto do seu patrimônio está em propriedades?
      </p>
      
      <div className="px-2 mb-10">
        <Slider 
          defaultValue={[value]} 
          max={100} 
          step={5} 
          onValueChange={handleSliderChange} 
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        {percentLabels.map(mark => (
          <div key={mark.value} className="text-center">
            <div className="mb-1">{mark.label}</div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <div className="inline-block bg-w1-primary-accent/10 rounded-full px-4 py-2 text-w1-primary-dark font-medium">
          {value}% do patrimônio em imóveis
        </div>
      </div>
    </div>
  );
};

const StepRentalIncome = ({ value, onChange }) => {
  const handleSliderChange = (values) => {
    onChange(values[0]);
  };

  const formatRentalIncome = (value) => {
    if (value === 0) return "Sem renda de aluguel";
    if (value <= 5) return `R$ ${value} mil/mês`;
    if (value <= 15) return `R$ ${value} mil/mês`;
    return `R$ ${value} mil/mês`;
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Renda de aluguel
      </h2>
      <p className="text-gray-600 mb-6">
        Você recebe regularmente renda de aluguel?
      </p>
      
      <div className="px-2 mb-10">
        <Slider 
          defaultValue={[value]} 
          max={30} 
          step={1} 
          onValueChange={handleSliderChange} 
        />
      </div>
      
      <div className="flex justify-between text-sm text-gray-500">
        <div>0</div>
        <div>5k</div>
        <div>15k</div>
        <div>30k+</div>
      </div>
      
      <div className="mt-6 text-center">
        <div className="inline-block bg-w1-primary-accent/10 rounded-full px-4 py-2 text-w1-primary-dark font-medium">
          {formatRentalIncome(value)}
        </div>
      </div>
    </div>
  );
};

const StepHeirs = ({ value, onChange }) => {
  const options = [
    { label: 'Não', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3 ou mais', value: '3+' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Herdeiros
      </h2>
      <p className="text-gray-600 mb-6">
        Você tem herdeiros diretos (como filhos)?
      </p>
      
      <div className="grid grid-cols-2 gap-3">
        {options.map(option => (
          <div 
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 border rounded-lg cursor-pointer transition-all text-center ${
              value === option.value 
                ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{option.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StepMaritalStatus = ({ value, onChange }) => {
  const options = [
    { label: 'Solteiro(a)', value: 'single', icon: '👤' },
    { label: 'Casado(a) - Comunhão parcial', value: 'married-partial', icon: '💍' },
    { label: 'Casado(a) - Separação total', value: 'married-separate', icon: '⚖️' },
    { label: 'União estável', value: 'civil-union', icon: '🤝' },
    { label: 'Divorciado(a)', value: 'divorced', icon: '📄' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Estado civil
      </h2>
      <p className="text-gray-600 mb-6">
        Seu regime matrimonial influencia o planejamento sucessório. Qual é seu status atual?
      </p>
      
      <div className="space-y-3">
        {options.map(option => (
          <div 
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              value === option.value 
                ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-xl">{option.icon}</span>
              <span>{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StepState = ({ value, onChange }) => {
  const states = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Estado de residência
      </h2>
      <p className="text-gray-600 mb-6">
        As leis fiscais variam por estado. Onde está sua residência fiscal principal?
      </p>
      
      <div className="grid grid-cols-3 gap-3">
        {states.map(state => (
          <div 
            key={state.value}
            onClick={() => onChange(state.value)}
            className={`p-3 border rounded-lg cursor-pointer transition-all text-center ${
              value === state.value 
                ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{state.value}</div>
            <div className="text-xs text-gray-500">{state.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StepCompany = ({ ownsCompany, companyType, companyRevenue, onChange }) => {
  const companyTypes = [
    'Microempreendedor Individual (MEI)',
    'Sociedade Limitada (LTDA)',
    'Sociedade Anônima (S.A.)',
    'Empresa Individual (EIRELI)',
    'Outro'
  ];
  
  const revenueOptions = [
    'Até R$ 360 mil/ano',
    'R$ 360 mil a R$ 4,8 milhões/ano',
    'Acima de R$ 4,8 milhões/ano'
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Propriedade de empresas
      </h2>
      <p className="text-gray-600 mb-6">
        Você é proprietário de alguma empresa?
      </p>
      
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => onChange('ownsCompany', true)}
          variant={ownsCompany === true ? "default" : "outline"}
          className={ownsCompany === true ? "bg-w1-primary-dark" : ""}
        >
          Sim
        </Button>
        <Button
          onClick={() => onChange('ownsCompany', false)} 
          variant={ownsCompany === false ? "default" : "outline"}
          className={ownsCompany === false ? "bg-w1-primary-dark" : ""}
        >
          Não
        </Button>
      </div>
      
      {ownsCompany === true && (
        <>
          <div className="mb-4">
            <Label htmlFor="companyType">Tipo de empresa</Label>
            <select
              id="companyType"
              value={companyType}
              onChange={(e) => onChange('companyType', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
            >
              <option value="">Selecione o tipo</option>
              {companyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label>Faturamento estimado anual</Label>
            <div className="space-y-2 mt-2">
              {revenueOptions.map(option => (
                <div 
                  key={option}
                  onClick={() => onChange('companyRevenue', option)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    companyRevenue === option
                      ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StepGoals = ({ selectedGoals, onChange }) => {
  const goals = [
    { id: 'reduceTax', label: 'Reduzir impostos sobre renda de aluguel' },
    { id: 'avoidProbate', label: 'Evitar inventário e conflitos familiares' },
    { id: 'protectAssets', label: 'Proteger patrimônio contra riscos' },
    { id: 'planSuccession', label: 'Planejar sucessão para meus filhos' },
    { id: 'professionalizeManagement', label: 'Profissionalizar gestão patrimonial' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Principais objetivos
      </h2>
      <p className="text-gray-600 mb-6">
        Quais preocupações ou objetivos são mais importantes para você agora?
      </p>
      
      <div className="space-y-3">
        {goals.map(goal => (
          <div 
            key={goal.id}
            onClick={() => onChange(goal.id)}
            className={`p-4 border rounded-lg cursor-pointer transition-all ${
              selectedGoals.includes(goal.id)
                ? 'border-w1-primary-accent bg-w1-primary-accent/10' 
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 ${
                selectedGoals.includes(goal.id)
                  ? 'border-w1-primary-accent bg-w1-primary-accent' 
                  : 'border-gray-400'
              }`}>
                {selectedGoals.includes(goal.id) && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span>{goal.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Simulation;
