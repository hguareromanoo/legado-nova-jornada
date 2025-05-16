
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
import { 
  Home, 
  FileText, 
  BarChart2, 
  Settings, 
  Users, 
  User, 
  LogIn, 
  Building2,
  MessageSquare,
  Plus,
  Filter
} from 'lucide-react';
import AssetOverview from '@/components/assets/AssetOverview';
import AssetDetails from '@/components/assets/AssetDetails';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type AssetType = 'imoveis' | 'investimentos' | 'participacoes' | 'outros' | 'todos';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  category: string;
  value: number;
  performance?: number;
  status?: string;
  address?: string;
  propertyType?: string;
  area?: string;
  acquisitionDate?: string;
  acquisitionValue?: number;
  marketValue?: number;
  ticker?: string;
  quantity?: number;
  averagePrice?: number;
  currentPrice?: number;
  companyName?: string;
  cnpj?: string;
  participationPercentage?: number;
  description?: string;
  serialNumber?: string;
}

// Mock data for the assets
const mockAssets: Asset[] = [
  // Imóveis
  {
    id: 'imovel-1',
    name: 'Imóvel Alphaville',
    type: 'imoveis',
    category: 'Residencial',
    value: 980000,
    performance: 3.2,
    status: 'Ativo',
    address: 'Condomínio Alphaville, São Paulo, SP',
    propertyType: 'Residencial',
    area: '350m²',
    acquisitionDate: '2019-05-15',
    acquisitionValue: 850000,
    marketValue: 980000
  },
  {
    id: 'imovel-2',
    name: 'Sala Comercial',
    type: 'imoveis',
    category: 'Comercial',
    value: 420000,
    performance: -1.2,
    status: 'Pendente',
    address: 'Centro Empresarial, Rio de Janeiro, RJ',
    propertyType: 'Comercial',
    area: '120m²',
    acquisitionDate: '2020-11-10',
    acquisitionValue: 400000,
    marketValue: 420000
  },
  {
    id: 'imovel-3',
    name: 'Loja Centro',
    type: 'imoveis',
    category: 'Comercial',
    value: 350000,
    performance: 0.8,
    status: 'Alugado',
    address: 'Centro, São Paulo, SP',
    propertyType: 'Comercial',
    area: '85m²',
    acquisitionDate: '2018-03-22',
    acquisitionValue: 320000,
    marketValue: 350000
  },
  
  // Investimentos
  {
    id: 'invest-1',
    name: 'Ações PETR4',
    type: 'investimentos',
    category: 'Ações',
    value: 354780,
    performance: 8.7,
    status: 'Ativo',
    ticker: 'PETR4',
    quantity: 12000,
    averagePrice: 28.5,
    currentPrice: 29.57
  },
  {
    id: 'invest-2',
    name: 'Tesouro SELIC',
    type: 'investimentos',
    category: 'Renda Fixa',
    value: 250000,
    performance: 12.1,
    status: 'Ativo',
    ticker: 'LFT',
    quantity: 1,
    averagePrice: 223000,
    currentPrice: 250000
  },
  {
    id: 'invest-3',
    name: 'Fundos Imobiliários',
    type: 'investimentos',
    category: 'FIIs',
    value: 185000,
    performance: 5.4,
    status: 'Ativo',
    ticker: 'Diversos',
    quantity: 1850,
    averagePrice: 100,
    currentPrice: 100
  },
  
  // Participações Societárias
  {
    id: 'part-1',
    name: 'Empresa XYZ Tecnologia',
    type: 'participacoes',
    category: 'Tecnologia',
    value: 2000000,
    performance: 15.3,
    status: 'Ativo',
    companyName: 'XYZ Tecnologia LTDA',
    cnpj: '12.345.678/0001-99',
    participationPercentage: 25,
    acquisitionDate: '2017-06-01',
    acquisitionValue: 1500000
  },
  
  // Outros Ativos
  {
    id: 'outro-1',
    name: 'Veículo de Luxo',
    type: 'outros',
    category: 'Veículos',
    value: 450000,
    performance: -5.2,
    status: 'Ativo',
    description: 'Mercedes-Benz S550',
    serialNumber: 'WDD2221562A419550',
    acquisitionDate: '2021-01-10',
    acquisitionValue: 480000
  }
];

