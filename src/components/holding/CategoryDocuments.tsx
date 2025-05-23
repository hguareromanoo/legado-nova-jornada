import { useEffect } from 'react';
import { FileText, Building2, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DocumentRecommendation } from '@/types/chat'; // Using the updated type
import DocumentUpload from './DocumentUpload';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { Tables } from '@/integrations/supabase/types'; // Import Tables type

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
        const { data: existingRoadmapEntries, error: roadmapError } = await supabase
          .from('document_roadmap')
          .select('document_key, recommendation_id, sent')
          .eq('user_id', userId)
          .in('document_key', documents.map(doc => doc.document_key));
        
        if (roadmapError) {
          console.error('Error checking existing document roadmap entries:', roadmapError);
          return;
        }
        
        // Create a map for quick lookups of existing entries and their 'sent' status
        const existingRoadmapMap = new Map();
        if (existingRoadmapEntries) {
          existingRoadmapEntries.forEach(entry => {
            existingRoadmapMap.set(entry.document_key, {
              recommendation_id: entry.recommendation_id,
              sent: entry.sent
            });
          });
        }
        
        // Prepare batch insert for documents that don't exist in the roadmap
        const newRoadmapEntries = documents
          .filter(doc => !existingRoadmapMap.has(doc.document_key))
          .map(doc => {
            // Use the recommendation_id from the DocumentRecommendation type if available, otherwise generate a new UUID
            const recommendationId = doc.recommendation_id || uuidv4(); 
            
            return {
              recommendation_id: recommendationId, // This is now the 'recommendation_id' from DocumentRecommendation
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
        
        // Insert new entries into 'document_roadmap' if any
        if (newRoadmapEntries.length > 0) {
          const { error: insertError } = await supabase
            .from('document_roadmap')
            .insert(newRoadmapEntries);
            
          if (insertError) {
            console.error('Error creating document roadmap entries:', insertError);
          } else {
            console.log(`✅ Created ${newRoadmapEntries.length} new document roadmap entries`);
          }
        }
        
        // 2. Check document upload status from 'documents' table 
        // and update local state to reflect already uploaded documents
        const { data: uploadedFiles, error: uploadedFilesError } = await supabase
          .from('documents') // Query the 'documents' table
          .select('document_key') // Select the document_key
          .eq('user_id', userId)
          .in('recommendation_id', documents.map(doc => doc.recommendation_id)); // Link to the recommendation ID

        if (uploadedFilesError) {
          console.error('Error fetching uploaded documents from "documents" table:', uploadedFilesError);
          return;
        }

        if (uploadedFiles && uploadedFiles.length > 0) {
            uploadedFiles.forEach((file: Tables<'documents'>) => {
                // Find the corresponding document in the current list by document_key
                const matchingDoc = documents.find(d => d.document_key === file.document_key);
                if (matchingDoc) {
                    onStatusChange(matchingDoc.document_key, 'uploaded');
                }
            });
        }
        
        // Ensure local uploadStatus is also updated for entries already marked as 'sent' in document_roadmap
        // This is a redundant check but ensures robustness if one table gets out of sync
        if (existingRoadmapEntries && existingRoadmapEntries.length > 0) {
            existingRoadmapEntries.forEach(entry => {
                if (entry.sent) {
                    const matchingDoc = documents.find(d => d.document_key === entry.document_key);
                    if (matchingDoc) {
                        onStatusChange(matchingDoc.document_key, 'uploaded');
                    }
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