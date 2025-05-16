import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Home, FileText, BarChart2, Settings, Users, User, LogIn, Calendar, CircleCheck, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VerticalRoadmap, { RoadmapStep } from '@/components/VerticalRoadmap';
import ChatModal from '@/components/ChatModal';
import { useToast } from '@/hooks/use-toast';

// Mock roadmap steps for document collection
const documentSteps: RoadmapStep[] = [
  {
    id: 'identity',
    name: 'Documentos de Identidade',
    description: 'RG e CPF de todos os sócios',
    icon: <User size={16} className="text-w1-primary-dark" />,
    status: 'completed'
  },
  {
    id: 'address',
    name: 'Comprovante de Endereço',
    description: 'Conta de luz, água ou telefone',
    icon: <Home size={16} className="text-w1-primary-dark" />,
    status: 'current'
  },
  {
    id: 'company',
    name: 'Contrato Social',
    description: 'Ou estatuto da empresa',
    icon: <FileText size={16} className="text-w1-primary-dark" />,
    status: 'locked'
  },
  {
    id: 'realestate',
    name: 'Documentos dos Imóveis',
    description: 'Escrituras e matrículas',
    icon: <Building size={16} className="text-w1-primary-dark" />,
    status: 'locked'
  }
];

const Members = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentStep, setCurrentStep] = useState(1);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<RoadmapStep | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleDocumentSelect = (documentId: string) => {
    const document = documentSteps.find(step => step.id === documentId);
    if (document) {
      setSelectedDocument(document);
      setChatModalOpen(true);
    }
  };

  const handleDocumentComplete = (documentId: string) => {
    toast({
      title: "Documento enviado com sucesso!",
      description: "Seu documento foi recebido e está em análise.",
    });
    
    // In a real app, we would update the status on the server
    // For now, we'll just close the modal
    setChatModalOpen(false);
  };

  const handleNextDocument = () => {
    const currentIndex = documentSteps.findIndex(doc => doc.id === selectedDocument?.id);
    if (currentIndex < documentSteps.length - 1) {
      setSelectedDocument(documentSteps[currentIndex + 1]);
    }
  };

  const handlePreviousDocument = () => {
    const currentIndex = documentSteps.findIndex(doc => doc.id === selectedDocument?.id);
    if (currentIndex > 0) {
      setSelectedDocument(documentSteps[currentIndex - 1]);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-w1-primary-dark text-w1-text-light">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-400">Área de Membros</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')}
                    tooltip="Sua Holding"
                  >
                    <Home />
                    <span>Sua Holding</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'assets'} 
                    onClick={() => setActiveTab('assets')}
                    tooltip="Ativos"
                  >
                    <BarChart2 />
                    <span>Ativos</span>
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
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'documents'} 
                    onClick={() => setActiveTab('documents')}
                    tooltip="Documentos"
                  >
                    <FileText />
                    <span>Documentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'structure'} 
                    onClick={() => setActiveTab('structure')}
                    tooltip="Estrutura Societária"
                  >
                    <Users />
                    <span>Estrutura Societária</span>
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
            <div className="p-4 text-center text-xs text-gray-400">
              W1 Consultoria Patrimonial © 2024
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-gray-900">
          <div className="p-6">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold">
                  {activeTab === 'dashboard' && 'Sua Holding'}
                  {activeTab === 'assets' && 'Gestão de Ativos'}
                  {activeTab === 'assistant' && 'Chat Assistente'}
                  {activeTab === 'documents' && 'Documentos'}
                  {activeTab === 'structure' && 'Estrutura Societária'}
                  {activeTab === 'profile' && 'Perfil'}
                  {activeTab === 'settings' && 'Configurações'}
                </h1>
                <p className="text-gray-400">
                  {activeTab === 'dashboard' && 'Acompanhe o processo de abertura da sua holding'}
                  {activeTab === 'assets' && 'Gerencie seus ativos'}
                  {activeTab === 'assistant' && 'Tire suas dúvidas com nosso assistente'}
                  {activeTab === 'documents' && 'Documentos necessários para sua holding'}
                  {activeTab === 'structure' && 'Visualize a estrutura societária'}
                  {activeTab === 'profile' && 'Suas informações pessoais'}
                  {activeTab === 'settings' && 'Configure sua conta'}
                </p>
              </div>
              <SidebarTrigger />
            </header>
            
            {/* Dashboard Content with Roadmap */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Processo de Criação da Holding</h2>
                    <p className="text-gray-400 mb-6">
                      Estamos no processo de envio de documentos. Por favor, envie todos os documentos solicitados.
                    </p>
                    
                    <div className="bg-gray-700/50 rounded-lg p-6">
                      <VerticalRoadmap 
                        steps={documentSteps}
                        currentStep={currentStep}
                        onStepSelect={handleDocumentSelect}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
                    <div className="space-y-4">
                      <div className="flex items-start p-2 bg-gray-700/30 rounded">
                        <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                          <Calendar size={18} className="text-w1-primary-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Reunião com Consultor</p>
                          <p className="text-sm text-gray-400">15/06/2025 • 14:00</p>
                        </div>
                      </div>
                      <div className="flex items-start p-2 bg-gray-700/30 rounded">
                        <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                          <FileText size={18} className="text-w1-primary-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Revisão de Contrato</p>
                          <p className="text-sm text-gray-400">Pendente</p>
                        </div>
                      </div>
                      <div className="flex items-start p-2 bg-gray-700/30 rounded">
                        <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                          <CircleCheck size={18} className="text-w1-primary-accent" />
                        </div>
                        <div>
                          <p className="font-medium">Finalizar Documentação</p>
                          <p className="text-sm text-gray-400">Em andamento</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Other tabs would have their own content here */}
            {activeTab !== 'dashboard' && (
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-center h-64">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-400 mb-2">
                    Conteúdo de {activeTab} em desenvolvimento
                  </h3>
                  <p className="text-sm text-gray-500">
                    Esta seção será implementada em breve.
                  </p>
                </div>
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
      
      {/* Chat Modal for Document Upload */}
      <ChatModal 
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        selectedDocument={selectedDocument}
        onDocumentComplete={handleDocumentComplete}
        onNextDocument={handleNextDocument}
        onPreviousDocument={handlePreviousDocument}
      />
    </SidebarProvider>
  );
};

export default Members;
