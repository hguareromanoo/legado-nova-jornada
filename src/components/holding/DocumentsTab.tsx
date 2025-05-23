import React, { useEffect, useState, useCallback } from 'react'; // Adicionado useCallback
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DocumentRecommendationsResponse,
  DocumentRecommendation,
} from '@/types/chat';
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
  onStatusChange: (
    documentKey: string,
    status: 'pending' | 'uploading' | 'uploaded' | 'error',
  ) => void;
}

const DocumentsTab = ({
  documentData,
  uploadStatus,
  expandedCards,
  uploadProgress,
  userId,
  onToggleCardExpansion,
  onStatusChange,
}: DocumentsTabProps) => {
  const { user } = useUser();
  const uploadedCount = Object.values(uploadStatus).filter(
    (status) => status === 'uploaded',
  ).length;

  // Estado para armazenar os documentos após a inicialização do roadmap por categoria
  const [
    initializedDocumentsByCategory,
    setInitializedDocumentsByCategory,
  ] = useState<Record<string, DocumentRecommendation[]>>({});

  // Callback para ser chamada por CategoryDocuments quando o roadmap da categoria for inicializado
  const handleRoadmapInitialized = useCallback(
    (initializedDocs: DocumentRecommendation[], category: string) => {
      setInitializedDocumentsByCategory((prevMap) => ({
        ...prevMap,
        [category]: initializedDocs,
      }));
      console.log(
        `[DocumentsTab] Roadmap inicializado/atualizado para categoria: ${category}`,
        initializedDocs,
      );
    },
    [],
  ); // Sem dependências, pois a função em si não muda

  useEffect(() => {
    const fetchUploadedDocuments = async () => {
      if (!userId) return;

      try {
        const { data: sentDocuments, error } = await supabase
          .from('document_roadmap')
          .select('document_key')
          .eq('user_id', userId)
          .eq('sent', true);

        if (error) {
          console.error('Error fetching uploaded documents:', error);
          return;
        }

        if (sentDocuments && sentDocuments.length > 0) {
          sentDocuments.forEach((doc) => {
            if (doc.document_key) {
              onStatusChange(doc.document_key, 'uploaded');
            }
          });
          console.log(
            `✅ Found ${sentDocuments.length} documents already uploaded`,
          );
        }
      } catch (error) {
        console.error('Error checking uploaded documents:', error);
      }
    };

    fetchUploadedDocuments();
  }, [userId, onStatusChange]);

  const groupDocumentsByCategory = (
    recommendations: DocumentRecommendation[],
  ) => {
    const grouped: Record<string, DocumentRecommendation[]> = {};
    recommendations.forEach((doc) => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    return grouped;
  };

  const groupedInitialDocuments = groupDocumentsByCategory(
    documentData.recommendations,
  );

  return (
    <div className="p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Envio de Documentos</h1>
          <p className="text-gray-300">
            Olá, {documentData.metadata.client_name || 'Cliente'}! Envie os
            documentos necessários para sua holding.
          </p>
        </div>
        <SidebarTrigger />
      </header>

      <ProgressTracker
        uploadProgress={uploadProgress}
        uploadedCount={uploadedCount}
        documentData={documentData}
        uploadStatus={uploadStatus}
      />

      <div className="space-y-6">
        {Object.entries(groupedInitialDocuments).map(([category, docs]) => (
          <CategoryDocuments
            key={category}
            category={category}
            documents={initializedDocumentsByCategory[category] || docs} // Usa docs inicializados se disponíveis
            uploadStatus={uploadStatus}
            expandedCards={expandedCards}
            userId={userId}
            user={user}
            onToggleCardExpansion={onToggleCardExpansion}
            onStatusChange={onStatusChange}
            onRoadmapInitialized={handleRoadmapInitialized} // Prop adicionada
          />
        ))}
      </div>

      <DocumentSummary
        documentData={documentData}
        uploadedCount={uploadedCount}
      />
    </div>
  );
};

export default DocumentsTab;