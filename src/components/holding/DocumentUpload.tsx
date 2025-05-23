
import { useState } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentRecommendation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const handleDocumentUpload = (documentKey: string, recommendationId: string) => {
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
  };

  // Upload document with base64 encoding directly to database
  const uploadDocument = async (file: File, documentKey: string, recommendationId: string) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      if (!file) throw new Error('Nenhum arquivo selecionado');
      if (!recommendationId) throw new Error('ID da recomendação é obrigatório');
      if (file.size > 10 * 1024 * 1024) throw new Error('Arquivo muito grande. Máximo 10MB.');
      
      onStatusChange(documentKey, 'uploading');
      
      // Convert to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      // Save directly to documents table
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: userId,                     // Use user_id instead of profile_id
          recommendation_id: recommendationId, // Link with document_recommendation
          bucket_name: 'local_storage',
          object_key: `${documentKey}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          file_name: file.name,
          file_type: file.type,
          file_size: file.size,
          file_data: base64Data,
          document_key: documentKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        throw new Error(`Erro ao salvar: ${error.message}`);
      }
      
      console.log('✅ Documento salvo com sucesso:', data);
      onStatusChange(documentKey, 'uploaded');
      
      toast({
        title: "Documento enviado com sucesso!",
        description: `${file.name} foi enviado e salvo.`,
      });
      
      return data;
      
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

  // Helper function to list user documents
  const listUserDocuments = async (documentKey: string, recommendationId: string | null = null) => {
    try {
      if (!userId) throw new Error('Usuário não autenticado');
      
      let query = supabase
        .from('documents')
        .select(`
          document_id, 
          document_key, 
          file_name, 
          file_type, 
          file_size, 
          created_at,
          recommendation_id
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (recommendationId) {
        query = query.eq('recommendation_id', recommendationId);
      }
      
      if (documentKey) {
        query = query.eq('document_key', documentKey);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao listar documentos:', error);
      return [];
    }
  };

  // Function to download a document
  const downloadDocument = async (documentId: string, fileName?: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('file_data, file_name, user_id')
        .eq('document_id', documentId)
        .single();
      
      if (error) throw error;
      if (!data?.file_data) throw new Error('Arquivo não encontrado');
      if (data.user_id !== userId) throw new Error('Você não tem permissão para baixar este arquivo');
      
      // Use window.document to avoid confusion with the prop named document
      const link = window.document.createElement('a');
      link.href = data.file_data;
      link.download = fileName || data.file_name;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
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
              onClick={() => handleDocumentUpload(document.document_key, document.recommendation_id)}
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
