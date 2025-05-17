
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  BarChart2, 
  Home, 
  PlusCircle, 
  Filter, 
  ArrowUpDown 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Asset {
  id: string;
  name: string;
  type: 'property' | 'investment' | 'company' | 'other';
  value: number;
  growth: number;
  details?: Record<string, any>;
}

const Assets = () => {
  const { toast } = useToast();
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: 'asset-1',
      name: 'Apartamento São Paulo',
      type: 'property',
      value: 950000,
      growth: 4.2,
      details: {
        address: 'Av. Paulista, 1000, São Paulo - SP',
        size: '120m²',
        acquisition: '2020-03-15'
      }
    },
    {
      id: 'asset-2',
      name: 'Ações PETR4',
      type: 'investment',
      value: 75000,
      growth: -2.5,
      details: {
        quantity: 5000,
        broker: 'XP Investimentos',
        acquisition: '2021-06-10'
      }
    },
    {
      id: 'asset-3',
      name: 'Empresa de Tecnologia',
      type: 'company',
      value: 2500000,
      growth: 15.8,
      details: {
        ownership: '60%',
        sector: 'Technology',
        founded: '2018-01-01'
      }
    }
  ]);
  
  const [filter, setFilter] = useState<'all' | 'property' | 'investment' | 'company' | 'other'>('all');
  
  // Format currency in Brazilian Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const totalAssetValue = assets.reduce((total, asset) => total + asset.value, 0);
  
  const filteredAssets = filter === 'all' 
    ? assets 
    : assets.filter(asset => asset.type === filter);
  
  const handleAddAsset = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A adição de ativos estará disponível em breve.",
    });
  };
  
  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'property':
        return <Home className="h-5 w-5 text-blue-500" />;
      case 'investment':
        return <BarChart2 className="h-5 w-5 text-green-500" />;
      case 'company':
        return <Building2 className="h-5 w-5 text-purple-500" />;
      default:
        return <PlusCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciamento de Ativos</h1>
        <p className="text-gray-400">
          Visualize e gerencie todos os ativos da sua holding familiar.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-900/20 border-blue-800/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-normal text-gray-400">Valor Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalAssetValue)}</div>
            <p className="text-sm text-gray-400 mt-2">{assets.length} ativos registrados</p>
          </CardContent>
        </Card>
        
        {['property', 'investment', 'company'].map((type) => {
          const typeAssets = assets.filter(asset => asset.type === type);
          const typeTotal = typeAssets.reduce((sum, asset) => sum + asset.value, 0);
          const percentage = totalAssetValue > 0 ? (typeTotal / totalAssetValue) * 100 : 0;
          
          let title = '';
          switch(type) {
            case 'property': title = 'Imóveis'; break;
            case 'investment': title = 'Investimentos'; break;
            case 'company': title = 'Empresas'; break;
          }
          
          return (
            <Card key={type} className="bg-gray-800/30 border-gray-700/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-normal text-gray-400">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(typeTotal)}</div>
                <p className="text-sm text-gray-400 mt-2">
                  {typeAssets.length} item(s) • {percentage.toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'all' ? 'bg-gray-700' : ''}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'property' ? 'bg-gray-700' : ''}
            onClick={() => setFilter('property')}
          >
            <Home className="mr-2 h-4 w-4" />
            Imóveis
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'investment' ? 'bg-gray-700' : ''}
            onClick={() => setFilter('investment')}
          >
            <BarChart2 className="mr-2 h-4 w-4" />
            Investimentos
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className={filter === 'company' ? 'bg-gray-700' : ''}
            onClick={() => setFilter('company')}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Empresas
          </Button>
        </div>
        
        <Button onClick={handleAddAsset} className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Ativo
        </Button>
      </div>
      
      <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left px-4 py-3 font-medium">Nome do Ativo</th>
                <th className="text-left px-4 py-3 font-medium">Tipo</th>
                <th className="text-right px-4 py-3 font-medium">Valor</th>
                <th className="text-right px-4 py-3 font-medium">Variação</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.length > 0 ? (
                filteredAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-gray-800">
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                          {getAssetIcon(asset.type)}
                        </div>
                        <div>
                          <p className="font-medium">{asset.name}</p>
                          <p className="text-gray-400 text-xs">
                            {asset.type === 'property' ? 'Imóvel' : 
                             asset.type === 'investment' ? 'Investimento' : 
                             asset.type === 'company' ? 'Empresa' : 'Outro'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-300">
                      {asset.type === 'property' && asset.details?.address ? (
                        <span>{asset.details.address}</span>
                      ) : asset.type === 'investment' && asset.details?.broker ? (
                        <span>{asset.details.broker}</span>
                      ) : asset.type === 'company' && asset.details?.sector ? (
                        <span>{asset.details.sector}</span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">{formatCurrency(asset.value)}</td>
                    <td className={`px-4 py-4 text-right ${asset.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {asset.growth >= 0 ? '+' : ''}{asset.growth}%
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button variant="ghost" size="sm">
                        Ver Detalhes
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                    Nenhum ativo encontrado. Adicione seu primeiro ativo para começar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Assets;
