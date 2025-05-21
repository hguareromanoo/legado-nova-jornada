
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Settings, 
  HelpCircle,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useUser } from '@/contexts/UserContext';
import CompletionDialog from '@/components/chat/CompletionDialog';
import CompletionBanner from '@/components/chat/CompletionBanner';

const OnboardingChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  const { session, messages, loading, isTyping, sendMessage, error, isSessionComplete } = useChat();
  const { isLoggedIn } = useUser();
  
  // Estado para controlar a exibição do diálogo de conclusão
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  
  // Redirecionar para login se não estiver autenticado
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para acessar o chat onboarding.",
        variant: "destructive",
      });
      navigate('/login');
    }
  }, [isLoggedIn, navigate, toast]);
  
  // Efeito para monitorar quando a sessão é marcada como completa
  useEffect(() => {
    if (isSessionComplete && !showCompletionDialog) {
      // Marcar etapa como concluída no contexto de onboarding
      completeStep('chat');
      
      // Exibir diálogo de conclusão
      setShowCompletionDialog(true);
      
      // Notificar o usuário
      toast({
        title: "Parabéns! 🎉",
        description: "Você completou a etapa de coleta de informações com sucesso!",
      });
    }
  }, [isSessionComplete, completeStep, toast, showCompletionDialog]);
  
  const handleBack = () => {
    navigate('/onboarding');
  };
  
  const handleHelpClick = () => {
    toast({
      title: "Ajuda",
      description: "Um guia completo foi enviado ao seu e-mail.",
    });
  };
  
  const handleSettingsClick = () => {
    toast({
      title: "Configurações",
      description: "As configurações serão implementadas em breve.",
    });
  };
  
  const handleSendMessage = async (text: string) => {
    // Verificar se usuário está autenticado
    if (!isLoggedIn) {
      toast({
        title: "Autenticação necessária",
        description: "Por favor, faça login para enviar mensagens.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    await sendMessage(text);
  };

  const handleConsultantRequest = () => {
    navigate('/onboarding/human/schedule');
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  useEffect(() => {
    // Scroll to bottom when messages change
    const chatContainer = document.querySelector('.chat-messages');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  // Se o usuário não estiver logado, mostrar mensagem e botão de login
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
          <h2 className="text-2xl font-bold mb-4">Autenticação Necessária</h2>
          <p className="mb-6">
            Você precisa estar logado para acessar o chat de onboarding e iniciar 
            seu processo de planejamento patrimonial com a W1.
          </p>
          <Button 
            onClick={handleLoginRedirect} 
            className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark"
          >
            <LogIn className="mr-2" size={18} />
            Fazer Login
          </Button>
        </div>
      </div>
    );
  }

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
          {isTyping && <span className="text-sm text-gray-500">(digitando...)</span>}
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

      {/* Progress Bar - Fixed position */}
      <div className="sticky top-0 z-10 bg-white px-4 pt-2 pb-1 border-b">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progresso da coleta de informações</span>
          <span>{Math.round((session?.completion_percentage || 0) * 100)}%</span>
        </div>
        <Progress 
          value={(session?.completion_percentage || 0) * 100} 
          className="h-2 bg-gray-100" 
          indicatorClassName="bg-w1-primary-accent"
        />
      </div>
      
      {/* API Error Alert - Improved with more debug info */}
      {error && (
        <Alert variant="destructive" className="m-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div><strong>Erro:</strong> {error}</div>
            
            <div>
              <strong>Atenção:</strong> É necessário iniciar o servidor Python FastAPI em http://localhost:8000.
            </div>
            
            <div className="text-sm bg-gray-100 p-2 rounded">
              <p>Comando para iniciar o servidor:</p>
              <code className="bg-gray-200 px-1 rounded">python app.py</code>
            </div>
            
            <div className="text-sm">
              <p><strong>Nota:</strong> Verifique se você está enviando um user_id válido na requisição.</p>
              <p>Certifique-se de que o usuário esteja logado e que as credenciais do Supabase estejam configuradas corretamente.</p>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Main Content with Chat - Modified for better fullscreen experience */}
      <div className="flex-1 flex flex-col h-full">
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-4 chat-messages">
          <MessageList messages={messages} isTyping={isTyping} />
        </div>
        
        {/* Input Area - Fixed at bottom */}
        <div className="sticky bottom-0 p-4 border-t bg-white">
          <ChatInput 
            onSendMessage={handleSendMessage} 
            disabled={loading || !!error} 
          />
        </div>
      </div>
      
      {/* Consultant Request Button */}
      <div className="fixed top-20 left-4 z-20">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleConsultantRequest}
          className="text-xs bg-white border-w1-primary-accent text-w1-primary-dark"
        >
          Falar com um consultor
        </Button>
      </div>
      
      {/* Completion Dialog */}
      <CompletionDialog 
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      />
      
      {/* Banner persistente quando a sessão estiver completa e o diálogo fechado */}
      {isSessionComplete && !showCompletionDialog && <CompletionBanner />}
    </div>
  );
};

export default OnboardingChat;
