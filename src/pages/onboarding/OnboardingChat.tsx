
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import ChatBubble from '@/components/chat/ChatBubble';
import ChatInput from '@/components/chat/ChatInput';
import ProgressTracker from '@/components/chat/ProgressTracker';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useToast } from '@/hooks/use-toast';

// Define message types
interface Message {
  id: string;
  sender: 'assistant' | 'user';
  content: string;
  type: 'text' | 'options' | 'input' | 'slider' | 'date';
  options?: {
    value: string;
    label: string;
  }[];
}

const OnboardingChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, any>>({});
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Questions flow
  const questions: Message[] = [
    {
      id: 'welcome',
      sender: 'assistant',
      content: 'Olá! Bem-vindo à jornada de planejamento patrimonial. Prefere que eu te chame pelo seu nome? :)',
      type: 'input'
    },
    {
      id: 'objective',
      sender: 'assistant',
      content: 'Qual é o seu principal objetivo com a holding?',
      type: 'options',
      options: [
        { value: 'protection', label: 'Proteção de bens' },
        { value: 'succession', label: 'Planejamento sucessório' },
        { value: 'tax', label: 'Economia tributária' },
        { value: 'other', label: 'Outro objetivo' }
      ]
    },
    {
      id: 'assets',
      sender: 'assistant',
      content: 'Você possui imóveis, empresas ou aplicações financeiras em seu nome?',
      type: 'options',
      options: [
        { value: 'real-estate', label: 'Imóveis' },
        { value: 'companies', label: 'Empresas' },
        { value: 'investments', label: 'Aplicações Financeiras' },
        { value: 'none', label: 'Nenhum' }
      ]
    },
    {
      id: 'passive-income',
      sender: 'assistant',
      content: 'Hoje, você já possui alguma renda passiva? Quanto, em média, por mês?',
      type: 'slider'
    },
    {
      id: 'age-heirs',
      sender: 'assistant',
      content: 'Qual a sua idade e se tiver herdeiros, quantos?',
      type: 'input'
    },
    {
      id: 'interest-level',
      sender: 'assistant',
      content: 'Você quer apenas entender se vale a pena ou já deseja abrir sua holding nos próximos 30 dias?',
      type: 'options',
      options: [
        { value: 'understand', label: 'Só entender' },
        { value: 'open-soon', label: 'Quero abrir em breve' }
      ]
    },
    {
      id: 'conclusion',
      sender: 'assistant',
      content: 'Ótimo, já temos o essencial. Agora vamos organizar seus documentos para personalizar sua estrutura de holding.',
      type: 'options',
      options: [
        { value: 'continue', label: 'Continuar' }
      ]
    }
  ];

  useEffect(() => {
    // Add initial welcome message
    if (messages.length === 0) {
      setMessages([questions[0]]);
    }
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom of chat
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUserResponse = (response: any) => {
    setLoading(true);
    
    // Save the user's response
    const currentQuestion = questions[currentStep];
    setUserResponses({
      ...userResponses,
      [currentQuestion.id]: response
    });
    
    // Add user message to the chat
    let userMessage = '';
    if (currentQuestion.type === 'options') {
      if (Array.isArray(response)) {
        userMessage = response.map(option => {
          const found = currentQuestion.options?.find(o => o.value === option);
          return found ? found.label : option;
        }).join(', ');
      } else {
        const option = currentQuestion.options?.find(o => o.value === response);
        userMessage = option ? option.label : response;
      }
    } else {
      userMessage = response.toString();
    }
    
    setMessages([
      ...messages,
      { id: `user-${Date.now()}`, sender: 'user', content: userMessage, type: 'text' }
    ]);
    
    // Store response in localStorage
    localStorage.setItem('chatResponses', JSON.stringify({
      ...userResponses,
      [currentQuestion.id]: response
    }));
    
    // Wait for a moment to simulate AI thinking
    setTimeout(() => {
      setLoading(false);
      
      // Move to the next question
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // If there are more questions, show the next one
      if (nextStep < questions.length) {
        setMessages(prev => [...prev, questions[nextStep]]);
      } else {
        // Marca que o chat foi concluído e atualiza para o próximo passo
        localStorage.setItem('onboardingStep', 'documents');
        
        // Mark the chat step as complete in the onboarding context
        completeStep('chat');
        
        // Navega diretamente para a página de membros
        navigate('/members');
      }
    }, 1000);
  };
  
  const handleBack = () => {
    navigate(-1);
  };
  
  const handleHelpClick = () => {
    // Show help modal or instructions
    console.log('Help requested');
  };
  
  const handleSettingsClick = () => {
    // Show settings modal
    console.log('Settings requested');
  };
  
  const handleTextSubmit = (text: string) => {
    if (text.trim()) {
      handleUserResponse(text);
      setInputValue('');
    }
  };

  const handleConsultantRequest = () => {
    toast({
      title: "Solicitação recebida",
      description: "Um de nossos consultores entrará em contato em breve.",
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Chat Header */}
      <header className="border-b p-4 flex justify-between items-center bg-white z-10 shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleBack}
          className="text-gray-600"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-w1-primary-accent flex items-center justify-center">
            <span className="text-w1-primary-dark font-bold">R</span>
          </div>
          <span className="font-medium">Robson</span>
          {loading && <span className="text-sm text-gray-500">(digitando...)</span>}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleSettingsClick}
            className="text-gray-600"
          >
            <Settings size={20} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleHelpClick}
            className="text-gray-600"
          >
            <HelpCircle size={20} />
          </Button>
        </div>
      </header>
      
      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 pb-32">
        {messages.map((message, index) => (
          <motion.div 
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChatBubble 
              message={message} 
              onResponse={handleUserResponse} 
              isLastMessage={index === messages.length - 1}
            />
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>
      
      {/* Progress Tracker */}
      <div className="fixed top-20 right-4">
        <ProgressTracker currentStep={currentStep} totalSteps={questions.length - 1} />
      </div>
      
      {/* Consultant Request Button */}
      <div className="fixed top-20 left-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleConsultantRequest}
          className="text-xs bg-white border-w1-primary-accent text-w1-primary-dark"
        >
          Falar com um consultor
        </Button>
      </div>
      
      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg">
        <ChatInput 
          currentQuestion={questions[currentStep]} 
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleTextSubmit}
          onOptionSelect={handleUserResponse}
        />
      </div>
    </div>
  );
};

export default OnboardingChat;
