
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Building2, 
  BarChart2, 
  Users, 
  Package 
} from 'lucide-react';
import type { Asset } from '@/pages/Assets';

interface AssetOverviewProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
}

const AssetOverview: React.FC<AssetOverviewProps> = ({ assets, onAssetSelect }) => {
  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'imoveis':
        return <Building2 size={16} className="text-blue-400" />;
      case 'investimentos':
        return <BarChart2 size={16} className="text-purple-400" />;
      case 'participacoes':
        return <Users size={16} className="text-green-400" />;
      case 'outros':
        return <Package size={16} className="text-amber-400" />;
      default:
        return <Building2 size={16} className="text-blue-400" />;
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ativo':
        return <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full text-xs">Ativo</span>;
      case 'Pendente':
        return <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full text-xs">Pendente</span>;
      case 'Alugado':
        return <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">Alugado</span>;
      default:
        return <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatPerformance = (value: number | undefined) => {
    if (value === undefined) return '-';
    const formattedValue = value.toFixed(1);
    const isPositive = value >= 0;
    
    return (
      <span className={isPositive ? "text-green-400" : "text-red-400"}>
        {isPositive ? '+' : ''}{formattedValue}%
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-gray-800/30">
          <TableRow className="text-gray-400 border-b border-gray-800">
            <TableHead className="text-left px-4 py-3 font-medium">Nome do Ativo</TableHead>
            <TableHead className="text-left px-4 py-3 font-medium">Categoria</TableHead>
            <TableHead className="text-right px-4 py-3 font-medium">Valor</TableHead>
            <TableHead className="text-right px-4 py-3 font-medium">Variação</TableHead>
            <TableHead className="text-right px-4 py-3 font-medium">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assets.map((asset) => (
            <TableRow 
              key={asset.id} 
              className="border-b border-gray-800 hover:bg-gray-800/30 cursor-pointer"
              onClick={() => onAssetSelect(asset)}
            >
              <TableCell className="px-4 py-4">
                <div className="flex items-center">
                  <div className={`${getIconBgColor(asset.type)} p-2 rounded-lg mr-3`}>
                    {getAssetIcon(asset.type)}
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-gray-400 text-xs">
                      {asset.address ? asset.address.split(',')[0] : 
                       asset.ticker ? asset.ticker :
                       asset.companyName ? asset.companyName : 
                       asset.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="px-4 py-4 text-gray-300">{asset.category}</TableCell>
              <TableCell className="px-4 py-4 text-right">{formatCurrency(asset.value)}</TableCell>
              <TableCell className="px-4 py-4 text-right">{formatPerformance(asset.performance)}</TableCell>
              <TableCell className="px-4 py-4 text-right">
                {asset.status && getStatusBadge(asset.status)}
              </TableCell>
            </TableRow>
          ))}
          {assets.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                Nenhum ativo encontrado para esta categoria.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AssetOverview;
