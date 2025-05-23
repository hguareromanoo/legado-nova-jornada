import { useState } from 'react'; // Removido se useState não for usado diretamente aqui
import { Upload, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Necessário para o botão de Upload
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CollapsibleProps as RadixCollapsibleProps } from '@radix-ui/react-collapsible';
import { DocumentRecommendation } from '@/types/chat'; // Importa o tipo completo
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client'; // Presumindo que ainda pode ser usado ou era de uma versão anterior

// NOVO: Define um tipo com apenas os campos DE FATO UTILIZADOS por DocumentUpload
// Revise esta lista cuidadosamente para garantir que todos os campos acessados de 'document'
// dentro deste componente (DocumentUpload.tsx) estejam incluídos.
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
  'reason'
  // Adicione outros campos de DocumentRecommendation se forem usados diretamente no JSX ou lógica deste arquivo.
  // Ex: 'category', 'is_mandatory' se você os usar aqui.
>;

interface DocumentUploadProps {
  document: DisplayDocument; // Use o novo tipo DisplayDocument
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'error';
  isExpanded: boolean;
  userId: string | undefined;
  onToggleExpand: (documentKey: string) => void;
  onStatusChange: (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => void;
}

const DocumentUpload = ({
  document,
  uploadStatus,
  isExpanded,
  userId,
  onToggleExpand,
  onStatusChange
}: DocumentUploadProps) => {
  const { toast } = useToast(); // useToast é chamado aqui

  // A lógica de upload foi movida para DocumentUploadService,
  // mas a função de gatilho handleDocumentUpload pode permanecer aqui
  // ou ser adaptada para chamar o serviço.
  // Por enquanto, vou manter uma estrutura similar à anterior,
  // presumindo que a chamada ao serviço será feita a partir daqui se necessário.

  const handleTriggerUpload = async (documentKey: string) => {
    try {
      if (!userId) {
        toast({ title: "Erro", description: "Usuário não autenticado.", variant: "destructive" });
        throw new Error('Usuário não autenticado');
      }
      if (!document.recommendation_id) {
        toast({ title: "Erro", description: "ID da recomendação ausente.", variant: "destructive" });
        throw new Error('ID da recomendação ausente');
      }

      const fileInput = window.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
      fileInput.multiple = false;
      
      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          // Aqui você chamaria o DocumentUploadService.uploadDocument
          // Exemplo (você precisará adaptar para passar a função toast e onProgress):
          onStatusChange(documentKey, 'uploading'); // Mudar status localmente
          try {
            // Supondo que DocumentUploadService está disponível ou você o importa
            // await DocumentUploadService.uploadDocument(file, documentKey, document.recommendation_id, userId, 
            //   (status) => onStatusChange(documentKey, status), 
            //   toast // passando a função toast de useToast
            // );
            // A lógica abaixo é um placeholder do que estava antes, ajuste para usar o serviço
            console.log("Placeholder: Chamaria DocumentUploadService.uploadDocument aqui", { file, documentKey, recommendationId: document.recommendation_id, userId });
            // Simulando sucesso para fins de UI por enquanto (REMOVA ISSO E USE O SERVIÇO)
            // Este bloco de try/catch interno seria para o resultado do serviço
            // Convert to base64
            const base64Data = await new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            const timestamp = new Date().toISOString();
            const { error: dbError } = await supabase.from('documents').insert({
              user_id: userId,
              recommendation_id: document.recommendation_id,
              bucket_name: 'database_storage',
              object_key: `${userId}/${documentKey}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
              file_name: file.name, file_type: file.type, file_size: file.size, file_data: base64Data,
              document_key: documentKey, created_at: timestamp, updated_at: timestamp
            });
            if (dbError) throw dbError;
            const { error: recError } = await supabase.from('document_recommendations').update({ sent: true, updated_at: timestamp }).eq('recommendation_id', document.recommendation_id);
            if (recError) throw recError;

            onStatusChange(documentKey, 'uploaded');
            toast({ title: "Sucesso (Simulado)", description: `${file.name} enviado.` });

          } catch (uploadError: any) {
            onStatusChange(documentKey, 'error');
            toast({ title: "Erro no Upload (Simulado)", description: uploadError.message, variant: "destructive" });
          }
        }
      };
      fileInput.click();
    } catch (error: any) {
      console.error('Erro ao preparar upload:', error);
      toast({
        title: "Erro de Preparação",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uploading': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleToggleOpenChange: RadixCollapsibleProps['onOpenChange'] = (_open) => {
    onToggleExpand(document.document_key);
  };

  return (
    <Card key={document.document_key} className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-4">
        {/* Esta é a linha ~146 onde o erro TS2589 ocorria neste arquivo */}
        <Collapsible 
          open={isExpanded} 
          onOpenChange={handleToggleOpenChange}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {getStatusIcon(uploadStatus)}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white truncate" title={document.name}>{document.name}</h4>
                  {/* A prop document.priority é garantida como number pelo Pick<...> se incluída */}
                  <Badge 
                    variant={document.priority >= 5 ? "destructive" : document.priority >= 4 ? "default" : "secondary"}
                    className="flex-shrink-0"
                  >
                    {'★'.repeat(document.priority)}{'☆'.repeat(Math.max(0, 5 - document.priority))}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300 truncate" title={document.description}>{document.description}</p>
                {document.item_description && (
                  <p className="text-sm text-blue-400 mt-1 truncate" title={document.item_description}>
                    <strong>Item específico:</strong> {document.item_description}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Button
                onClick={() => handleTriggerUpload(document.document_key)}
                disabled={uploadStatus === 'uploading'}
                variant={uploadStatus === 'uploaded' ? "outline" : "default"}
                size="sm"
              >
                {uploadStatus === 'uploaded' ? 'Enviado' :
                 uploadStatus === 'uploading' ? 'Enviando...' :
                 uploadStatus === 'error' ? 'Tentar Novamente' :
                 'Enviar'}
              </Button>
              
              {/* CollapsibleTrigger simplificado que resolveu o TS2589 neste arquivo */}
              <CollapsibleTrigger>
                <div className="p-1.5 rounded-md hover:bg-gray-700 cursor-pointer flex items-center justify-center w-9 h-9" aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}>
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </div>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {document.how_to_obtain && (
                <div>
                  <strong className="text-gray-300">Como obter:</strong>
                  <p className="text-gray-400 mt-1 whitespace-pre-wrap">{document.how_to_obtain}</p>
                </div>
              )}
              {document.processing_time && (
                <div>
                  <strong className="text-gray-300">Prazo:</strong>
                  <p className="text-gray-400 mt-1">{document.processing_time}</p>
                </div>
              )}
              {document.estimated_cost && (
                <div>
                  <strong className="text-gray-300">Custo estimado:</strong>
                  <p className="text-gray-400 mt-1">{document.estimated_cost}</p>
                </div>
              )}
              <div>
                <strong className="text-gray-300">ID da Recomendação:</strong>
                <p className="text-gray-400 mt-1 font-mono text-xs">{document.recommendation_id}</p>
              </div>
              <div>
                <strong className="text-gray-300">Chave do Documento:</strong>
                <p className="text-gray-400 mt-1 font-mono text-xs">{document.document_key}</p>
              </div>
            </div>
            {document.reason && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <strong className="text-blue-400">Por que é necessário:</strong>
                <p className="text-blue-300 mt-1 whitespace-pre-wrap">{document.reason}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;