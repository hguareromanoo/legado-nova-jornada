import { supabase } from '@/integrations/supabase/client';
// Corrigido: Importar 'toast' com 't' minúsculo
import { toast as uiToast } from '@/components/ui/use-toast'; // Renomeado para uiToast para evitar conflito com o parâmetro

// Define o tipo para a função toast que será passada como parâmetro
type ToastFunction = (props: { title: string; description: string; variant?: "default" | "destructive" }) => void;

export class DocumentUploadService {
  static async uploadDocument(
    file: File,
    documentKey: string,
    recommendationId: string,
    userId: string, // userId é obrigatório aqui
    onProgress: (status: 'pending' | 'uploading' | 'uploaded' | 'error') => void,
    // Usar o nome 'toastParam' para o parâmetro para não conflitar com o 'uiToast' importado, se necessário
    // ou garantir que o toast importado não seja usado diretamente neste escopo se um parâmetro tem o mesmo nome.
    // Para clareza, vamos assumir que o toast passado como parâmetro é o que deve ser usado.
    toastFn: ToastFunction // Renomeado o parâmetro para clareza e tipado
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
      // Não é necessário retornar nada aqui, pois o erro é tratado e o fluxo termina.
      // Se a função tem um tipo de retorno esperado em caso de erro, adicione-o (ex: return null; ou return undefined;)
      // Mas como é um método de serviço, lançar o erro ou não retornar nada é comum.
    }
  }

  // Corrigido: Parâmetro obrigatório 'toastFn' movido antes do parâmetro opcional 'fileName'
  static async downloadDocument(
    documentId: string, // Obrigatório
    userId: string | undefined, // Obrigatório (mas pode ser undefined)
    toastFn: ToastFunction, // Obrigatório - movido para antes de fileName
    fileName?: string // Opcional
  ) {
    try {
      // Verificar userId explicitamente se a lógica de permissão depender dele não ser undefined
      if (userId === undefined) { // Adicionada verificação para maior clareza, embora o !== abaixo já cubra
        throw new Error('ID do usuário não fornecido para verificação de permissão.');
      }

      const { data, error } = await supabase
        .from('documents')
        .select('file_data, file_name, user_id')
        .eq('id', documentId) 
        .single();
      
      if (error) throw error;
      if (!data?.file_data) throw new Error('Arquivo não encontrado ou dados do arquivo ausentes.');
      // A comparação data.user_id !== userId só faz sentido se userId não for undefined aqui.
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
      toastFn({ // Usar o parâmetro toastFn
        title: "Erro ao baixar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  }
}