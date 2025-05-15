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
import { Home, FileText, BarChart2, Settings, Users, User, LogIn, Calendar, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the dashboard
const mockAssetData = [
  { name: 'Imóveis', value: 65 },
  { name: 'Investimentos', value: 20 },
  { name: 'Empresas', value: 10 },
  { name: 'Outros', value: 5 }
];

const COLORS = ['#5ADBB5', '#36B37E', '#00875A', '#00C781'];

const roadmapSteps = [
  { id: 1, title: 'Simulação', complete: true },
  { id: 2, title: 'Cadastro', complete: true },
  { id: 3, title: 'Envio de Documentos', complete: false },
  { id: 4, title: 'Análise Jurídica', complete: false },
  { id: 5, title: 'Estruturação da Holding', complete: false },
  { id: 6, title: 'Assinatura de Contrato', complete: false },
  { id: 7, title: 'Holding Estabelecida', complete: false },
];

// Additional mock data for charts
const monthlyIncomeData = [
  { month: 'Jan', income: 15000 },
  { month: 'Fev', income: 16000 },
  { month: 'Mar', income: 15500 },
  { month: 'Abr', income: 17000 },
  { month: 'Mai', income: 16500 },
  { month: 'Jun', income: 18000 },
  { month: 'Jul', income: 19000 },
  { month: 'Ago', income: 19500 },
  { month: 'Set', income: 20000 },
  { month: 'Out', income: 21000 },
  { month: 'Nov', income: 22000 },
  { month: 'Dez', income: 23000 },
];

const taxComparisonData = [
  { year: '2024', withHolding: 25000, withoutHolding: 75000 },
  { year: '2025', withHolding: 26000, withoutHolding: 78000 },
  { year: '2026', withHolding: 27000, withoutHolding: 81000 },
  { year: '2027', withHolding: 28000, withoutHolding: 84000 },
  { year: '2028', withHolding: 29000, withoutHolding: 87000 },
];

const cumulativeSavingsData = [
  { year: '2024', value: 50000 },
  { year: '2025', value: 102000 },
  { year: '2026', value: 156000 },
  { year: '2027', value: 212000 },
  { year: '2028', value: 270000 },
];

const savingsObjectivesData = [
  { name: 'Viagens', value: 30 },
  { name: 'Investimentos', value: 40 },
  { name: 'Patrimônio', value: 20 },
  { name: 'Família', value: 10 },
];

const upcomingEventsData = [
  { date: '15/06/2025', event: 'Reunião Anual de Planejamento' },
  { date: '30/07/2025', event: 'Vencimento ITCMD' },
  { date: '15/08/2025', event: 'Revisão de Contrato' },
  { date: '20/10/2025', event: 'Auditoria Contábil' },
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
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockAssetData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {mockAssetData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Economia Fiscal</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={taxComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`]} />
                        <Legend />
                        <Bar name="Com Holding" dataKey="withHolding" fill="#5ADBB5" />
                        <Bar name="Sem Holding" dataKey="withoutHolding" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Evolução da Renda Mensal</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyIncomeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`]} />
                        <Area type="monotone" dataKey="income" stroke="#5ADBB5" fill="#5ADBB5" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 lg:col-span-2">
                  <h2 className="text-xl font-semibold mb-4">Economia Acumulada ao Longo do Tempo</h2>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={cumulativeSavingsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`R$ ${value.toLocaleString('pt-BR')}`]} />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          name="Economia Acumulada" 
                          stroke="#5ADBB5" 
                          strokeWidth={2} 
                          dot={{ r: 5 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Objetivos de Economia</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={savingsObjectivesData}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {savingsObjectivesData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div>
                      <div className="space-y-4">
                        <div className="flex items-start p-2 bg-gray-700/30 rounded">
                          <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                            <CircleCheck size={18} className="text-w1-primary-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Viagem à Europa</p>
                            <p className="text-sm text-gray-400">Julho 2025</p>
                          </div>
                        </div>
                        <div className="flex items-start p-2 bg-gray-700/30 rounded">
                          <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                            <CircleCheck size={18} className="text-w1-primary-accent" />
                          </div>
                          <div>
                            <p className="font-medium">Novo Investimento</p>
                            <p className="text-sm text-gray-400">Setembro 2025</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                  <h2 className="text-xl font-semibold mb-4">Próximos Eventos</h2>
                  <div className="space-y-4">
                    {upcomingEventsData.map((event, index) => (
                      <div key={index} className="flex items-start">
                        <div className="bg-w1-primary-accent/20 p-2 rounded mr-3">
                          <Calendar size={18} className="text-w1-primary-accent" />
                        </div>
                        <div>
                          <p className="font-medium">{event.event}</p>
                          <p className="text-sm text-gray-400">{event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="text-w1-primary-accent border-w1-primary-accent/50 hover:bg-w1-primary-accent/10">
                      Ver Calendário Completo
                    </Button>
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
    </SidebarProvider>
  );
};

export default Members;
