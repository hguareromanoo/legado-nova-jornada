
import React, { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Upload, X, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep } from './VerticalRoadmap';
import { Progress } from '@/components/ui/progress';

interface DocumentUploadChatProps {
  document: RoadmapStep | null;
  onBack: () => void;
  onClose: () => void;
  onComplete: (documentId: string) => void;
  onNext: () => void;
}

const DocumentUploadChat = ({ 
  document, 
  onBack, 
  onClose, 
  onComplete,
  onNext
}: DocumentUploadChatProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    setIsUploading(true);
    setUploadedFile(file);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        
        toast({
          title: "✅ Documento recebido!",
          description: "Seu documento foi enviado com sucesso.",
        });
        
        if (document) {
          onComplete(document.id);
        }
      }
    }, 200);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  if (!document) return null;
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft size={18} />
          </Button>
          <span className="font-medium text-w1-primary-dark">Upload de Documento</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onNext}>
            <ArrowRight size={18} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>
      
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* Assistant message */}
        <div className="flex gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-w1-primary-accent flex items-center justify-center flex-shrink-0">
            <span className="text-w1-primary-dark font-bold">R</span>
          </div>
          <div className="bg-white p-4 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
            <p className="text-gray-800">
              Olá! Por favor, envie seu <strong>{document.name}</strong> para continuarmos.
              <br /><br />
              <span className="text-sm text-gray-600">{document.description}</span>
              <br />
              <span className="text-sm text-gray-500">Formatos aceitos: PDF, JPG, PNG</span>
            </p>
          </div>
        </div>
        
        {/* Upload progress or completed message */}
        {isUploading && (
          <div className="bg-white p-4 rounded-lg shadow-sm mb-4 mx-auto max-w-md">
            <p className="text-sm text-gray-600 mb-2">Enviando arquivo: {uploadedFile?.name}</p>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}
        
        {uploadedFile && !isUploading && (
          <div className="flex justify-end mb-4">
            <div className="bg-w1-primary-accent p-3 rounded-lg rounded-tr-none max-w-[80%]">
              <p className="text-w1-primary-dark">
                Documento enviado: {uploadedFile.name}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Upload area */}
      <div className="p-4 border-t bg-white">
        <div className="flex flex-col gap-3">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
          />
          <Button 
            onClick={triggerFileInput}
            className="w-full bg-w1-primary-dark hover:bg-opacity-90 gap-2"
            disabled={isUploading}
          >
            <Upload size={18} />
            Selecionar Arquivo
          </Button>
          
          {/* Help button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="mx-auto text-gray-500 hover:text-gray-700">
                <HelpCircle size={14} className="mr-1" />
                Preciso de ajuda com este documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Ajuda com Documentos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <h3 className="font-medium text-w1-primary-dark">Dúvidas sobre {document.name}?</h3>
                <p className="text-gray-600">
                  Este documento é necessário para validar sua identidade e garantir a segurança do processo.
                  Se você tiver dificuldades para obter este documento, aqui estão algumas opções:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  <li>Você pode enviar uma versão digitalizada do documento original</li>
                  <li>O documento deve estar legível e com todas as informações visíveis</li>
                  <li>Você pode tirar uma foto com seu celular, desde que a qualidade seja boa</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Para mais ajuda, entre em contato com nossa equipe de suporte pelo chat ou telefone.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadChat;
