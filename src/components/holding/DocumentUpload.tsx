import { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentRecommendation } from '@/types/chat'; // Assuming updated type
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs for uploaded files

interface DocumentUploadProps {
  document: DocumentRecommendation;
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

  // Function to handle document upload
  const handleDocumentUpload = async (documentKey: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      
      // The document prop now contains the recommendation_id from the 'recommendations' table directly as 'id'
      const recommendationId = document.id; 
      
      if (!recommendationId) {
        throw new Error('ID da recomendação é obrigatório.');
      }
      
      // Using window.document instead of just document to avoid confusion with the prop named document
      const fileInput = window.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png';
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
    }
  };

  // Upload document to Supabase Storage and save metadata to 'uploaded_documents' table
  const uploadDocument = async (file: File, documentKey: string, recommendationId: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      if (!file) throw new Error('Nenhum arquivo selecionado');
      if (!recommendationId) throw new Error('ID da recomendação é obrigatório');
      if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10MB.'); // 10MB limit
      
      onStatusChange(documentKey, 'uploading');
      
      const fileExtension = file.name.split('.').pop();
      const uniqueFileName = `${documentKey}_${Date.now()}.${fileExtension}`;
      const storagePath = `user_uploads/${userId}/${recommendationId}/${uniqueFileName}`;

      // 1. Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('documents') // Assuming your storage bucket is named 'documents'
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (storageError) {
        console.error('Supabase Storage Error:', storageError);
        throw new Error(`Erro ao enviar arquivo para o armazenamento: ${storageError.message}`);
      }
      
      console.log('✅ Arquivo enviado para Supabase Storage:', storageData.path);

      // 2. Insert metadata into 'uploaded_documents' table
      const { data: dbData, error: dbError } = await supabase
        .from('uploaded_documents') // New table name
        .insert({
          user_id: userId,
          recommendation_id: recommendationId,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_path: storageData.path, // Save the path from storage
        })
        .select()
        .single();
      
      if (dbError) {
        console.error('Database Error (uploaded_documents):', dbError);
        throw new Error(`Erro ao salvar metadados do documento: ${dbError.message}`);
      }
      
      console.log('✅ Metadados do documento salvos com sucesso:', dbData);
      
      // 3. Update 'document_roadmap' to mark this document as sent
      // Note: 'document_roadmap' is now a separate table tracking the recommendation fulfillment,
      // not directly storing file data. Its 'sent' status indicates the recommendation is fulfilled.
      const { error: roadmapUpdateError } = await supabase
        .from('document_roadmap')
        .update({ sent: true, updated_at: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('document_key', documentKey); // Using document_key to identify the roadmap entry

      if (roadmapUpdateError) {
        console.error('Error updating document roadmap:', roadmapUpdateError);
        // Decide whether to throw an error or just log, based on criticality.
        // For now, it's critical for progress tracking.
        throw new Error(`Erro ao atualizar o status da recomendação: ${roadmapUpdateError.message}`);
      }
      
      onStatusChange(documentKey, 'uploaded');
      
      toast({
        title: "Documento enviado com sucesso!",
        description: `${file.name} foi enviado e salvo.`,
      });
      
      return dbData;
      
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      onStatusChange(documentKey, 'error');
      
      toast({
        title: "Erro no upload",
        description: `Erro ao enviar o documento: ${error.message}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Function to download a document from Supabase Storage
  const downloadDocument = async (storagePath: string, fileName: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase.storage
        .from('documents') // Your storage bucket name
        .download(storagePath);

      if (error) {
        console.error('Supabase Storage Download Error:', error);
        throw new Error(`Erro ao baixar o arquivo: ${error.message}`);
      }

      if (!data) throw new Error('Arquivo não encontrado no armazenamento.');

      const url = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = fileName;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
      
      toast({
        title: "Download iniciado!",
        description: `O download de ${fileName} foi iniciado.`,
      });

    } catch (error: any) {
      console.error('Erro ao baixar documento:', error);
      toast({
        title: "Erro ao baixar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Get status icon based on upload status
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
          <div className="flex items-center gap-4 flex-1">
            {getStatusIcon(uploadStatus)}
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-medium text-white">{document.name}</h4>
                <Badge variant={document.priority >= 5 ? "destructive" : document.priority >= 4 ? "default" : "secondary"}>
                  {'★'.repeat(document.priority)}
                </Badge>
              </div>
              <p className="text-sm text-gray-300">{document.description}</p>
              
              {document.item_description && (
                <p className="text-sm text-blue-400 mt-1">
                  <strong>Item específico:</strong> {document.item_description}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              onClick={() => handleDocumentUpload(document.document_key)}
              disabled={uploadStatus === 'uploading'}
              variant={uploadStatus === 'uploaded' ? "outline" : "default"}
              size="sm"
            >
              {uploadStatus === 'uploaded' ? 'Enviado' :
               uploadStatus === 'uploading' ? 'Enviando...' :
               uploadStatus === 'error' ? 'Tentar novamente' :
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
        
        <Collapsible open={isExpanded}>
          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-700/50">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              {document.how_to_obtain && (
                <div>
                  <strong className="text-gray-300">Como obter:</strong>
                  <p className="text-gray-400 mt-1">{document.how_to_obtain}</p>
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
                <strong className="text-gray-300">ID do documento:</strong>
                <p className="text-gray-400 mt-1 font-mono text-xs">{document.document_key}</p>
              </div>
            </div>
            
            {document.reason && (
              <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                <strong className="text-blue-400">Por que é necessário:</strong>
                <p className="text-blue-300 mt-1">{document.reason}</p>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;