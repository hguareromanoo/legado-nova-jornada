import React from 'react'; // Removido useState não utilizado
import {
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { CollapsibleProps as RadixCollapsibleProps } from '@radix-ui/react-collapsible';
import { DocumentRecommendation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploadService } from '@/services/DocumentUploadService';

// EXPORTADO o tipo DisplayDocument e ADICIONADO is_mandatory
export type DisplayDocument = Pick<
  DocumentRecommendation,
  | 'name'
  | 'document_key'
  | 'recommendation_id'
  | 'description'
  | 'priority'
  | 'item_description'
  | 'how_to_obtain'
  | 'processing_time'
  | 'estimated_cost'
  | 'reason'
  | 'category'
  | 'is_mandatory' // Campo adicionado para resolver o erro TS2353
>;

interface DocumentUploadProps {
  document: DisplayDocument;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'error';
  isExpanded: boolean;
  userId: string | undefined;
  onToggleExpand: (documentKey: string) => void;
  onStatusChange: (
    documentKey: string,
    status: 'pending' | 'uploading' | 'uploaded' | 'error',
  ) => void;
}

const DocumentUpload = ({
  document,
  uploadStatus,
  isExpanded,
  userId,
  onToggleExpand,
  onStatusChange,
}: DocumentUploadProps) => {
  const { toast } = useToast();

  const handleInitiateUpload = async () => {
    try {
      if (!userId) {
        toast({
          title: 'Erro de Autenticação',
          description: 'Usuário não autenticado para fazer upload.',
          variant: 'destructive',
        });
        return;
      }
      if (!document.recommendation_id) {
        toast({
          title: 'Erro de Configuração',
          description:
            'ID da recomendação ausente para este documento. Verifique a inicialização dos dados.',
          variant: 'destructive',
        });
        onStatusChange(document.document_key, 'error');
        return;
      }
      if (!document.document_key) {
        toast({
          title: 'Erro de Configuração',
          description: 'Chave do documento ausente.',
          variant: 'destructive',
        });
        onStatusChange(document.document_key, 'error');
        return;
      }

      const fileInput = window.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
      fileInput.multiple = false;

      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          await DocumentUploadService.uploadDocument(
            file,
            document.document_key,
            document.recommendation_id,
            userId,
            (statusUpdate) =>
              onStatusChange(document.document_key, statusUpdate),
            toast,
          );
        }
      };
      fileInput.click();
    } catch (error: any) {
      console.error('Erro ao iniciar o processo de upload:', error);
      toast({
        title: 'Erro ao Preparar Upload',
        description: `Não foi possível iniciar o upload: ${error.message}`,
        variant: 'destructive',
      });
      onStatusChange(document.document_key, 'error');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uploading':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleToggleOpenChange: RadixCollapsibleProps['onOpenChange'] = (
    _open,
  ) => {
    onToggleExpand(document.document_key);
  };

  return (
    <Card
      key={document.document_key}
      className="bg-gray-800/50 border-gray-700/50"
    >
      <CardContent className="p-4">
        <Collapsible open={isExpanded} onOpenChange={handleToggleOpenChange}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {getStatusIcon(uploadStatus)}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className="font-medium text-white truncate"
                    title={document.name}
                  >
                    {document.name}
                  </h4>
                  <Badge
                    variant={
                      document.priority >= 5
                        ? 'destructive'
                        : document.priority >= 4
                          ? 'default'
                          : 'secondary'
                    }
                    className="flex-shrink-0"
                  >
                    {'★'.repeat(document.priority)}
                    {'☆'.repeat(Math.max(0, 5 - document.priority))}
                  </Badge>
                </div>
                <p
                  className="text-sm text-gray-300 truncate"
                  title={document.description}
                >
                  {document.description}
                </p>
                {document.item_description && (
                  <p
                    className="text-sm text-blue-400 mt-1 truncate"
                    title={document.item_description}
                  >
                    <strong>Item específico:</strong> {document.item_description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-4 flex-shrink-0">
              <Button
                onClick={handleInitiateUpload}
                disabled={
                  uploadStatus === 'uploading' || uploadStatus === 'uploaded'
                }
                variant={uploadStatus === 'uploaded' ? 'outline' : 'default'}
                size="sm"
              >
                {uploadStatus === 'uploaded'
                  ? 'Enviado'
                  : uploadStatus === 'uploading'
                    ? 'Enviando...'
                    : uploadStatus === 'error'
                      ? 'Tentar Novamente'
                      : 'Enviar'}
              </Button>

              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  aria-label={
                    isExpanded ? 'Recolher detalhes' : 'Expandir detalhes'
                  }
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>

          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {document.how_to_obtain && (
                <div>
                  <strong className="text-gray-300">Como obter:</strong>
                  <p className="text-gray-400 mt-1 whitespace-pre-wrap">
                    {document.how_to_obtain}
                  </p>
                </div>
              )}
              {document.processing_time && (
                <div>
                  <strong className="text-gray-300">Prazo:</strong>
                  <p className="text-gray-400 mt-1">
                    {document.processing_time}
                  </p>
                </div>
              )}
              {document.estimated_cost && (
                <div>
                  <strong className="text-gray-300">Custo estimado:</strong>
                  <p className="text-gray-400 mt-1">
                    {document.estimated_cost}
                  </p>
                </div>
              )}
              <div>
                <strong className="text-gray-300">
                  ID da Recomendação (roadmap):
                </strong>
                <p className="text-gray-400 mt-1 font-mono text-xs">
                  {document.recommendation_id || 'N/A'}
                </p>
              </div>
              <div>
                <strong className="text-gray-300">Chave do Documento:</strong>
                <p className="text-gray-400 mt-1 font-mono text-xs">
                  {document.document_key}
                </p>
              </div>
            </div>
            {document.reason && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <strong className="text-blue-400">Por que é necessário:</strong>
                <p className="text-blue-300 mt-1 whitespace-pre-wrap">
                  {document.reason}
                </p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;