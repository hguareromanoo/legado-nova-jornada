
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DocumentRecommendation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { DocumentUploadService } from '@/services/DocumentUploadService';
import DocumentStatusIcon from './DocumentStatusIcon';
import DocumentHeader from './DocumentHeader';
import DocumentDetails from './DocumentDetails';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

  const handleTriggerUpload = async (documentKey: string) => {
    try {
      if (!userId) {
        toast({ 
          title: "Erro", 
          description: "Usuário não autenticado.", 
          variant: "destructive" 
        });
        throw new Error('Usuário não autenticado');
      }
      
      if (!document.recommendation_id) {
        toast({ 
          title: "Erro", 
          description: "ID da recomendação ausente.", 
          variant: "destructive" 
        });
        throw new Error('ID da recomendação ausente');
      }

      const fileInput = window.document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx';
      fileInput.multiple = false;
      
      fileInput.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          onStatusChange(documentKey, 'uploading');
          
          try {
            await DocumentUploadService.uploadDocument(
              file, 
              documentKey, 
              document.recommendation_id || '', 
              userId,
              (status) => onStatusChange(documentKey, status),
              toast
            );
          } catch (uploadError: any) {
            onStatusChange(documentKey, 'error');
            toast({ 
              title: "Erro no Upload", 
              description: uploadError.message, 
              variant: "destructive" 
            });
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
              
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={isExpanded ? "Recolher detalhes" : "Expandir detalhes"}
                >
                  {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                </Button>
              </CollapsibleTrigger>
            </div>
          </div>
          
          <CollapsibleContent className="mt-4 pt-4 border-t border-gray-700/50">
            <DocumentDetails document={document} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
