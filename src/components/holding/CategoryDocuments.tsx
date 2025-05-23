
import { useEffect } from 'react';
import { FileText, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentRecommendation } from '@/types/chat';
import DocumentUpload from './DocumentUpload';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentRoadmap } from '@/types/document';

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

  // Initialize document roadmap entries for all documents in this category
  useEffect(() => {
    const initializeDocumentRoadmap = async () => {
      if (!userId || !documents.length) return;
      
      console.log(`Initializing document roadmap for ${documents.length} documents in ${category} category`);
      
      try {
        // Check which documents already exist in the roadmap
        const { data: existingEntries, error } = await supabase
          .from('document_roadmap')
          .select('document_key, recommendation_id')
          .eq('user_id', userId)
          .in('document_key', documents.map(doc => doc.document_key));
        
        if (error) {
          console.error('Error checking existing document roadmap entries:', error);
          return;
        }
        
        // Create a map for quick lookups
        const existingMap = new Map();
        if (existingEntries) {
          existingEntries.forEach(entry => {
            existingMap.set(entry.document_key, entry.recommendation_id);
          });
        }
        
        // Prepare batch insert for documents that don't exist in the roadmap
        const newEntries = documents
          .filter(doc => !existingMap.has(doc.document_key))
          .map(doc => {
            const recommendationId = doc.recommendation_id || uuidv4();
            
            return {
              recommendation_id: recommendationId,
              user_id: userId,
              document_key: doc.document_key,
              name: doc.name,
              description: doc.description,
              category: doc.category,
              priority: doc.priority,
              is_mandatory: doc.is_mandatory,
              item_description: doc.item_description || null,
              item_type: (doc as any).item_type || null,
              item_index: (doc as any).item_index || null,
              group_id: (doc as any).group_id || null,
              how_to_obtain: doc.how_to_obtain || null,
              processing_time: doc.processing_time || null,
              estimated_cost: doc.estimated_cost || null,
              reason: doc.reason || null,
              related_to: (doc as any).related_to || null,
              sent: false
            };
          });
        
        // Insert new entries if any
        if (newEntries.length > 0) {
          const { error: insertError } = await supabase
            .from('document_roadmap')
            .insert(newEntries);
            
          if (insertError) {
            console.error('Error creating document roadmap entries:', insertError);
          } else {
            console.log(`✅ Created ${newEntries.length} new document roadmap entries`);
          }
        }
        
        // Check document upload status using a separate query
        setTimeout(async () => {
          if (existingEntries && existingEntries.length > 0) {
            // Query which documents have been uploaded already
            const { data: uploadedDocs } = await supabase
              .from('documents')
              .select('document_key')
              .eq('user_id', userId)
              .in('document_key', documents.map(doc => doc.document_key));
            
            // Update local status for any documents that are already uploaded
            if (uploadedDocs && uploadedDocs.length > 0) {
              uploadedDocs.forEach(doc => {
                if (doc.document_key) {
                  onStatusChange(doc.document_key, 'uploaded');
                }
              });
            }
          }
        }, 0);
      } catch (error) {
        console.error('Error initializing document roadmap:', error);
      }
    };

    // Use setTimeout to avoid React state update loops
    setTimeout(() => {
      initializeDocumentRoadmap();
    }, 0);
  }, [userId, documents, category, onStatusChange]);

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
