
import { FileText, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentRecommendation } from '@/types/chat';
import DocumentUpload from './DocumentUpload';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CategoryDocumentsProps {
  category: string;
  documents: DocumentRecommendation[];
  uploadStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>;
  expandedCards: Set<string>;
  userId: string | undefined;
  user: SupabaseUser | null;
  onToggleCardExpansion: (cardId: string) => void;
  onStatusChange: (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => void;
}

const CategoryDocuments = ({
  category,
  documents,
  uploadStatus,
  expandedCards,
  userId,
  user,
  onToggleCardExpansion,
  onStatusChange
}: CategoryDocumentsProps) => {
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

  const categoryInfo = getCategoryInfo(category);
  const categoryUploaded = documents.filter(doc => uploadStatus[doc.document_key] === 'uploaded').length;

  return (
    <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <categoryInfo.icon className="w-6 h-6 text-w1-primary-accent" />
          <h3 className="text-xl font-semibold text-white">{categoryInfo.name}</h3>
        </div>
        <Badge variant="outline" className="text-gray-300">
          {categoryUploaded}/{documents.length}
        </Badge>
      </div>
      
      <div className="grid gap-4">
        {documents.map((doc) => (
          <DocumentUpload
            key={doc.document_key}
            document={doc}
            uploadStatus={uploadStatus[doc.document_key]}
            isExpanded={expandedCards.has(doc.document_key)}
            userId={userId}
            onToggleExpand={onToggleCardExpansion}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  );
};

export default CategoryDocuments;
