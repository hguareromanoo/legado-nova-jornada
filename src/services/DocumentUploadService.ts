
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast'; // Corrected import (toast, not Toast)

// Define the type for the function toast that will be passed as parameter
type ToastFunction = (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;

export class DocumentUploadService {
  static async uploadDocument(
    file: File,
    documentKey: string,
    recommendationId: string,
    userId: string,
    onProgress: (status: 'pending' | 'uploading' | 'uploaded' | 'error') => void,
    toastFn: ToastFunction // Required parameter can't follow optional parameter
  ) {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      if (!file) throw new Error('Nenhum arquivo selecionado');
      if (!recommendationId) throw new Error('ID da recomendação é obrigatório');
      if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10MB.');
      
      onProgress('uploading');
      
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (_errorEvent) => reject(new Error(`Erro ao ler o arquivo: ${reader.error?.message || 'Erro desconhecido'}`));
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
      
      const { error: recommendationUpdateError } = await supabase
        .from('document_recommendations')
        .update({ 
            sent: true,
            updated_at: timestamp 
        })
        .eq('recommendation_id', recommendationId);
      
      if (recommendationUpdateError) {
        console.error('Erro ao atualizar a coluna sent em document_recommendations:', recommendationUpdateError);
        throw new Error(`Documento salvo, mas falha ao atualizar o status (sent) da recomendação: ${recommendationUpdateError.message}`);
      }
      
      console.log('✅ Coluna sent da recomendação atualizada para true.');
      onProgress('uploaded');
      
      toastFn({
        title: "Documento enviado com sucesso!",
        description: `${file.name} foi enviado e o status da recomendação foi atualizado.`,
      });
      
      return documentData;
      
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      onProgress('error');
      
      toastFn({
        title: "Erro no upload",
        description: `Erro ao processar o documento: ${error.message}`,
        variant: "destructive",
      });
    }
  }

  static async downloadDocument(
    documentId: string,
    userId: string | undefined,
    toastFn: ToastFunction,
    fileName?: string
  ) {
    try {
      if (userId === undefined) {
        throw new Error('ID do usuário não fornecido para verificação de permissão.');
      }

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
      toastFn({
        title: "Erro ao baixar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  }
}
