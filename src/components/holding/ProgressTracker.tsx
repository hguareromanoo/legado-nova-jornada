
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Building2, User } from 'lucide-react';
import { DocumentRecommendationsResponse } from '@/types/chat';

interface ProgressTrackerProps {
  uploadProgress: number;
  uploadedCount: number;
  documentData: DocumentRecommendationsResponse;
  uploadStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>;
}

const ProgressTracker = ({
  uploadProgress,
  uploadedCount,
  documentData,
  uploadStatus
}: ProgressTrackerProps) => {
  // Get category info (name and icon)
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      'pessoal': { name: '👤 Documentos Pessoais', icon: User },
      'familiar': { name: '👨‍👩‍👧‍👦 Documentos Familiares', icon: User },
      'imovel': { name: '🏠 Documentos de Imóveis', icon: Building2 },
      'empresa': { name: '🏢 Documentos de Empresas', icon: Building2 },
      'financeiro': { name: '💰 Documentos Financeiros', icon: FileText },
      'tributario': { name: '📊 Documentos Tributários', icon: FileText },
      'juridico': { name: '⚖️ Documentos Jurídicos', icon: FileText }
    };
    
    return categoryMap[category as keyof typeof categoryMap] || { 
      name: `📄 ${category.charAt(0).toUpperCase() + category.slice(1)}`, 
      icon: FileText 
    };
  };

  return (
    <div className="mb-8">
      <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Progresso do Envio</h3>
          <Badge className="bg-blue-600 text-white">
            {uploadedCount}/{documentData.total_documents} documentos
          </Badge>
        </div>
        
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>Documentos enviados:</span>
          <span>{Math.round(uploadProgress)}% completo</span>
        </div>
        <Progress 
          value={uploadProgress} 
          className="h-3 bg-gray-700" 
          indicatorClassName="bg-w1-primary-accent"
        />
        
        {/* Resumo por categoria */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {Object.entries(documentData.summary.by_category).map(([category, count]) => {
            const categoryInfo = getCategoryInfo(category);
            const categoryUploaded = documentData.recommendations
              .filter(doc => doc.category === category)
              .filter(doc => uploadStatus[doc.document_key] === 'uploaded').length;
            
            return (
              <div key={category} className="text-center">
                <div className="text-lg font-bold text-white">
                  {categoryUploaded}/{count}
                </div>
                <div className="text-xs text-gray-300">
                  {categoryInfo.name.replace(/^\p{Emoji}\s*/u, '')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
