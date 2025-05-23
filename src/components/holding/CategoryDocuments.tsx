import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Building2, User as UserIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// Importação corrigida para DisplayDocument e DocumentUpload
import DocumentUpload, { DisplayDocument } from './DocumentUpload';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentRecommendation } from '@/types/chat';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface CategoryDocumentsProps {
  category: string;
  documents: DocumentRecommendation[];
  uploadStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>;
  expandedCards: Set<string>;
  userId: string | undefined;
  user: SupabaseUser | null;
  onToggleCardExpansion: (documentKey: string) => void;
  onStatusChange: (
    documentKey: string,
    status: 'pending' | 'uploading' | 'uploaded' | 'error',
  ) => void;
  onRoadmapInitialized: (
    initializedDocs: DocumentRecommendation[],
    category: string,
  ) => void;
}

const CategoryDocuments = ({
  category,
  documents: initialDocuments,
  uploadStatus,
  expandedCards,
  userId,
  onToggleCardExpansion,
  onStatusChange,
  onRoadmapInitialized,
}: CategoryDocumentsProps) => {
  const [
    processedDocuments,
    setProcessedDocuments,
  ] = useState<DocumentRecommendation[]>([]);
  const [
    isInitializing,
    setIsInitializing,
  ] = useState<boolean>(true);

  const getCategoryInfo = useCallback((categoryKey: string) => {
    const categoryMap = {
      pessoal: { name: '👤 Documentos Pessoais', icon: UserIcon },
      familiar: { name: '👨‍👩‍👧‍👦 Documentos Familiares', icon: UserIcon },
      imovel: { name: '🏠 Documentos de Imóveis', icon: Building2 },
      empresa: { name: '🏢 Documentos de Empresas', icon: Building2 },
      financeiro: { name: '💰 Documentos Financeiros', icon: FileText },
      tributario: { name: '📊 Documentos Tributários', icon: FileText },
      juridico: { name: '⚖️ Documentos Jurídicos', icon: FileText },
    };
    return (
      categoryMap[categoryKey as keyof typeof categoryMap] || {
        name: `📄 ${
          categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
        }`,
        icon: FileText,
      }
    );
  }, []);

  const categoryInfo = getCategoryInfo(category);

  useEffect(() => {
    const initializeAndSyncRoadmap = async () => {
      if (!userId || !initialDocuments || initialDocuments.length === 0) {
        setProcessedDocuments(initialDocuments || []);
        setIsInitializing(false);
        if (initialDocuments) {
          onRoadmapInitialized(initialDocuments, category);
        }
        return;
      }

      setIsInitializing(true);

      try {
        const documentKeys = initialDocuments.map((doc) => doc.document_key);
        const { data: existingEntries, error: fetchError } = await supabase
          .from('document_roadmap')
          .select('document_key, recommendation_id, sent')
          .eq('user_id', userId)
          .in('document_key', documentKeys);

        if (fetchError) {
          console.error(
            `[${category}] Erro ao buscar entradas existentes no roadmap:`,
            fetchError,
          );
          setProcessedDocuments(initialDocuments);
          onRoadmapInitialized(initialDocuments, category);
          setIsInitializing(false);
          return;
        }

        const existingMap = new Map<
          string,
          { recommendation_id: string; sent: boolean | null }
        >();
        if (existingEntries) {
          existingEntries.forEach((entry) => {
            if (entry.document_key && entry.recommendation_id) {
              existingMap.set(entry.document_key, {
                recommendation_id: entry.recommendation_id,
                sent: entry.sent,
              });
            }
          });
        }

        const newRoadmapEntriesToCreate: any[] = [];
        const docsForStateUpdate = initialDocuments.map((doc) => {
          const existingEntry = existingMap.get(doc.document_key);
          if (existingEntry) {
            if (
              existingEntry.sent &&
              uploadStatus[doc.document_key] !== 'uploaded'
            ) {
              onStatusChange(doc.document_key, 'uploaded');
            }
            return { ...doc, recommendation_id: existingEntry.recommendation_id };
          } else {
            const newRecommendationId = doc.recommendation_id || uuidv4();
            newRoadmapEntriesToCreate.push({
              recommendation_id: newRecommendationId,
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
              sent: false,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            return { ...doc, recommendation_id: newRecommendationId };
          }
        });

        if (newRoadmapEntriesToCreate.length > 0) {
          const { error: insertError } = await supabase
            .from('document_roadmap')
            .insert(newRoadmapEntriesToCreate);

          if (insertError) {
            console.error(
              `[${category}] Erro ao inserir novas entradas no roadmap:`,
              insertError,
            );
          }
        }
        setProcessedDocuments(docsForStateUpdate);
        onRoadmapInitialized(docsForStateUpdate, category);
      } catch (error) {
        console.error(
          `[${category}] Erro inesperado durante a inicialização do roadmap:`,
          error,
        );
        setProcessedDocuments(initialDocuments);
        onRoadmapInitialized(initialDocuments, category);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAndSyncRoadmap();
  }, [
    userId,
    initialDocuments,
    category,
    onStatusChange,
    onRoadmapInitialized,
    uploadStatus, // Adicionado para re-avaliar status 'sent' se uploadStatus mudar externamente
  ]);

  const categoryUploadedCount = processedDocuments.filter(
    (doc) => uploadStatus[doc.document_key] === 'uploaded',
  ).length;

  if (isInitializing) {
    return (
      <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <categoryInfo.icon className="w-6 h-6 text-w1-primary-accent" />
            <h3 className="text-xl font-semibold text-white">
              {categoryInfo.name}
            </h3>
          </div>
          <Badge variant="outline" className="text-gray-300">
            Carregando...
          </Badge>
        </div>
        <div className="text-center py-4 text-gray-400">
          Inicializando documentos...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <categoryInfo.icon className="w-6 h-6 text-w1-primary-accent" />
          <h3 className="text-xl font-semibold text-white">
            {categoryInfo.name}
          </h3>
        </div>
        <Badge variant="outline" className="text-gray-300">
          {categoryUploadedCount}/{processedDocuments.length}
        </Badge>
      </div>

      <div className="grid gap-4">
        {processedDocuments.map((doc) => {
          // Criar o objeto DisplayDocument corretamente
          const displayDoc: DisplayDocument = {
            name: doc.name,
            document_key: doc.document_key,
            recommendation_id:
              doc.recommendation_id || 'ID_PENDENTE_INICIALIZACAO',
            description: doc.description,
            priority: doc.priority,
            item_description: doc.item_description,
            how_to_obtain: doc.how_to_obtain,
            processing_time: doc.processing_time,
            estimated_cost: doc.estimated_cost,
            reason: doc.reason,
            category: doc.category,
            is_mandatory: doc.is_mandatory, // Agora 'is_mandatory' faz parte de DisplayDocument
          };
          return (
            <DocumentUpload
              key={doc.document_key}
              document={displayDoc} // Passar o objeto 'displayDoc' que corresponde a DisplayDocument
              uploadStatus={uploadStatus[doc.document_key]}
              isExpanded={expandedCards.has(doc.document_key)}
              userId={userId}
              onToggleExpand={onToggleCardExpansion}
              onStatusChange={onStatusChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default CategoryDocuments;