
import { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentRecommendation } from '@/types/chat'; // Certifique-se que este tipo inclui recommendation_id
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DocumentUploadProps {
  document: DocumentRecommendation & { recommendation_id: string };
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
  const { toast } = useToast();

  const handleDocumentUpload = async (documentKey: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      
      const recommendationId = document.recommendation_id;
      
      if (!recommendationId) {
        console.error('Error: recommendation_id não encontrado no objeto document.', document);
        throw new Error('ID da recomendação não encontrado. Verifique os dados da recomendação.');
      }
      
      const fileInput = window.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
      fileInput.multiple = false;
      
      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          await uploadDocument(file, documentKey, recommendationId);
        }
      };
      
      fileInput.click();
    } catch (error: any) {
      console.error('Erro ao preparar upload:', error);
      toast({
        title: "Erro",
        description: `Não foi possível preparar o upload do documento: ${error.message}`,
        variant: "destructive",
      });
      onStatusChange(documentKey, 'error');
    }
  };

  const uploadDocument = async (file: File, documentKey: string, recommendationId: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      if (!file) throw new Error('Nenhum arquivo selecionado');
      if (!recommendationId) throw new Error('ID da recomendação é obrigatório');
      if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10MB.');
      
      onStatusChange(documentKey, 'uploading');
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (errorEvent) => reject(new Error(`Erro ao ler o arquivo: ${reader.error?.message || 'Erro desconhecido'}`));
        reader.readAsDataURL(file);
      });
      
      const timestamp = new Date().toISOString();

      const { data: documentData, error: documentsError } = await supabase
        .from('documents')
        .insert({
          user_id: userId,
          recommendation_id: recommendationId,
          bucket_name: 'database_storage',
          object_key: `${userId}/${documentKey}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_data: base64Data,
          document_key: documentKey,
          created_at: timestamp,
          updated_at: timestamp
        })
        .select()
        .single();
      
      if (documentsError) {
        console.error('Erro ao salvar na tabela documents:', documentsError);
        throw new Error(`Erro ao salvar documento: ${documentsError.message}`);
      }
      
      console.log('✅ Documento salvo com sucesso na tabela documents:', documentData);
      
      // Atualizar a coluna 'sent' na tabela 'document_recommendations'
      const { error: recommendationUpdateError } = await supabase
        .from('document_recommendations')
        .update({ 
            sent: true, // Atualiza a coluna 'sent' para true
            updated_at: timestamp 
        })
        .eq('recommendation_id', recommendationId);
      
      if (recommendationUpdateError) {
        console.error('Erro ao atualizar a coluna sent em document_recommendations:', recommendationUpdateError);
        throw new Error(`Documento salvo, mas falha ao atualizar o status (sent) da recomendação: ${recommendationUpdateError.message}`);
      }
      
      console.log('✅ Coluna sent da recomendação atualizada para true.');
      onStatusChange(documentKey, 'uploaded');
      
      toast({
        title: "Documento enviado com sucesso!",
        description: `${file.name} foi enviado e o status da recomendação foi atualizado.`,
      });
      
      return documentData;
      
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      onStatusChange(documentKey, 'error');
      
      toast({
        title: "Erro no upload",
        description: `Erro ao processar o documento: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const downloadDocument = async (documentId: string, fileName?: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('file_data, file_name, user_id')
        .eq('id', documentId) 
        .single();
      
      if (error) throw error;
      if (!data?.file_data) throw new Error('Arquivo não encontrado ou dados do arquivo ausentes.');
      if (data.user_id !== userId) throw new Error('Você não tem permissão para baixar este arquivo.');
      
      const link = window.document.createElement('a');
      link.href = data.file_data;
      link.download = fileName || data.file_name || 'downloaded_file';
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      link.remove();

    } catch (error: any) {
      console.error('Erro ao baixar documento:', error);
      toast({
        title: "Erro ao baixar documento",
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

  return (
    <Card key={document.document_key} className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {getStatusIcon(uploadStatus)}
            
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white truncate" title={document.name}>{document.name}</h4>
                {document.priority != null && (
                  <Badge 
                    variant={document.priority >= 5 ? "destructive" : document.priority >= 4 ? "default" : "secondary"}
                    className="flex-shrink-0"
                  >
                    {'★'.repeat(document.priority)}{'☆'.repeat(Math.max(0, 5 - document.priority))}
                  </Badge>
                )}
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
              onClick={() => handleDocumentUpload(document.document_key)}
              disabled={uploadStatus === 'uploading'}
              variant={uploadStatus === 'uploaded' ? "outline" : "default"}
              size="sm"
            >
              {uploadStatus === 'uploaded' ? 'Enviado' :
               uploadStatus === 'uploading' ? 'Enviando...' :
               uploadStatus === 'error' ? 'Tentar Novamente' :
               'Enviar'}
            </Button>
            
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onToggleExpand(document.document_key)}
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
        
        <Collapsible open={isExpanded} onOpenChange={() => onToggleExpand(document.document_key)}>
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