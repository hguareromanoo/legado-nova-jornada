
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion, AnimatePresence } from 'framer-motion';
import { CircleCheck, CircleDollarSign } from 'lucide-react';

const Simulation = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [simulationData, setSimulationData] = useState({
    netWorth: '',
    realEstateShare: 0,
    rentalIncome: '',
    heirs: '',
    maritalStatus: '',
    state: '',
    ownsCompany: null,
    companyType: '',
    companyRevenue: '',
    goals: [],
    email: '',
    phone: '',
  });
  const [isComplete, setIsComplete] = useState(false);
  
  const totalSteps = 9;
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
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsComplete(true);
    // Here you would typically send the data to your backend
    console.log("Simulation data:", simulationData);
    
    // Navigate to onboarding after a short delay to show the completion message
    setTimeout(() => {
      navigate('/onboarding');
    }, 2000);
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
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
                  
                  {currentStep === 9 && (
                    <StepContact 
                      email={simulationData.email}
                      phone={simulationData.phone}
                      onChange={(field, value) => handleInputChange(field, value)} 
                      onSubmit={handleSubmit}
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
              
              {currentStep < totalSteps ? (
                <Button 
                  onClick={nextStep}
                  className="bg-w1-primary-dark hover:bg-opacity-90"
                >
                  Próximo
                </Button>
              ) : null}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-block p-3 rounded-full bg-w1-primary-accent/20 mb-4">
              <CircleCheck className="w-12 h-12 text-w1-primary-accent" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Simulação Concluída!</h2>
            <p className="text-gray-600 mb-8">
              Estamos analisando seus dados para preparar uma recomendação personalizada.
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
  const options = [
    { label: 'Sem renda de aluguel', value: 'none', icon: '🚫' },
    { label: 'Até R$ 5 mil/mês', value: 'under5k', icon: '💰' },
    { label: 'R$ 5 mil a R$ 15 mil/mês', value: '5kTo15k', icon: '💰💰' },
    { label: 'Acima de R$ 15 mil/mês', value: 'above15k', icon: '💰💰💰' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-w1-primary-dark">
        Renda de aluguel
      </h2>
      <p className="text-gray-600 mb-6">
        Você recebe regularmente renda de aluguel?
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
            <div className="text-2xl mb-2">{option.icon}</div>
            <div className="text-sm">{option.label}</div>
          </div>
        ))}
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

const StepContact = ({ email, phone, onChange, onSubmit }) => {
  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-16 h-16 bg-w1-primary-accent/20 rounded-full">
            <CircleDollarSign className="w-8 h-8 text-w1-primary-accent" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold mb-2 text-w1-primary-dark text-center">
          Potencial Identificado!
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Com base no seu perfil, uma holding familiar pode ajudar você a reduzir impostos, evitar custos legais futuros e planejar uma sucessão tranquila.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="seu@email.com"
            className="mt-1"
          />
        </div>
        
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="(XX) XXXXX-XXXX"
            className="mt-1"
          />
        </div>
        
        <Button
          onClick={onSubmit}
          className="w-full bg-w1-primary-dark hover:bg-opacity-90 mt-2"
          disabled={!email || !phone}
        >
          Receber Meu Diagnóstico Grátis
        </Button>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        Seus dados estão seguros e protegidos pela nossa política de privacidade.
      </p>
    </div>
  );
};

export default Simulation;
