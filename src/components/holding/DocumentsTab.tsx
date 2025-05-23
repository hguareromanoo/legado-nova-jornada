import { useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DocumentRecommendationsResponse } from '@/types/chat';
import ProgressTracker from './ProgressTracker';
import CategoryDocuments from './CategoryDocuments';
import DocumentSummary from './DocumentSummary';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';

interface DocumentsTabProps {
  documentData: DocumentRecommendationsResponse;
  uploadStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>;
  expandedCards: Set<string>;
  uploadProgress: number;
  userId: string | undefined;
  onToggleCardExpansion: (cardId: string) => void;
  onStatusChange: (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => void;
}

const DocumentsTab = ({
  documentData,
  uploadStatus,
  expandedCards,
  uploadProgress,
  userId,
  onToggleCardExpansion,
  onStatusChange
}: DocumentsTabProps) => {
  const { user } = useUser();
  const uploadedCount = Object.values(uploadStatus).filter(status => status === 'uploaded').length;
  
  // Fetch already uploaded documents on mount from the new 'uploaded_documents' table
  useEffect(() => {
    const fetchUploadedDocuments = async () => {
      if (!userId) return;
      
      try {
        // Query 'uploaded_documents' to find which documents are already uploaded for this user
        const { data: uploadedDocs, error } = await supabase
          .from('uploaded_documents') // New table
          .select('document_key') // Assuming document_key exists in uploaded_documents for linking
          .eq('user_id', userId);
        
        if (error) {
          console.error('Error fetching uploaded documents from uploaded_documents table:', error);
          return;
        }
        
        // Update the upload status for documents that are already sent
        if (uploadedDocs && uploadedDocs.length > 0) {
          uploadedDocs.forEach(doc => {
            // Check if doc.document_key is not null before updating status
            if (doc.document_key) {
              onStatusChange(doc.document_key, 'uploaded');
            }
          });
          
          console.log(`✅ Found ${uploadedDocs.length} documents already uploaded`);
        }
      } catch (error) {
        console.error('Error checking uploaded documents:', error);
      }
    };
    
    fetchUploadedDocuments();
  }, [userId, onStatusChange]);
  
  // Group documents by category
  const groupDocumentsByCategory = (recommendations: DocumentRecommendationsResponse['recommendations']) => {
    const grouped: Record<string, typeof recommendations> = {};
    
    recommendations.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    
    return grouped;
  };

  const groupedDocuments = groupDocumentsByCategory(documentData.recommendations);

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Envio de Documentos</h1>
          <p className="text-gray-300">
            Olá, {documentData.metadata.client_name || 'Cliente'}! Envie os documentos necessários para sua holding.
          </p>
        </div>
        <SidebarTrigger />
      </header>

      {/* Progress Bar */}
      <ProgressTracker
        uploadProgress={uploadProgress}
        uploadedCount={uploadedCount}
        documentData={documentData}
        uploadStatus={uploadStatus}
      />

      {/* Documentos por Categoria */}
      <div className="space-y-6">
        {Object.entries(groupedDocuments).map(([category, docs]) => (
          <CategoryDocuments
            key={category}
            category={category}
            documents={docs}
            uploadStatus={uploadStatus}
            expandedCards={expandedCards}
            userId={userId}
            user={user}
            onToggleCardExpansion={onToggleCardExpansion}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
      
      {/* Resumo Final */}
      <DocumentSummary 
        documentData={documentData} 
        uploadedCount={uploadedCount} 
      />
    </div>
  );
};

export default DocumentsTab;