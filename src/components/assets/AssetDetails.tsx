import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Building2, 
  BarChart2, 
  DollarSign, 
  Package2, 
  Calendar, 
  MapPin, 
  Tag, 
  Plus, 
  ClipboardList, 
  FileText, 
  Home, 
  Scale, 
  Landmark 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyChart from './charts/PropertyChart';
import InvestmentChart from './charts/InvestmentChart';
import CompanyChart from './charts/CompanyChart';
import OtherAssetChart from './charts/OtherAssetChart';
import type { Asset } from '@/pages/Assets';

interface AssetDetailsProps {
  asset: Asset;
  onBack: () => void;
}

const AssetDetails = ({ asset, onBack }: AssetDetailsProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Format currency in Brazilian Real
  const formatCurrency = (value?: number) => {
    if (value === undefined) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Format date in Brazilian format
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  const getAssetTypeIcon = () => {
    switch (asset.type) {
      case 'imoveis':
        return <Building2 className="h-6 w-6 text-w1-primary-accent" />;
      case 'investimentos':
        return <BarChart2 className="h-6 w-6 text-w1-primary-accent" />;
      case 'participacoes':
        return <DollarSign className="h-6 w-6 text-w1-primary-accent" />;
      default:
        return <Package2 className="h-6 w-6 text-w1-primary-accent" />;
    }
  };
  
  const getAssetChart = () => {
    switch (asset.type) {
      case 'imoveis':
        return <PropertyChart asset={asset} />;
      case 'investimentos':
        return <InvestmentChart asset={asset} />;
      case 'participacoes':
        return <CompanyChart asset={asset} />;
      default:
        return <OtherAssetChart asset={asset} />;
    }
  };
  
  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'ativo':
        return <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">Ativo</Badge>;
      case 'pendente':
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pendente</Badge>;
      case 'alugado':
        return <Badge variant="outline" className="bg-w1-primary-accent/20 text-w1-primary-accent border-w1-primary-accent/30">Alugado</Badge>;
      default:
        return <Badge variant="outline" className="bg-gray-500/20 text-gray-400 border-gray-500/30">{status}</Badge>;
    }
  };
  
  const renderPropertyContent = () => {
    if (asset.type !== 'imoveis') return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-40 bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark flex items-center justify-center">
                <Home className="h-16 w-16 text-w1-primary-accent opacity-20" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium mb-4">Detalhes do Imóvel</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Endereço</p>
                    <p className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.address || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Tipo</p>
                    <p className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.propertyType || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Área</p>
                    <p className="flex items-center">
                      <Scale className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.area || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data de Aquisição</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {formatDate(asset.acquisitionDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 h-full">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-4">Valores</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor de Aquisição</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.acquisitionValue)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor de Mercado Atual</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.marketValue)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valorização</p>
                  <p className={`flex items-center ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance && asset.performance >= 0 ? (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-md font-medium mb-3">Documentos</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Escritura</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Matrícula</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>IPTU</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10">
                      <Plus size={14} className="mr-1" />
                      Anexar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderInvestmentContent = () => {
    if (asset.type !== 'investimentos') return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-40 bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark flex items-center justify-center">
                <BarChart2 className="h-16 w-16 text-w1-primary-accent opacity-20" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium mb-4">Detalhes do Investimento</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Ticker</p>
                    <p className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.ticker || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Quantidade</p>
                    <p className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.quantity?.toLocaleString() || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Preço Médio</p>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.averagePrice ? formatCurrency(asset.averagePrice) : 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Preço Atual</p>
                    <p className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.currentPrice ? formatCurrency(asset.currentPrice) : 'Não informado'}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 h-full">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-4">Desempenho</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor Total</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.value)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rentabilidade</p>
                  <p className={`flex items-center ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance && asset.performance >= 0 ? (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-md font-medium mb-3">Documentos</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Nota de Corretagem</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Informe de Rendimentos</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10">
                      <Plus size={14} className="mr-1" />
                      Anexar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderParticipationContent = () => {
    if (asset.type !== 'participacoes') return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-40 bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark flex items-center justify-center">
                <Landmark className="h-16 w-16 text-w1-primary-accent opacity-20" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium mb-4">Detalhes da Empresa</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Razão Social</p>
                    <p className="flex items-center">
                      <Building2 className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.companyName || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">CNPJ</p>
                    <p className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.cnpj || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Participação</p>
                    <p className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.participationPercentage ? `${asset.participationPercentage}%` : 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data de Aquisição</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {formatDate(asset.acquisitionDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 h-full">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-4">Valores</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor de Aquisição</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.acquisitionValue)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor Atual</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.value)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valorização</p>
                  <p className={`flex items-center ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance && asset.performance >= 0 ? (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-md font-medium mb-3">Documentos</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Contrato Social</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Balanço Patrimonial</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Demonstração de Resultados</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10">
                      <Plus size={14} className="mr-1" />
                      Anexar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  const renderOtherAssetContent = () => {
    if (asset.type !== 'outros') return null;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-40 bg-gradient-to-r from-w1-primary-dark to-w1-secondary-dark flex items-center justify-center">
                <Package2 className="h-16 w-16 text-w1-primary-accent opacity-20" />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-medium mb-4">Detalhes do Ativo</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Descrição</p>
                    <p className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.description || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Número de Série</p>
                    <p className="flex items-center">
                      <ClipboardList className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {asset.serialNumber || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Data de Aquisição</p>
                    <p className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                      {formatDate(asset.acquisitionDate)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30 h-full">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-4">Valores</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor de Aquisição</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.acquisitionValue)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valor Atual</p>
                  <p className="flex items-center text-lg">
                    <DollarSign className="h-4 w-4 mr-2 text-w1-primary-accent" /> 
                    {formatCurrency(asset.value)}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Valorização</p>
                  <p className={`flex items-center ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance && asset.performance >= 0 ? (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="text-md font-medium mb-3">Documentos</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Nota Fiscal</span>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-700/30 rounded-lg">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-w1-primary-accent" />
                      <span>Certificado de Propriedade</span>
                    </div>
                    <Button variant="outline" size="sm" className="bg-transparent border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10">
                      <Plus size={14} className="mr-1" />
                      Anexar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center mb-8">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={onBack}
          className="mr-4 border-gray-700/30 text-gray-400 hover:text-white hover:bg-gray-800/50"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <div className="bg-w1-primary-accent/20 p-2 rounded-lg">
              {getAssetTypeIcon()}
            </div>
            {asset.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-gray-400">{asset.category}</span>
            {asset.status && getStatusBadge(asset.status)}
          </div>
        </div>
        <div>
          <Button variant="w1Primary">
            Editar Ativo
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-w1-secondary-dark/50 p-1 rounded-lg w-full sm:w-auto border border-gray-700/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-w1-primary-accent data-[state=active]:text-w1-primary-dark">
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-w1-primary-accent data-[state=active]:text-w1-primary-dark">
            Documentos
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-w1-primary-accent data-[state=active]:text-w1-primary-dark">
            Histórico
          </TabsTrigger>
          <TabsTrigger value="planning" className="data-[state=active]:bg-w1-primary-accent data-[state=active]:text-w1-primary-dark">
            Planejamento
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-w1-secondary-dark/30 p-5 rounded-xl backdrop-blur-sm border border-gray-700/30">
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-400 text-sm">Valor Atual</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{formatCurrency(asset.value)}</h3>
              <div className="flex items-center text-sm">
                <span className={`flex items-center ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.performance && asset.performance >= 0 ? (
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                </span>
                <span className="text-gray-400 ml-2">desde aquisição</span>
              </div>
            </Card>
            
            {asset.acquisitionValue && (
              <Card className="bg-w1-secondary-dark/30 p-5 rounded-xl backdrop-blur-sm border border-gray-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-400 text-sm">Valor de Aquisição</div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{formatCurrency(asset.acquisitionValue)}</h3>
                <div className="flex items-center text-sm">
                  <span className="text-gray-400">{formatDate(asset.acquisitionDate)}</span>
                </div>
              </Card>
            )}
            
            <Card className="bg-w1-secondary-dark/30 p-5 rounded-xl backdrop-blur-sm border border-gray-700/30">
              <div className="flex justify-between items-center mb-3">
                <div className="text-gray-400 text-sm">Status</div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{asset.status || 'Ativo'}</h3>
              <div className="flex items-center text-sm">
                <span className="text-gray-400">Atualizado há 2 dias</span>
              </div>
            </Card>
          </div>
          
          <div className="mb-8">
            <Card className="bg-w1-secondary-dark/30 border-gray-700/30">
              <CardContent className="p-5">
                <h3 className="text-xl font-medium mb-4">Evolução de Valor</h3>
                <div className="h-64">
                  {getAssetChart()}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {asset.type === 'imoveis' && renderPropertyContent()}
          {asset.type === 'investimentos' && renderInvestmentContent()}
          {asset.type === 'participacoes' && renderParticipationContent()}
          {asset.type === 'outros' && renderOtherAssetContent()}
        </TabsContent>
        
        <TabsContent value="documents" className="mt-6">
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-6 flex items-center justify-between">
                <span>Documentos do Ativo</span>
                <Button variant="w1Primary" size="sm">
                  <Plus size={16} className="mr-1" />
                  Adicionar Documento
                </Button>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-w1-secondary-dark/50 p-4 rounded-lg border border-gray-700/30 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-w1-primary-accent" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <h4 className="font-medium mb-1">Escritura</h4>
                  <p className="text-sm text-gray-400 mb-4">PDF • 2.4 MB</p>
                  <div className="mt-auto flex items-center text-sm text-gray-400">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Enviado em 15/04/2025
                  </div>
                </div>
                
                <div className="bg-w1-secondary-dark/50 p-4 rounded-lg border border-gray-700/30 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-md">
                      <FileText className="h-5 w-5 text-w1-primary-accent" />
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Enviado</Badge>
                  </div>
                  <h4 className="font-medium mb-1">Matrícula</h4>
                  <p className="text-sm text-gray-400 mb-4">PDF • 1.1 MB</p>
                  <div className="mt-auto flex items-center text-sm text-gray-400">
                    <Calendar className="h-3.5 w-3.5 mr-1.5" />
                    Enviado em 15/04/2025
                  </div>
                </div>
                
                <div className="bg-w1-secondary-dark/50 p-4 rounded-lg border border-dashed border-gray-700/30 flex flex-col items-center justify-center text-center">
                  <div className="bg-w1-primary-accent/10 p-3 rounded-full mb-3">
                    <Plus className="h-6 w-6 text-w1-primary-accent" />
                  </div>
                  <h4 className="font-medium mb-1">Adicionar Documento</h4>
                  <p className="text-sm text-gray-400">Upload de arquivos PDF, JPG ou PNG</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-6">Histórico de Transações</h3>
              
              <div className="space-y-4">
                <div className="flex items-start p-4 border border-gray-700/30 rounded-lg">
                  <div className="bg-w1-primary-accent/20 p-2 rounded-md mr-4">
                    <DollarSign className="h-5 w-5 text-w1-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Aquisição</h4>
                        <p className="text-sm text-gray-400 mt-1">Valor: {formatCurrency(asset.acquisitionValue)}</p>
                      </div>
                      <span className="text-sm text-gray-400">{formatDate(asset.acquisitionDate)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 border border-gray-700/30 rounded-lg">
                  <div className="bg-w1-primary-accent/20 p-2 rounded-md mr-4">
                    <FileText className="h-5 w-5 text-w1-primary-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Documentação Enviada</h4>
                        <p className="text-sm text-gray-400 mt-1">Escritura e matrícula</p>
                      </div>
                      <span className="text-sm text-gray-400">15/04/2025</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start p-4 border border-gray-700/30 rounded-lg">
                  <div className="bg-green-500/20 p-2 rounded-md mr-4">
                    <DollarSign className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Avaliação Atualizada</h4>
                        <p className="text-sm text-gray-400 mt-1">Valor: {formatCurrency(asset.value)}</p>
                      </div>
                      <span className="text-sm text-gray-400">01/05/2025</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="planning" className="mt-6">
          <Card className="bg-w1-secondary-dark/30 border-gray-700/30">
            <CardContent className="p-5">
              <h3 className="text-xl font-medium mb-6 flex items-center justify-between">
                <span>Planejamento Patrimonial</span>
                <Button variant="w1Primary" size="sm">
                  <Plus size={16} className="mr-1" />
                  Nova Estratégia
                </Button>
              </h3>
              
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="bg-w1-primary-accent/10 p-4 rounded-full mb-4">
                  <Building2 className="h-10 w-10 text-w1-primary-accent" />
                </div>
                <h4 className="text-lg font-medium mb-2">Estratégias em Desenvolvimento</h4>
                <p className="text-gray-400 max-w-md">
                  Nosso time de especialistas está desenvolvendo estratégias personalizadas para este ativo. Em breve você poderá visualizar opções para maximizar seu potencial.
                </p>
                <Button variant="outline" className="mt-6 border-w1-primary-accent text-w1-primary-accent hover:bg-w1-primary-accent/10">
                  Agendar Consulta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AssetDetails;
