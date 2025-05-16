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
import { Home, FileText, BarChart2, Settings, Users, User, LogIn, Calendar, CircleCheck, MessageSquare, Building2 } from 'lucide-react';
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
    icon: <Building2 size={16} className="text-w1-primary-dark" />,
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
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
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
        
        <SidebarInset className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Sua Holding</h1>
                  <p className="text-gray-400">
                    Acompanhe o processo de abertura da sua holding
                  </p>
                </div>
                <SidebarTrigger />
              </header>

              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Processo de Criação da Holding</h2>
                <p className="text-gray-400 mb-6">
                  Estamos no processo de envio de documentos. Por favor, envie todos os documentos solicitados.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Document Roadmap - Removed the box as requested */}
                  <div className="rounded-lg">
                    <VerticalRoadmap 
                      steps={documentSteps}
                      currentStep={currentStep}
                      onStepSelect={handleDocumentSelect}
                    />
                  </div>
                </div>
                
                <div className="lg:col-span-1">
                  <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                    <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
                    <div className="space-y-4">
                      <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                          <Calendar size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Reunião com Consultor</p>
                          <p className="text-sm text-gray-400">15/06/2025 • 14:00</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                          <FileText size={18} className="text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium">Revisão de Contrato</p>
                          <p className="text-sm text-gray-400">Pendente</p>
                        </div>
                      </div>
                      <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                          <CircleCheck size={18} className="text-blue-400" />
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
            </div>
          )}
          
          {/* Assets Tab - Following the reference design */}
          {activeTab === 'assets' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold">Ativos</h1>
                  <p className="text-gray-400">Gerencie seus ativos patrimoniais</p>
                </div>
                <SidebarTrigger />
              </header>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="col-span-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-5 backdrop-blur-sm border border-blue-500/30">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <div className="bg-blue-500/30 p-2 rounded-lg">
                        <Building2 className="text-blue-300" />
                      </div>
                    </div>
                    <button className="text-gray-400">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="1" fill="currentColor" />
                        <circle cx="10" cy="6" r="1" fill="currentColor" />
                        <circle cx="10" cy="14" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">R$ 3.254.895</h3>
                  <p className="text-gray-400 text-sm mb-4">Patrimônio total</p>
                  <div className="flex items-center text-sm">
                    <span className="text-green-400 flex items-center">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      8.34%
                    </span>
                    <span className="text-gray-400 ml-2">este mês</span>
                  </div>
                </div>
                
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-gray-400 text-sm">Imóveis</div>
                      <button className="text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="1" fill="currentColor" />
                          <circle cx="10" cy="6" r="1" fill="currentColor" />
                          <circle cx="10" cy="14" r="1" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">R$ 1.750.000</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">3 imóveis</span>
                      <span className="text-green-400 text-sm flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        5.2%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-gray-400 text-sm">Investimentos</div>
                      <button className="text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="1" fill="currentColor" />
                          <circle cx="10" cy="6" r="1" fill="currentColor" />
                          <circle cx="10" cy="14" r="1" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">R$ 1.243.895</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">8 ativos</span>
                      <span className="text-green-400 text-sm flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        12.8%
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-gray-400 text-sm">Outros</div>
                      <button className="text-gray-400">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="10" cy="10" r="1" fill="currentColor" />
                          <circle cx="10" cy="6" r="1" fill="currentColor" />
                          <circle cx="10" cy="14" r="1" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                    <h3 className="text-2xl font-bold mb-3">R$ 261.000</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">2 ativos</span>
                      <span className="text-red-400 text-sm flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        1.3%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Ativos principais</h2>
                  <div className="flex items-center space-x-2">
                    <select className="bg-gray-800/50 border border-gray-700/50 text-white text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                      <option>Semana</option>
                      <option>Mês</option>
                      <option>Ano</option>
                    </select>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-800">
                        <th className="text-left px-4 py-3 font-medium">Nome do Ativo</th>
                        <th className="text-left px-4 py-3 font-medium">Categoria</th>
                        <th className="text-right px-4 py-3 font-medium">Valor</th>
                        <th className="text-right px-4 py-3 font-medium">Variação</th>
                        <th className="text-right px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                              <Building2 size={16} className="text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium">Imóvel Alphaville</p>
                              <p className="text-gray-400 text-xs">São Paulo, SP</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">Imóveis</td>
                        <td className="px-4 py-4 text-right">R$ 980.000</td>
                        <td className="px-4 py-4 text-right text-green-400">+3.2%</td>
                        <td className="px-4 py-4 text-right">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Ativo</span>
                        </td>
                      </tr>
                      <tr className="border-b border-gray-800">
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="bg-purple-500/20 p-2 rounded-lg mr-3">
                              <BarChart2 size={16} className="text-purple-400" />
                            </div>
                            <div>
                              <p className="font-medium">Ações PETR4</p>
                              <p className="text-gray-400 text-xs">Petrobras</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">Investimentos</td>
                        <td className="px-4 py-4 text-right">R$ 354.780</td>
                        <td className="px-4 py-4 text-right text-green-400">+8.7%</td>
                        <td className="px-4 py-4 text-right">
                          <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Ativo</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                              <Building2 size={16} className="text-blue-400" />
                            </div>
                            <div>
                              <p className="font-medium">Sala Comercial</p>
                              <p className="text-gray-400 text-xs">Rio de Janeiro, RJ</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-300">Imóveis</td>
                        <td className="px-4 py-4 text-right">R$ 420.000</td>
                        <td className="px-4 py-4 text-right text-red-400">-1.2%</td>
                        <td className="px-4 py-4 text-right">
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Pendente</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
          
          {/* Other tabs would have their own content here */}
          {activeTab !== 'dashboard' && activeTab !== 'assets' && (
            <div className="p-6 h-full flex items-center justify-center">
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
