
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, Download, Building2, BarChart2, Users, Package, Clock, Banknote, MapPin, BarChart3 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import type { Asset } from '@/pages/Assets';
import PropertyChart from './charts/PropertyChart';
import InvestmentChart from './charts/InvestmentChart';
import CompanyChart from './charts/CompanyChart';
import OtherAssetChart from './charts/OtherAssetChart';
import AssetValueChart from './charts/AssetValueChart';

interface AssetDetailsProps {
  asset: Asset;
  onBack: () => void;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  
  const getAssetTypeIcon = (type: string) => {
    switch (type) {
      case 'imoveis':
        return <Building2 size={20} className="text-blue-400 mr-2" />;
      case 'investimentos':
        return <BarChart2 size={20} className="text-purple-400 mr-2" />;
      case 'participacoes':
        return <Users size={20} className="text-green-400 mr-2" />;
      case 'outros':
        return <Package size={20} className="text-amber-400 mr-2" />;
      default:
        return <Building2 size={20} className="text-blue-400 mr-2" />;
    }
  };

  const getAssetCategoryColor = (type: string) => {
    switch (type) {
      case 'imoveis':
        return 'bg-blue-500/20 text-blue-400';
      case 'investimentos':
        return 'bg-purple-500/20 text-purple-400';
      case 'participacoes':
        return 'bg-green-500/20 text-green-400';
      case 'outros':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return 'N/A';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return new Intl.NumberFormat('pt-BR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(date);
  };

  const renderOverviewChart = () => {
    switch (asset.type) {
      case 'imoveis':
        return <PropertyChart />;
      case 'investimentos':
        return <InvestmentChart />;
      case 'participacoes':
        return <CompanyChart chartType="dividends" />;
      case 'outros':
        return <OtherAssetChart />;
      default:
        return <PropertyChart />;
    }
  };

  const renderSpecificChart = () => {
    switch (asset.type) {
      case 'imoveis':
        return <AssetValueChart title="Valorização do Imóvel" subtitle="Últimos 3 anos" growthPercentage={3.2} period="este ano" />;
      case 'investimentos':
        return <AssetValueChart title="Rendimento da Carteira" subtitle="Últimos 12 meses" growthPercentage={8.7} period="este mês" />;
      case 'participacoes':
        return <CompanyChart chartType="valuation" />;
      case 'outros':
        return <AssetValueChart title="Depreciação do Ativo" subtitle="Desde a aquisição" growthPercentage={-5.2} period="este ano" />;
      default:
        return <AssetValueChart />;
    }
  };

  const getAssetSpecificInfo = () => {
    switch (asset.type) {
      case 'imoveis':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Endereço</span>
              </div>
              <p className="text-white">{asset.address || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Building2 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Tipo de Imóvel</span>
              </div>
              <p className="text-white">{asset.propertyType || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <BarChart3 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Área</span>
              </div>
              <p className="text-white">{asset.area || 'N/A'}</p>
            </div>
          </div>
        );
      case 'investimentos':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <BarChart2 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Ticker</span>
              </div>
              <p className="text-white">{asset.ticker || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <BarChart3 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Quantidade</span>
              </div>
              <p className="text-white">{asset.quantity?.toLocaleString() || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Banknote size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Preço Médio</span>
              </div>
              <p className="text-white">{formatCurrency(asset.averagePrice)}</p>
            </div>
          </div>
        );
      case 'participacoes':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Building2 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Empresa</span>
              </div>
              <p className="text-white">{asset.companyName || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Users size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Participação</span>
              </div>
              <p className="text-white">{asset.participationPercentage}%</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <MapPin size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">CNPJ</span>
              </div>
              <p className="text-white">{asset.cnpj || 'N/A'}</p>
            </div>
          </div>
        );
      case 'outros':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Package size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Descrição</span>
              </div>
              <p className="text-white">{asset.description || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <BarChart3 size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Nº de Série</span>
              </div>
              <p className="text-white">{asset.serialNumber || 'N/A'}</p>
            </div>
            <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700/30">
              <div className="flex items-center mb-2">
                <Clock size={16} className="text-gray-400 mr-2" />
                <span className="text-gray-400 text-sm">Data de Aquisição</span>
              </div>
              <p className="text-white">{formatDate(asset.acquisitionDate)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-transparent">
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" onClick={onBack} className="border-gray-700 bg-gray-800/50 text-gray-300">
          <ChevronLeft size={16} className="mr-1" /> Voltar
        </Button>
        <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800/50 text-gray-300">
          <Download size={16} className="mr-1" /> Exportar
        </Button>
      </div>

      <div className="bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div className="flex items-center mb-4 md:mb-0">
            {getAssetTypeIcon(asset.type)}
            <h2 className="text-2xl font-bold">{asset.name}</h2>
          </div>
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm ${getAssetCategoryColor(asset.type)}`}>
              {asset.category}
            </span>
            {asset.status && (
              <span className="bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full text-sm ml-2">
                {asset.status}
              </span>
            )}
          </div>
        </div>

        {getAssetSpecificInfo()}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
            <span className="text-sm text-gray-400">Valor Atual</span>
            <p className="text-xl font-bold">{formatCurrency(asset.value)}</p>
            {asset.performance !== undefined && (
              <div className="flex items-center mt-1">
                <span className={`text-xs ${asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.performance >= 0 ? '+' : ''}{asset.performance.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
            <span className="text-sm text-gray-400">Valor de Aquisição</span>
            <p className="text-xl font-bold">{formatCurrency(asset.acquisitionValue)}</p>
            {asset.acquisitionDate && (
              <div className="flex items-center mt-1">
                <Clock size={12} className="text-gray-400 mr-1" />
                <span className="text-xs text-gray-400">
                  {formatDate(asset.acquisitionDate)}
                </span>
              </div>
            )}
          </div>
          
          {asset.type === 'imoveis' && (
            <>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Valorização</span>
                <p className="text-xl font-bold">
                  {asset.acquisitionValue !== undefined && asset.value !== undefined 
                    ? ((asset.value - asset.acquisitionValue) / asset.acquisitionValue * 100).toFixed(1) + '%'
                    : 'N/A'
                  }
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Desde a aquisição</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Receita Anual</span>
                <p className="text-xl font-bold">{formatCurrency(asset.value * 0.05)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Estimada (5% a.a.)</span>
                </div>
              </div>
            </>
          )}
          
          {asset.type === 'investimentos' && (
            <>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Cotação Atual</span>
                <p className="text-xl font-bold">{formatCurrency(asset.currentPrice)}</p>
                {asset.averagePrice !== undefined && asset.currentPrice !== undefined && (
                  <div className="flex items-center mt-1">
                    <span className={`text-xs ${asset.currentPrice >= asset.averagePrice ? 'text-green-400' : 'text-red-400'}`}>
                      {((asset.currentPrice - asset.averagePrice) / asset.averagePrice * 100).toFixed(1)}%
                    </span>
                    <span className="text-xs text-gray-400 ml-1">vs. preço médio</span>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Rentabilidade Anual</span>
                <p className="text-xl font-bold">
                  {asset.performance !== undefined ? 
                    (asset.performance * 12 / 3).toFixed(1) + '%' : 
                    'N/A'
                  }
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Anualizada (3 meses)</span>
                </div>
              </div>
            </>
          )}
          
          {asset.type === 'participacoes' && (
            <>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Dividendos Anuais</span>
                <p className="text-xl font-bold">{formatCurrency(asset.value * 0.07)}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Estimados (7% a.a.)</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Valorização</span>
                <p className="text-xl font-bold">
                  {asset.acquisitionValue !== undefined && asset.value !== undefined 
                    ? ((asset.value - asset.acquisitionValue) / asset.acquisitionValue * 100).toFixed(1) + '%'
                    : 'N/A'
                  }
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Desde a aquisição</span>
                </div>
              </div>
            </>
          )}
          
          {asset.type === 'outros' && (
            <>
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Depreciação</span>
                <p className="text-xl font-bold">
                  {asset.acquisitionValue !== undefined && asset.value !== undefined 
                    ? ((asset.value - asset.acquisitionValue) / asset.acquisitionValue * 100).toFixed(1) + '%'
                    : 'N/A'
                  }
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Desde a aquisição</span>
                </div>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30">
                <span className="text-sm text-gray-400">Taxa de Depreciação</span>
                <p className="text-xl font-bold">
                  {asset.acquisitionDate ? 
                    (() => {
                      const acquisitionDate = new Date(asset.acquisitionDate!);
                      const now = new Date();
                      const years = (now.getTime() - acquisitionDate.getTime()) / (1000 * 60 * 60 * 24 * 365);
                      const annualRate = years > 0 && asset.acquisitionValue && asset.value ? 
                        ((asset.value - asset.acquisitionValue) / asset.acquisitionValue) / years : 0;
                      return (annualRate * 100).toFixed(1) + '%';
                    })() : 
                    'N/A'
                  }
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-400">Anual</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-gray-800/50 p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="details" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Detalhes e Projeções
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
            Documentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30">
          <h3 className="text-xl font-bold mb-4">Desempenho do Ativo</h3>
          <div className="h-[400px]">
            {renderOverviewChart()}
          </div>
        </TabsContent>

        <TabsContent value="details" className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30 h-[400px]">
            {renderSpecificChart()}
          </div>
          <div className="bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30">
            <h3 className="text-xl font-bold mb-4">Detalhes Adicionais</h3>
            <div className="space-y-4">
              {asset.type === 'imoveis' && (
                <>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Informações do Imóvel</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tipo de Imóvel:</span>
                        <span>{asset.propertyType || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Área:</span>
                        <span>{asset.area || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Endereço:</span>
                        <span>{asset.address || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">IPTU Anual (estimado):</span>
                        <span>{formatCurrency(asset.value * 0.01)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Seguro Anual (estimado):</span>
                        <span>{formatCurrency(asset.value * 0.003)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-medium mb-2">Projeções Financeiras</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rentabilidade (aluguel):</span>
                        <span>5,0% a.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valorização Média:</span>
                        <span>3,2% a.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retorno Total Estimado:</span>
                        <span>8,2% a.a.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {asset.type === 'investimentos' && (
                <>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Informações do Investimento</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ticker:</span>
                        <span>{asset.ticker || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Quantidade:</span>
                        <span>{asset.quantity?.toLocaleString() || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Preço Médio:</span>
                        <span>{formatCurrency(asset.averagePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Preço Atual:</span>
                        <span>{formatCurrency(asset.currentPrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Rentabilidade:</span>
                        <span className={asset.performance && asset.performance >= 0 ? "text-green-400" : "text-red-400"}>
                          {asset.performance ? `${asset.performance >= 0 ? '+' : ''}${asset.performance.toFixed(1)}%` : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-medium mb-2">Projeções Financeiras</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dividendos Projetados:</span>
                        <span>{formatCurrency(asset.value * 0.03)} (3,0% a.a.)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valorização Projetada:</span>
                        <span>8,7% a.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retorno Total Estimado:</span>
                        <span>11,7% a.a.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {asset.type === 'participacoes' && (
                <>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Informações da Participação</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Empresa:</span>
                        <span>{asset.companyName || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CNPJ:</span>
                        <span>{asset.cnpj || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Participação:</span>
                        <span>{asset.participationPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data de Aquisição:</span>
                        <span>{formatDate(asset.acquisitionDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor de Aquisição:</span>
                        <span>{formatCurrency(asset.acquisitionValue)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-medium mb-2">Projeções Financeiras</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Dividendos Projetados:</span>
                        <span>{formatCurrency(asset.value * 0.07)} (7,0% a.a.)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valorização Projetada:</span>
                        <span>15,3% a.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Retorno Total Estimado:</span>
                        <span>22,3% a.a.</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {asset.type === 'outros' && (
                <>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Informações do Ativo</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Descrição:</span>
                        <span>{asset.description || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Nº de Série:</span>
                        <span>{asset.serialNumber || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Data de Aquisição:</span>
                        <span>{formatDate(asset.acquisitionDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor de Aquisição:</span>
                        <span>{formatCurrency(asset.acquisitionValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor Atual:</span>
                        <span>{formatCurrency(asset.value)}</span>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-lg font-medium mb-2">Depreciação</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Taxa de Depreciação Anual:</span>
                        <span>-5,2% a.a.</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Valor Depreciado Total:</span>
                        <span>{asset.acquisitionValue && formatCurrency(asset.acquisitionValue - asset.value)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Vida Útil Restante (estimada):</span>
                        <span>8 anos</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-6 bg-gray-800/30 p-6 rounded-2xl backdrop-blur-sm border border-gray-700/30">
          <h3 className="text-xl font-bold mb-4">Documentos do Ativo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {asset.type === 'imoveis' && (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium">Escritura</p>
                      <p className="text-xs text-gray-400">PDF • 2.1 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium">IPTU</p>
                      <p className="text-xs text-gray-400">PDF • 1.8 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-400 mr-3" />
                    <div>
                      <p className="font-medium">Matrícula</p>
                      <p className="text-xs text-gray-400">PDF • 3.4 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
              </>
            )}
            
            {asset.type === 'investimentos' && (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-purple-400 mr-3" />
                    <div>
                      <p className="font-medium">Notas de Negociação</p>
                      <p className="text-xs text-gray-400">PDF • 1.2 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-purple-400 mr-3" />
                    <div>
                      <p className="font-medium">Informe de Rendimentos</p>
                      <p className="text-xs text-gray-400">PDF • 0.9 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
              </>
            )}
            
            {asset.type === 'participacoes' && (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-green-400 mr-3" />
                    <div>
                      <p className="font-medium">Contrato Social</p>
                      <p className="text-xs text-gray-400">PDF • 3.5 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-green-400 mr-3" />
                    <div>
                      <p className="font-medium">Acordo de Acionistas</p>
                      <p className="text-xs text-gray-400">PDF • 2.8 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-green-400 mr-3" />
                    <div>
                      <p className="font-medium">Demonstrações Financeiras</p>
                      <p className="text-xs text-gray-400">PDF • 4.1 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
              </>
            )}
            
            {asset.type === 'outros' && (
              <>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-amber-400 mr-3" />
                    <div>
                      <p className="font-medium">Nota Fiscal</p>
                      <p className="text-xs text-gray-400">PDF • 1.1 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-amber-400 mr-3" />
                    <div>
                      <p className="font-medium">Certificado de Garantia</p>
                      <p className="text-xs text-gray-400">PDF • 0.8 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
                <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/30 flex items-center justify-between cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center">
                    <FileText size={20} className="text-amber-400 mr-3" />
                    <div>
                      <p className="font-medium">Apólice de Seguro</p>
                      <p className="text-xs text-gray-400">PDF • 1.6 MB</p>
                    </div>
                  </div>
                  <Download size={16} className="text-gray-400 hover:text-white" />
                </div>
              </>
            )}
            
            <Button variant="outline" className="bg-gray-800/50 border-dashed border-gray-700/50 h-full flex flex-col items-center justify-center gap-2 hover:bg-gray-700/30 transition-colors">
              <Plus size={20} className="text-gray-400" />
              <span className="text-gray-400">Adicionar Documento</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetails;
