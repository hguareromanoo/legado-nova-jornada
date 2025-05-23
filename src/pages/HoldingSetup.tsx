import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  Home, 
  FileText, 
  Settings, 
  User, 
  LogIn, 
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { DocumentRecommendationsResponse } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import DocumentsTab from '@/components/holding/DocumentsTab';
import PlaceholderContent, { Loading, ErrorDisplay } from '@/components/holding/PlaceholderContent';

const HoldingSetup = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, updateUserState, userState } = useUser();
  
  // Estados para documentos
  const [documentData, setDocumentData] = useState<DocumentRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para upload e progresso
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Garantir que o estado do usuário está correto quando a página for carregada
  useEffect(() => {
    if (!user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
      return;
    }
    
    console.log("Current user state:", userState);
    
    const setupUserState = async () => {
      // Se o usuário não estiver no estado correto para holding_setup, atualize-o
      if (userState && userState !== 'holding_setup' && userState !== 'holding_opened') {
        console.log(`Updating user state from ${userState} to holding_setup`);
        try {
          await updateUserState('holding_setup');
          console.log("State updated to holding_setup");
        } catch (err) {
          console.error("Error updating state:", err);
          toast({
            title: "Erro ao atualizar estado",
            description: "Não foi possível atualizar seu progresso.",
            variant: "destructive"
          });
        }
      }
    };
    
    // Usar setTimeout para evitar problemas de renderização
    const timeoutId = setTimeout(() => {
      setupUserState();
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, userState, updateUserState, navigate, toast]);

  // Recuperar sessionId e dados de documentos
  useEffect(() => {
    const initializeDocuments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Tentar recuperar dados passados via state
        const passedData = location.state?.documentData as DocumentRecommendationsResponse;
        
        if (passedData) {
          console.log('📋 Usando dados passados via navegação:', passedData);
          setDocumentData(passedData);
          initializeUploadStatus(passedData.recommendations);
        } else {
          // Fallback: tentar recuperar sessionId do localStorage
          const userId = user.id || localStorage.getItem('currentUserId');
          const sessionId = userId ? localStorage.getItem(`chatSessionId_${userId}`) : null;
          
          if (sessionId) {
            console.log('📋 Buscando documentos para sessão:', sessionId);
            const data = await api.getDocumentRecommendations(sessionId);
            setDocumentData(data);
            initializeUploadStatus(data.recommendations);
          } else {
            throw new Error('Sessão não encontrada. Por favor, refaça o onboarding.');
          }
        }
        
      } catch (err) {
        console.error('Erro ao carregar documentos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
        
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar a lista de documentos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Usar setTimeout para evitar problemas de renderização
    const timeoutId = setTimeout(() => {
      initializeDocuments();
    }, 200);
    
    return () => clearTimeout(timeoutId);
  }, [location.state, toast, user]);

  // Inicializar status de upload
  const initializeUploadStatus = (recommendations: DocumentRecommendationsResponse['recommendations']) => {
    const initialStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'> = {};
    recommendations.forEach(doc => {
      initialStatus[doc.document_key] = 'pending';
    });
    setUploadStatus(initialStatus);
  };

  // Calcular progresso do upload
  useEffect(() => {
    if (!documentData) return;
    
    const uploadedCount = Object.values(uploadStatus).filter(status => status === 'uploaded').length;
    const progress = (uploadedCount / documentData.total_documents) * 100;
    setUploadProgress(progress);
  }, [uploadStatus, documentData]);

  // Toggle expansão de card
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Atualizar estado de upload
  const handleStatusChange = (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => {
    setUploadStatus(prev => ({ ...prev, [documentKey]: status }));
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleBackToMembers = () => {
    navigate('/members');
  };

  const handleRetryChat = () => {
    navigate('/onboarding/chat');
  };

  // Loading state
  if (loading) {
    return <Loading />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={handleRetryChat} />;
  }

  if (!documentData) return null;

  // Quando o usuário concluir o setup, atualize o estado
  const handleCompleteSetup = async () => {
    try {
      await updateUserState('holding_opened');
      console.log("User state updated to holding_opened");
      navigate('/members');
    } catch (err) {
      console.error("Error completing setup:", err);
      toast({
        title: "Erro ao finalizar setup",
        description: "Não foi possível concluir o processo.",
        variant: "destructive"
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-300">Abertura de Holding</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Processo</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'documents'} 
                    onClick={() => setActiveTab('documents')}
                    tooltip="Envio de Documentos"
                  >
                    <FileText />
                    <span>Envio de Documentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'assistant'} 
                    onClick={() => setActiveTab('assistant')}
                    tooltip="Chat Assistente"
                  >
                    <MessageSquare />
                    <span>Chat Assistente</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Conta</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    tooltip="Perfil"
                  >
                    <User />
                    <span>Perfil</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')}
                    tooltip="Configurações"
                  >
                    <Settings />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout}
                    tooltip="Sair"
                  >
                    <LogIn />
                    <span>Sair</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToMembers}
                className="w-full mb-2"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para Dashboard
              </Button>
              <div className="text-center text-xs text-gray-300">
                W1 Consultoria © 2024
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Página de Envio de Documentos */}
          {activeTab === 'documents' && (
            <DocumentsTab 
              documentData={documentData}
              uploadStatus={uploadStatus}
              expandedCards={expandedCards}
              uploadProgress={uploadProgress}
              userId={user?.id}
              onToggleCardExpansion={toggleCardExpansion}
              onStatusChange={handleStatusChange}
            />
          )}
          
          {/* Outras abas */}
          {activeTab !== 'documents' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {activeTab === 'assistant' && 'Chat Assistente'}
                    {activeTab === 'profile' && 'Perfil'}
                    {activeTab === 'settings' && 'Configurações'}
                  </h1>
                  <p className="text-gray-300">
                    {activeTab === 'assistant' && 'Tire suas dúvidas sobre o processo'}
                    {activeTab === 'profile' && 'Gerencie suas informações pessoais'}
                    {activeTab === 'settings' && 'Configure sua conta'}
                  </p>
                </div>
                <SidebarTrigger />
              </header>
              
              <PlaceholderContent 
                activeTab={activeTab}
                onSetActiveTab={setActiveTab}
              />
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HoldingSetup;
