
import { Building2, BarChart2, FileDollar, Package2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Asset } from '@/pages/Assets';

interface AssetOverviewProps {
  assets: Asset[];
  onAssetSelect: (asset: Asset) => void;
}

const AssetOverview = ({ assets, onAssetSelect }: AssetOverviewProps) => {
  // Format currency in Brazilian Real
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAssetIcon = (type: Asset['type']) => {
    switch (type) {
      case 'imoveis':
        return <Building2 className="h-5 w-5 text-w1-primary-accent" />;
      case 'investimentos':
        return <BarChart2 className="h-5 w-5 text-w1-primary-accent" />;
      case 'participacoes':
        return <FileDollar className="h-5 w-5 text-w1-primary-accent" />;
      default:
        return <Package2 className="h-5 w-5 text-w1-primary-accent" />;
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

  const getCategoryLabel = (type: Asset['type']) => {
    switch (type) {
      case 'imoveis': return 'Imóvel';
      case 'investimentos': return 'Investimento';
      case 'participacoes': return 'Participação';
      case 'outros': return 'Outro';
      default: return 'Ativo';
    }
  };

  return (
    <div className="bg-w1-secondary-dark/30 rounded-xl border border-gray-700/30 overflow-hidden">
      {assets.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="text-left px-4 py-3 font-medium">Nome do Ativo</th>
                <th className="text-left px-4 py-3 font-medium">Categoria</th>
                <th className="text-right px-4 py-3 font-medium">Valor</th>
                <th className="text-right px-4 py-3 font-medium">Variação</th>
                <th className="text-right px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset) => (
                <tr key={asset.id} className="border-b border-gray-800 hover:bg-w1-secondary-dark/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <div className="bg-w1-primary-accent/20 p-2 rounded-lg mr-3">
                        {getAssetIcon(asset.type)}
                      </div>
                      <div>
                        <p className="font-medium">{asset.name}</p>
                        <p className="text-gray-400 text-xs">{getCategoryLabel(asset.type)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {asset.category}
                  </td>
                  <td className="px-4 py-4 text-right">{formatCurrency(asset.value)}</td>
                  <td className={`px-4 py-4 text-right ${asset.performance && asset.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.performance ? (asset.performance > 0 ? '+' : '') + asset.performance + '%' : '-'}
                  </td>
                  <td className="px-4 py-4 text-right">
                    {getStatusBadge(asset.status)}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <Button variant="ghost" size="sm" onClick={() => onAssetSelect(asset)} className="text-w1-primary-accent hover:text-w1-primary-accent-hover hover:bg-w1-primary-accent/10">
                      <Eye size={16} className="mr-1" />
                      Ver Detalhes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="bg-w1-primary-accent/20 p-3 rounded-full mx-auto mb-4 w-16 h-16 flex items-center justify-center">
            <PackageIcon className="h-8 w-8 text-w1-primary-accent" />
          </div>
          <h3 className="text-lg font-medium mb-2">Nenhum ativo encontrado</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Você ainda não tem ativos registrados na categoria selecionada. Adicione seu primeiro ativo para começar.
          </p>
          <Button 
            variant="w1Primary" 
            className="mx-auto"
          >
            <Plus size={16} className="mr-1" />
            Adicionar Ativo
          </Button>
        </div>
      )}
    </div>
  );
};

const PackageIcon = Package2;
const Plus = (props: any) => (
  <svg 
    {...props}
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export default AssetOverview;
