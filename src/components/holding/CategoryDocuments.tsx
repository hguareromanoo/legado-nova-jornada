import React, { useEffect, useState, useCallback } from 'react';
import { FileText, Building2, User as UserIcon } from 'lucide-react'; // Renomeado User para UserIcon para evitar conflito
import { Badge } from '@/components/ui/badge';
import DocumentUpload, {
  DisplayDocument, // Importando o tipo diretamente se ele for exportado de DocumentUpload
} from './DocumentUpload'; // Verifique se DisplayDocument é exportado ou defina-o aqui
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { DocumentRecommendation } from '@/types/chat';
import { User as SupabaseUser } from '@supabase/supabase-js';

// Se DisplayDocument não for exportado de DocumentUpload, defina-o aqui ou importe de onde estiver definido.
// Exemplo, caso DisplayDocument seja uma simplificação de DocumentRecommendation:
/*
type DisplayDocument = Pick<DocumentRecommendation,
  'name' |
  'document_key' |
  'recommendation_id' |
  'description' |
  'priority' |
  'item_description' |
  'how_to_obtain' |
  'processing_time' |
  'estimated_cost' |
  'reason' |
  'category' |
  'is_mandatory' // Adicione outros campos conforme necessário
>;
*/

interface CategoryDocumentsProps {
  category: string;
  documents: DocumentRecommendation[]; // Usando o tipo completo, pois ele é usado para criar entradas no roadmap
  uploadStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>;
  expandedCards: Set<string>;
  userId: string | undefined;
  user: SupabaseUser | null; // Adicionado para consistência, embora não usado diretamente neste componente refatorado
  onToggleCardExpansion: (documentKey: string) => void;
  onStatusChange: (
    documentKey: string,
    status: 'pending' | 'uploading' | 'uploaded' | 'error',
  ) => void;
  // Nova prop para passar documentos com recommendation_id estáveis para DocumentUpload
  onRoadmapInitialized: (
    initializedDocs: DocumentRecommendation[],
    category: string,
  ) => void;
}

