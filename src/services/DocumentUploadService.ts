import { supabase } from '@/integrations/supabase/client';
// Corrigido: Importar 'toast' com 't' minúsculo e renomear para evitar conflito se necessário.
// Se você estiver usando o 'toast' globalmente e não como parâmetro, pode manter 'toast'.
// Para este exemplo, assumo que a função toast passada como parâmetro é a que deve ser usada.
// import { toast as uiToast } from '@/components/ui/use-toast';

// Define o tipo para a função toast que será passada como parâmetro
type ToastFunction = (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;

export class DocumentUploadService {
  static async uploadDocument(
    file: File,
    documentKey: string,
    recommendationId: string,
    userId: string,
    onProgress: (status: 'pending' | 'uploading' | 'uploaded' | 'error') => void,
    // Renomeado o parâmetro para clareza e tipado explicitamente
    toastFn: ToastFunction
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
        .from('document_recommendations') // Ou 'document_roadmap' se for o caso de apenas marcar como 'sent'
        .update({ 
            sent: true, // Certifique-se que esta é a coluna e valor corretos
            updated_at: timestamp 
        })
        .eq('recommendation_id', recommendationId); // Ou .eq('document_key', documentKey).eq('user_id', userId) se for roadmap
      
      if (recommendationUpdateError) {
        console.error('Erro ao atualizar a recomendação/roadmap:', recommendationUpdateError);
        throw new Error(`Documento salvo, mas falha ao atualizar status da recomendação: ${recommendationUpdateError.message}`);
      }
      
      console.log('✅ Status da recomendação/roadmap atualizado.');
      onProgress('uploaded');
      
      toastFn({ // Usar o parâmetro toastFn
        title: "Documento enviado com sucesso!",
        description: `${file.name} foi enviado e o status da recomendação foi atualizado.`,
      });
      
      return documentData;
      
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      onProgress('error');
      
      toastFn({ // Usar o parâmetro toastFn
        title: "Erro no upload",
        description: `Erro ao processar o documento: ${error.message}`,
        variant: "destructive",
      });
      // Considerar se deve relançar o erro ou retornar um valor/objeto de erro
      // throw error; // Se quem chama o serviço precisar saber do erro
    }
  }

  // Corrigido: Parâmetro obrigatório 'toastFn' movido antes do parâmetro opcional 'fileName'
  static async downloadDocument(
    documentId: string,             // Obrigatório
    userId: string | undefined,     // Obrigatório (mas pode ser undefined)
    toastFn: ToastFunction,         // Obrigatório - movido para antes de fileName
    fileName?: string               // Opcional
  ) {
    try {
      if (userId === undefined) {
        throw new Error('ID do usuário não fornecido para verificação de permissão.');
      }

      const { data, error } = await supabase
        .from('documents')
        .select('file_data, file_name, user_id')
        .eq('id', documentId) // Supondo que 'id' é a PK da tabela 'documents'
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
