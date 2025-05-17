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
import NewAssetForm from '@/components/assets/NewAssetForm';
import AssetValueChart from '@/components/assets/charts/AssetValueChart';
import AssetDonutChart from '@/components/assets/charts/AssetDonutChart';
import { useToast } from '@/hooks/use-toast';

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
  documents?: {name: string, uploaded: boolean}[];
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
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isAddingAsset, setIsAddingAsset] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    navigate('/');
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleBackToList = () => {
    setSelectedAsset(null);
  };

  const handleAddAsset = (newAsset: Asset) => {
    setAssets([newAsset, ...assets]);
    toast({
      title: "Ativo adicionado",
      description: `${newAsset.name} foi adicionado com sucesso.`
    });
  };

  const filteredAssets = activeTab === 'todos' 
    ? assets 
    : assets.filter(asset => asset.type === activeTab);

  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  
  const assetsByType = {
    imoveis: {
      total: assets.filter(a => a.type === 'imoveis').reduce((sum, a) => sum + a.value, 0),
      count: assets.filter(a => a.type === 'imoveis').length
    },
    investimentos: {
      total: assets.filter(a => a.type === 'investimentos').reduce((sum, a) => sum + a.value, 0),
      count: assets.filter(a => a.type === 'investimentos').length
    },
    participacoes: {
      total: assets.filter(a => a.type === 'participacoes').reduce((sum, a) => sum + a.value, 0),
      count: assets.filter(a => a.type === 'participacoes').length
    },
    outros: {
      total: assets.filter(a => a.type === 'outros').reduce((sum, a) => sum + a.value, 0),
      count: assets.filter(a => a.type === 'outros').length
    }
  };

  // Data for asset distribution donut chart
  const assetDistributionData = [
    { name: 'Imóveis', value: assetsByType.imoveis.total, color: '#9B87F5' },
    { name: 'Investimentos', value: assetsByType.investimentos.total, color: '#33C3F0' },
    { name: 'Participações', value: assetsByType.participacoes.total, color: '#10b981' },
    { name: 'Outros', value: assetsByType.outros.total, color: '#E5DEFF' }
  ];

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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Asset Value Chart */}
                  <AssetValueChart 
                    title="Patrimônio Total" 
                    subtitle={`R$ ${new Intl.NumberFormat('pt-BR').format(totalAssetValue)}`}
                    growthPercentage={8.34}
                    period="este mês"
                  />
                  
                  {/* Asset Distribution Chart */}
                  <AssetDonutChart 
                    data={assetDistributionData} 
                    title="Distribuição por Categoria"
                  />
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
                        <Button 
                          size="sm" 
                          variant="blue" 
                          onClick={() => setIsAddingAsset(true)}
                        >
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
            
            <NewAssetForm 
              open={isAddingAsset} 
              onClose={() => setIsAddingAsset(false)}
              onSave={handleAddAsset}
            />
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Assets;
