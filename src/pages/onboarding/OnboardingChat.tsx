
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
import MessageList from '@/components/chat/MessageList';
import ChatInput from '@/components/chat/ChatInput';
import ProfileSidebar from '@/components/chat/ProfileSidebar';
import { useChat } from '@/contexts/ChatContext';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useUser } from '@/contexts/UserContext';

const OnboardingChat = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  const { session, messages, loading, sendMessage, error } = useChat();
  const { isLoggedIn } = useUser();
  const [showSidebar, setShowSidebar] = useState(true);
  
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
    
    // Check if chat completion is sufficient to move to the next step
    if (session && session.completion_percentage >= 0.8) {
      completeStep('chat');
      
      // Show congratulations toast
      toast({
        title: "Parabéns! 🎉",
        description: "Você completou as informações iniciais. Na próxima etapa, vamos organizar seus documentos.",
      });
    }
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
      
      {/* Main Content with Chat and Profile */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Window */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 pb-32 chat-messages">
            <MessageList messages={messages} />
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t bg-white">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              disabled={loading || !!error} 
            />
          </div>
        </div>
        
        {/* Profile Sidebar - Hidden on mobile by default */}
        {session && showSidebar && (
          <div className="hidden md:block w-80 border-l shrink-0">
            <ProfileSidebar 
              profile={session.profile} 
              completionPercentage={session.completion_percentage} 
            />
          </div>
        )}
      </div>
      
      {/* Toggle Sidebar Button (Mobile Only) */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSidebar(!showSidebar)}
        className="md:hidden fixed bottom-20 right-4 z-20 rounded-full h-12 w-12 p-0 shadow-md"
      >
        {showSidebar ? <ArrowLeft size={18} /> : <span className="text-xs">Perfil</span>}
      </Button>
      
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
      
      {/* Mobile Profile Sidebar (when shown) */}
      {session && showSidebar && (
        <div className="md:hidden fixed inset-0 z-10 bg-white">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="font-bold text-lg">Seu Perfil</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowSidebar(false)}
            >
              Fechar
            </Button>
          </div>
          <div className="h-[calc(100vh-60px)] overflow-y-auto">
            <ProfileSidebar 
              profile={session.profile} 
              completionPercentage={session.completion_percentage} 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingChat;
