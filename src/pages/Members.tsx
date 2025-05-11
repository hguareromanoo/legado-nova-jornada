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
import { Home, FileText, BarChart2, Settings, Users, User, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data for the dashboard
const mockAssetData = [
  { name: 'Imóveis', value: 65 },
  { name: 'Investimentos', value: 20 },
  { name: 'Empresas', value: 10 },
  { name: 'Outros', value: 5 }
];

const roadmapSteps = [
  { id: 1, title: 'Simulação', complete: true },
  { id: 2, title: 'Cadastro', complete: true },
  { id: 3, title: 'Envio de Documentos', complete: false },
  { id: 4, title: 'Análise Jurídica', complete: false },
  { id: 5, title: 'Estruturação da Holding', complete: false },
  { id: 6, title: 'Assinatura de Contrato', complete: false },
  { id: 7, title: 'Holding Estabelecida', complete: false },
];

const Members = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = () => {
    // In a real app, this would clear the authentication token
    // localStorage.removeItem('token');
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
                    tooltip="Dashboard"
                  >
                    <Home />
                    <span>Dashboard</span>
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
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'assets' && 'Gestão de Ativos'}
                  {activeTab === 'documents' && 'Documentos'}
                  {activeTab === 'structure' && 'Estrutura Societária'}
                  {activeTab === 'profile' && 'Perfil'}
                  {activeTab === 'settings' && 'Configurações'}
                </h1>
                <p className="text-gray-400">
                  {activeTab === 'dashboard' && 'Visão geral do seu patrimônio'}
                  {activeTab === 'assets' && 'Gerencie seus ativos'}
                  {activeTab === 'documents' && 'Documentos necessários para sua holding'}
                  {activeTab === 'structure' && 'Visualize a estrutura societária'}
                  {activeTab === 'profile' && 'Suas informações pessoais'}
                  {activeTab === 'settings' && 'Configure sua conta'}
                </p>
              </div>
              <SidebarTrigger />
            </header>
            
            {/* Dashboard Content */}
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Processo de Criação da Holding</h2>
                  <div className="space-y-4">
                    {roadmapSteps.map(step => (
                      <div key={step.id} className="flex items-center">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                          step.complete ? 'bg-w1-primary-accent text-w1-primary-dark' : 'bg-gray-700 text-gray-300'
                        }`}>
                          {step.complete ? '✓' : step.id}
                        </div>
                        <div className="flex-1">
                          <p className={`${step.complete ? 'text-w1-primary-accent' : 'text-gray-300'}`}>
                            {step.title}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                    <Button className="bg-w1-primary-accent text-w1-primary-dark hover:opacity-90">
                      Próximo Passo: Enviar Documentos
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Distribuição de Ativos</h2>
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-full">
                      {mockAssetData.map((item, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.name}</span>
                            <span>{item.value}%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div 
                              className="bg-w1-primary-accent h-2 rounded-full"
                              style={{ width: `${item.value}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Economia Fiscal</h2>
                  <div className="flex items-center justify-center h-48">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">Economia anual estimada</p>
                      <p className="text-4xl font-bold text-w1-primary-accent">R$ 124.850,00</p>
                      <p className="text-green-400 text-sm mt-2">+12% vs. tributação convencional</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Próximos Passos</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                        <FileText size={18} className="text-w1-primary-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Enviar documentos pessoais</p>
                        <p className="text-sm text-gray-400">Necessário para prosseguir</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                        <FileText size={18} className="text-w1-primary-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Enviar documentos dos imóveis</p>
                        <p className="text-sm text-gray-400">Necessário para prosseguir</p>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                        <Users size={18} className="text-w1-primary-accent" />
                      </div>
                      <div>
                        <p className="font-medium">Definir estrutura societária</p>
                        <p className="text-sm text-gray-400">Opcional, mas recomendado</p>
                      </div>
                    </li>
                  </ul>
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
    </SidebarProvider>
  );
};

export default Members;
