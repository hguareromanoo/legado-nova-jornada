import { useEffect } from 'react';
import { FileText, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentRecommendation } from '@/types/chat';
import DocumentUpload from './DocumentUpload';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentRoadmap } from '@/types/document'; // Assuming this type is consistent with the database roadmap

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
  // This ensures a record exists in 'document_roadmap' for every recommended document.
  useEffect(() => {
    const initializeDocumentRoadmap = async () => {
      if (!userId || !documents.length) return;
      
      console.log(`Initializing document roadmap for ${documents.length} documents in ${category} category`);
      
      try {
        // 1. Check which documents already exist in the 'document_roadmap' table
        const { data: existingEntries, error } = await supabase
          .from('document_roadmap')
          .select('document_key, recommendation_id, sent') // Also fetch 'sent' status
          .eq('user_id', userId)
          .in('document_key', documents.map(doc => doc.document_key));
        
        if (error) {
          console.error('Error checking existing document roadmap entries:', error);
          return;
        }
        
        // Create a map for quick lookups of existing entries and their 'sent' status
        const existingMap = new Map();
        if (existingEntries) {
          existingEntries.forEach(entry => {
            existingMap.set(entry.document_key, {
              recommendation_id: entry.recommendation_id,
              sent: entry.sent
            });
          });
        }
        
        // Prepare batch insert for documents that don't exist in the roadmap
        const newEntries = documents
          .filter(doc => !existingMap.has(doc.document_key))
          .map(doc => {
            // Use the recommendation_id from the DocumentRecommendation type if available, otherwise generate a new UUID
            const recommendationId = doc.id || uuidv4(); 
            
            return {
              recommendation_id: recommendationId, // This is now the 'id' from DocumentRecommendation
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
              sent: false // Initially not sent
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
        
        // 2. Check document upload status from 'uploaded_documents' table 
        // and update local state to reflect already uploaded documents
        const { data: uploadedDocs, error: uploadedDocsError } = await supabase
          .from('uploaded_documents') // Query the new uploaded_documents table
          .select('document_key') // Select the document_key
          .eq('user_id', userId)
          .in('recommendation_id', documents.map(doc => doc.id)); // Link to the recommendation ID

        if (uploadedDocsError) {
          console.error('Error fetching uploaded documents from uploaded_documents:', uploadedDocsError);
          return;
        }

        if (uploadedDocs && uploadedDocs.length > 0) {
            uploadedDocs.forEach(uploadedDoc => {
                // Find the corresponding document in the current list by document_key
                const matchingDoc = documents.find(d => d.document_key === uploadedDoc.document_key);
                if (matchingDoc) {
                    onStatusChange(matchingDoc.document_key, 'uploaded');
                }
            });
        }

        // Also update the status for documents already marked as 'sent' in document_roadmap
        // to ensure consistency if the uploaded_documents table isn't the only source of truth for 'sent' status
        if (existingEntries && existingEntries.length > 0) {
            existingEntries.forEach(entry => {
                if (entry.sent && existingMap.has(entry.document_key)) {
                    onStatusChange(entry.document_key, 'uploaded');
                }
            });
        }

      } catch (error) {
        console.error('Error initializing document roadmap or checking uploads:', error);
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