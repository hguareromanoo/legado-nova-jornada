
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowLeft, Building2, BarChart2, Users, Package, FileText } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Asset } from '@/pages/Assets';

// Import chart components
import PropertyChart from './charts/PropertyChart';
import InvestmentChart from './charts/InvestmentChart';
import CompanyChart from './charts/CompanyChart';
import OtherAssetChart from './charts/OtherAssetChart';

interface AssetDetailsProps {
  asset: Asset;
  onBack: () => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, onBack }) => {
  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'imoveis':
        return <Building2 size={20} className="text-blue-400" />;
      case 'investimentos':
        return <BarChart2 size={20} className="text-purple-400" />;
      case 'participacoes':
        return <Users size={20} className="text-green-400" />;
      case 'outros':
        return <Package size={20} className="text-amber-400" />;
      default:
        return <Building2 size={20} className="text-blue-400" />;
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'imoveis':
        return 'bg-blue-500/20';
      case 'investimentos':
        return 'bg-purple-500/20';
      case 'participacoes':
        return 'bg-green-500/20';
      case 'outros':
        return 'bg-amber-500/20';
      default:
        return 'bg-blue-500/20';
    }
  };

  const renderAssetContent = () => {
    switch (asset.type) {
      case 'imoveis':
        return renderPropertyContent();
      case 'investimentos':
        return renderInvestmentContent();
      case 'participacoes':
        return renderCompanyContent();
      case 'outros':
        return renderOtherAssetContent();
      default:
        return null;
    }
  };

  const renderPropertyContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Informações do Imóvel</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Endereço</p>
                  <p className="font-medium">{asset.address || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tipo</p>
                  <p className="font-medium">{asset.propertyType || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Área</p>
                  <p className="font-medium">{asset.area || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium">{asset.status || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Data de Aquisição</p>
                  <p className="font-medium">{formatDate(asset.acquisitionDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valor de Aquisição</p>
                  <p className="font-medium">{formatCurrency(asset.acquisitionValue)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Valor Atual</p>
                  <p className="font-medium text-lg text-green-400">{formatCurrency(asset.marketValue)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valorização</p>
                  <p className="font-medium text-lg text-green-400">
                    {asset.acquisitionValue && asset.marketValue ? 
                      `+${(((asset.marketValue - asset.acquisitionValue) / asset.acquisitionValue) * 100).toFixed(2)}%` : 
                      '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Valorização do Imóvel</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PropertyChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Receita de Aluguel</h3>
          </CardHeader>
          <CardContent className="h-[250px]">
            <PropertyChart chartType="rental" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Taxa de Ocupação</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PropertyChart chartType="occupancy" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Custos de Manutenção</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <PropertyChart chartType="maintenance" />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderInvestmentContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Informações do Investimento</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Ticker</p>
                  <p className="font-medium">{asset.ticker || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Categoria</p>
                  <p className="font-medium">{asset.category || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Quantidade</p>
                  <p className="font-medium">{asset.quantity?.toLocaleString() || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium">{asset.status || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Preço Médio</p>
                  <p className="font-medium">{formatCurrency(asset.averagePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Preço Atual</p>
                  <p className="font-medium">{formatCurrency(asset.currentPrice)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Valor Total</p>
                  <p className="font-medium text-lg text-green-400">{formatCurrency(asset.value)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Rentabilidade</p>
                  <p className={`font-medium text-lg ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance ? `${asset.performance > 0 ? '+' : ''}${asset.performance.toFixed(2)}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Evolução da Cotação</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestmentChart />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Rentabilidade Acumulada</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestmentChart chartType="returns" />
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Proventos Recebidos</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <InvestmentChart chartType="dividends" />
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderCompanyContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Informações da Empresa</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Nome da Empresa</p>
                  <p className="font-medium">{asset.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">CNPJ</p>
                  <p className="font-medium">{asset.cnpj || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Participação</p>
                  <p className="font-medium">{asset.participationPercentage ? `${asset.participationPercentage}%` : '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium">{asset.status || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Data de Aquisição</p>
                  <p className="font-medium">{formatDate(asset.acquisitionDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valor do Investimento</p>
                  <p className="font-medium">{formatCurrency(asset.acquisitionValue)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Valor Atual</p>
                  <p className="font-medium text-lg text-green-400">{formatCurrency(asset.value)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valorização</p>
                  <p className={`font-medium text-lg ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance ? `${asset.performance > 0 ? '+' : ''}${asset.performance.toFixed(2)}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Dividendos Recebidos</h3>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CompanyChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Evolução do Valor da Participação</h3>
          </CardHeader>
          <CardContent className="h-[250px]">
            <CompanyChart chartType="valuation" />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Documentos Associados</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Contrato de Participação</p>
                  <p className="text-sm text-gray-400">Atualizado em 15/01/2024</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                  Visualizar
                </Button>
              </div>
              
              <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Acordo de Acionistas</p>
                  <p className="text-sm text-gray-400">Atualizado em 10/05/2023</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                  Visualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderOtherAssetContent = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Informações do Ativo</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Descrição</p>
                  <p className="font-medium">{asset.description || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Categoria</p>
                  <p className="font-medium">{asset.category || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Número de Série</p>
                  <p className="font-medium">{asset.serialNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-medium">{asset.status || '-'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Data de Aquisição</p>
                  <p className="font-medium">{formatDate(asset.acquisitionDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valor de Aquisição</p>
                  <p className="font-medium">{formatCurrency(asset.acquisitionValue)}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">Valor Atual</p>
                  <p className="font-medium text-lg text-green-400">{formatCurrency(asset.value)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Valorização</p>
                  <p className={`font-medium text-lg ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance ? `${asset.performance > 0 ? '+' : ''}${asset.performance.toFixed(2)}%` : '-'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Depreciação/Valorização</h3>
          </CardHeader>
          <CardContent className="h-[250px]">
            <OtherAssetChart />
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2 bg-gray-800/30 border-gray-700/30">
          <CardHeader className="pb-2">
            <h3 className="text-lg font-medium">Documentos Associados</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 pt-2">
              <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Nota Fiscal</p>
                  <p className="text-sm text-gray-400">Emitida em {formatDate(asset.acquisitionDate)}</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                  Visualizar
                </Button>
              </div>
              
              <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                  <FileText size={18} className="text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Apólice de Seguro</p>
                  <p className="text-sm text-gray-400">Atualizada em 05/02/2024</p>
                </div>
                <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                  Visualizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-4 text-gray-400 hover:text-white"
          onClick={onBack}
        >
          <ArrowLeft size={18} className="mr-1" />
          Voltar
        </Button>
        
        <div className="flex items-center">
          <div className={`${getIconBgColor(asset.type)} p-2 rounded-lg mr-3`}>
            {getAssetIcon(asset.type)}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{asset.name}</h2>
            <p className="text-gray-400">{asset.category}</p>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="bg-gray-800/50 p-1 rounded-lg mb-6">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Histórico
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Configurações
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {renderAssetContent()}
        </TabsContent>
        
        <TabsContent value="documents">
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <h3 className="text-lg font-medium">Documentos do Ativo</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 pt-2">
                <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                  <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Documento Principal</p>
                    <p className="text-sm text-gray-400">Atualizado em 15/01/2024</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                    Visualizar
                  </Button>
                </div>
                
                <div className="flex items-center p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                  <div className="bg-gray-600/30 p-2 rounded-lg mr-3">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Documentação Fiscal</p>
                    <p className="text-sm text-gray-400">Atualizado em 10/05/2023</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-700 bg-gray-700/50 text-gray-300">
                    Visualizar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <div className="text-center py-10 text-gray-400">
            <p>O histórico deste ativo estará disponível em breve.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="text-center py-10 text-gray-400">
            <p>Configurações do ativo estará disponível em breve.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetails;
