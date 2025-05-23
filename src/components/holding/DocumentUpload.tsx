
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentRecommendation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploadService } from '@/services/DocumentUploadService';
import DocumentHeader from './DocumentHeader';
import DocumentDetails from './DocumentDetails';

export interface DocumentUploadProps {
  document: DocumentRecommendation;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'error';
  isExpanded: boolean;
  userId: string | undefined;
  onToggleExpand: (documentKey: string) => void;
  onStatusChange: (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  document,
  uploadStatus,
  isExpanded,
  userId,
  onToggleExpand,
  onStatusChange
}) => {
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
          await DocumentUploadService.uploadDocument(
            file, 
            documentKey, 
            recommendationId, 
            userId,
            (status) => onStatusChange(documentKey, status),
            toast
          );
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

  return (
    <Card key={document.document_key} className="bg-gray-800/50 border-gray-700/50">
      <CardContent className="p-4">
        <Collapsible 
          open={isExpanded} 
          onOpenChange={() => onToggleExpand(document.document_key)}
        >
          <div className="flex items-center justify-between">
            <DocumentHeader document={document} uploadStatus={uploadStatus} />
            
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
              
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                >
                  {isExpanded ? <ChevronUp /> : <ChevronDown />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent>
            <DocumentDetails document={document} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