const Assets = () => {
  const [activeTab, setActiveTab] = useState('todos');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
  };

  const filteredAssets = activeTab === 'todos' 
    ? mockAssets 
    : mockAssets.filter(asset => asset.type === activeTab);

  const totalAssetValue = mockAssets.reduce((sum, asset) => sum + asset.value, 0);
  
  const assetsByType = {
    imoveis: {
      total: mockAssets.filter(a => a.type === 'imoveis').reduce((sum, a) => sum + a.value, 0),
      count: mockAssets.filter(a => a.type === 'imoveis').length
    },
    investimentos: {
      total: mockAssets.filter(a => a.type === 'investimentos').reduce((sum, a) => sum + a.value, 0),
      count: mockAssets.filter(a => a.type === 'investimentos').length
    },
    participacoes: {
      total: mockAssets.filter(a => a.type === 'participacoes').reduce((sum, a) => sum + a.value, 0),
      count: mockAssets.filter(a => a.type === 'participacoes').length
    },
    outros: {
      total: mockAssets.filter(a => a.type === 'outros').reduce((sum, a) => sum + a.value, 0),
      count: mockAssets.filter(a => a.type === 'outros').length
    }
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
                    isActive={false} 
                    onClick={() => navigate('/members')}
                    tooltip="Sua Holding"
                  >
                    <Home />
                    <span>Sua Holding</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={true} 
                    onClick={() => {}}
                    tooltip="Ativos"
                  >
                    <BarChart2 />
                    <span>Ativos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => navigate('/assistant')}
                    tooltip="Chat Assistente"
                  >
                    <MessageSquare />
                    <span>Chat Assistente</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => navigate('/documents')}
                    tooltip="Documentos"
                  >
                    <FileText />
                    <span>Documentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => navigate('/structure')}
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
                    isActive={false} 
                    onClick={() => navigate('/profile')}
                    tooltip="Perfil"
                  >
                    <User />
                    <span>Perfil</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={false} 
                    onClick={() => navigate('/settings')}
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
          <div className="p-6">
            <header className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-2xl font-bold">Ativos</h1>
                <p className="text-gray-400">
                  Gerencie seus ativos patrimoniais
                </p>
              </div>
              <SidebarTrigger />
            </header>

            {selectedAsset ? (
              <AssetDetails asset={selectedAsset} onBack={handleBackToList} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalAssetValue)}
                    </h3>
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
                  
                  <div className="col-span-3 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      <h3 className="text-2xl font-bold mb-3">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(assetsByType.imoveis.total)}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{assetsByType.imoveis.count} imóveis</span>
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
                      <h3 className="text-2xl font-bold mb-3">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(assetsByType.investimentos.total)}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{assetsByType.investimentos.count} ativos</span>
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
                        <div className="text-gray-400 text-sm">Participações</div>
                        <button className="text-gray-400">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="10" cy="10" r="1" fill="currentColor" />
                            <circle cx="10" cy="6" r="1" fill="currentColor" />
                            <circle cx="10" cy="14" r="1" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                      <h3 className="text-2xl font-bold mb-3">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(assetsByType.participacoes.total)}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{assetsByType.participacoes.count} empresas</span>
                        <span className="text-green-400 text-sm flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          15.3%
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
                      <h3 className="text-2xl font-bold mb-3">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(assetsByType.outros.total)}
                      </h3>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm">{assetsByType.outros.count} ativos</span>
                        <span className="text-red-400 text-sm flex items-center">
                          <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          5.2%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6 flex justify-between items-center">
                  <Tabs defaultValue="todos" className="w-full" onValueChange={setActiveTab}>
                    <div className="flex justify-between items-center w-full">
                      <TabsList className="bg-gray-800/50 p-1 rounded-lg">
                        <TabsTrigger value="todos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Todos
                        </TabsTrigger>
                        <TabsTrigger value="imoveis" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Imóveis
                        </TabsTrigger>
                        <TabsTrigger value="investimentos" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Investimentos
                        </TabsTrigger>
                        <TabsTrigger value="participacoes" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Participações
                        </TabsTrigger>
                        <TabsTrigger value="outros" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          Outros
                        </TabsTrigger>
                      </TabsList>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800/50 text-gray-300">
                          <Filter size={16} className="mr-1" />
                          Filtrar
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          <Plus size={16} className="mr-1" />
                          Novo Ativo
                        </Button>
                      </div>
                    </div>

                    <TabsContent value="todos" className="mt-6">
                      <AssetOverview assets={filteredAssets} onAssetSelect={handleAssetSelect} />
                    </TabsContent>
                    <TabsContent value="imoveis" className="mt-6">
                      <AssetOverview assets={filteredAssets} onAssetSelect={handleAssetSelect} />
                    </TabsContent>
                    <TabsContent value="investimentos" className="mt-6">
                      <AssetOverview assets={filteredAssets} onAssetSelect={handleAssetSelect} />
                    </TabsContent>
                    <TabsContent value="participacoes" className="mt-6">
                      <AssetOverview assets={filteredAssets} onAssetSelect={handleAssetSelect} />
                    </TabsContent>
                    <TabsContent value="outros" className="mt-6">
                      <AssetOverview assets={filteredAssets} onAssetSelect={handleAssetSelect} />
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Assets;