const CategoryDocuments = ({
  category,
  documents: initialDocuments, // Renomeado para evitar confusão com o estado interno
  uploadStatus,
  expandedCards,
  userId,
  // user prop não é usado diretamente aqui, mas pode ser mantido se houver planos futuros
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

  // Mapeamento de ícones e nomes de categoria
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

  // Efeito para inicializar e sincronizar entradas do document_roadmap
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
      console.log(
        `[${category}] Iniciando inicialização/sincronização do roadmap para ${initialDocuments.length} documentos.`,
      );

      try {
        // 1. Buscar entradas existentes no roadmap para este usuário e chaves de documento
        const documentKeys = initialDocuments.map((doc) => doc.document_key);
        const { data: existingEntries, error: fetchError } = await supabase
          .from('document_roadmap')
          .select('document_key, recommendation_id, sent') // Incluir 'sent'
          .eq('user_id', userId)
          .in('document_key', documentKeys);

        if (fetchError) {
          console.error(
            `[${category}] Erro ao buscar entradas existentes no roadmap:`,
            fetchError,
          );
          // Mesmo com erro, tentamos processar com o que temos ou com os documentos iniciais
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
        console.log(
          `[${category}] Encontradas ${existingMap.size} entradas existentes no roadmap.`,
        );

        // 2. Determinar quais documentos precisam ser criados no roadmap
        const newRoadmapEntriesToCreate: any[] = []; // Use 'any' temporariamente ou defina um tipo específico para inserção
        const docsForStateUpdate = initialDocuments.map((doc) => {
          const existingEntry = existingMap.get(doc.document_key);
          if (existingEntry) {
            // Documento já existe no roadmap, usar o recommendation_id existente
            // Atualizar o status local 'uploaded' se 'sent' for true no banco de dados
            if (
              existingEntry.sent &&
              uploadStatus[doc.document_key] !== 'uploaded'
            ) {
              onStatusChange(doc.document_key, 'uploaded');
            }
            return { ...doc, recommendation_id: existingEntry.recommendation_id };
          } else {
            // Documento não existe, preparar para criação
            // Usar recommendation_id do `doc` se existir (vindo da API de recomendações), senão gerar novo
            const newRecommendationId = doc.recommendation_id || uuidv4();
            newRoadmapEntriesToCreate.push({
              // Certifique-se de que todos os campos obrigatórios da tabela 'document_roadmap' estão aqui
              recommendation_id: newRecommendationId,
              user_id: userId,
              document_key: doc.document_key,
              name: doc.name,
              description: doc.description,
              category: doc.category, // Já é parte de DocumentRecommendation
              priority: doc.priority, // Já é parte de DocumentRecommendation
              is_mandatory: doc.is_mandatory, // Já é parte de DocumentRecommendation
              item_description: doc.item_description || null,
              item_type: (doc as any).item_type || null,
              item_index: (doc as any).item_index || null,
              group_id: (doc as any).group_id || null,
              how_to_obtain: doc.how_to_obtain || null,
              processing_time: doc.processing_time || null,
              estimated_cost: doc.estimated_cost || null,
              reason: doc.reason || null,
              related_to: (doc as any).related_to || null,
              sent: false, // Novos registros são marcados como não enviados
              // Adicione created_at e updated_at se o banco não os gerar automaticamente
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            return { ...doc, recommendation_id: newRecommendationId };
          }
        });

        // 3. Inserir novas entradas no Supabase, se houver
        if (newRoadmapEntriesToCreate.length > 0) {
          console.log(
            `[${category}] Criando ${newRoadmapEntriesToCreate.length} novas entradas no roadmap.`,
          );
          const { error: insertError } = await supabase
            .from('document_roadmap')
            .insert(newRoadmapEntriesToCreate);

          if (insertError) {
            console.error(
              `[${category}] Erro ao inserir novas entradas no roadmap:`,
              insertError,
            );
            // Em caso de erro na inserção, é importante decidir como tratar.
            // Poderia tentar usar os recommendation_ids gerados localmente
            // ou sinalizar um erro mais sério.
          } else {
            console.log(
              `[${category}] Novas entradas do roadmap criadas com sucesso.`,
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
        setProcessedDocuments(initialDocuments); // Fallback para os documentos iniciais
        onRoadmapInitialized(initialDocuments, category);
      } finally {
        setIsInitializing(false);
      }
    };

    // O uso de setTimeout(0) foi removido. A estabilidade das props `initialDocuments` e `userId`
    // (especialmente `initialDocuments` sendo memoizada no pai) é crucial.
    initializeAndSyncRoadmap();

    // A dependência `onRoadmapInitialized` e `onStatusChange` devem ser estáveis (useCallback no pai).
    // `initialDocuments` deve ser uma referência estável (useMemo no pai).
  }, [
    userId,
    initialDocuments,
    category,
    onStatusChange,
    onRoadmapInitialized,
  ]); // Adicionar uploadStatus aqui pode ser problemático se ele mudar frequentemente.

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
        {processedDocuments.map((doc) => (
          <DocumentUpload
            key={doc.document_key} // Usar document_key que deve ser único por tipo de documento
            document={{
              // Mapear para DisplayDocument, garantindo que recommendation_id está presente
              name: doc.name,
              document_key: doc.document_key,
              recommendation_id:
                doc.recommendation_id || 'ID_PENDENTE_INICIALIZACAO', // Fallback importante
              description: doc.description,
              priority: doc.priority,
              item_description: doc.item_description,
              how_to_obtain: doc.how_to_obtain,
              processing_time: doc.processing_time,
              estimated_cost: doc.estimated_cost,
              reason: doc.reason,
              category: doc.category,
              is_mandatory: doc.is_mandatory,
            }}
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