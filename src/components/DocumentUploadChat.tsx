
import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Upload, HelpCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { RoadmapStep } from './VerticalRoadmap';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

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
  const [messages, setMessages] = useState<Array<{type: 'assistant' | 'user', content: string}>>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize the chat with a welcome message from the assistant
  useEffect(() => {
    if (document && messages.length === 0) {
      setMessages([
        {
          type: 'assistant',
          content: `Olá! Por favor, envie seu ${document.name} para continuarmos. Formatos aceitos: PDF, JPG, PNG`
        }
      ]);
    }
  }, [document, messages.length]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Upload document with base64 encoding directly to database
  const processDocumentUpload = async (file: File) => {
    try {
      setIsUploading(true);
      setUploadedFile(file);
      
      // Add message that file is being uploaded
      setMessages(prev => [...prev, {
        type: 'user',
        content: `Enviando arquivo: ${file.name}`
      }]);

      // Verificar autenticação
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        throw new Error('Usuário não autenticado');
      }
      
      // Progress simulation
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          setUploadProgress(progress);
          if (progress >= 100) clearInterval(interval);
        }, 200);
        return () => clearInterval(interval);
      };
      
      const cleanup = simulateProgress();
      
      // Verificar tamanho do arquivo
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Arquivo muito grande. Máximo 10MB.');
      }
      
      // Convert to base64
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      
      const documentKey = document?.id || 'document';
      
      // Save directly to documents table
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: currentUser.id,
          recommendation_id: document?.id, // Link with document_recommendation
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
      
      // Add confirmation message from the assistant
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Recebi seu arquivo ${file.name}. Obrigado! Você pode prosseguir para o próximo documento ou concluir este.`
      }]);
      
      toast({
        title: "✅ Documento recebido!",
        description: "Seu documento foi enviado com sucesso.",
      });
      
      if (document) {
        onComplete(document.id);
      }
      
      cleanup(); // Ensure interval is cleared
      setUploadProgress(100);
      
    } catch (error: any) {
      console.error('❌ Erro no upload:', error);
      
      setMessages(prev => [...prev, {
        type: 'assistant',
        content: `Ocorreu um erro ao enviar o arquivo: ${error.message}. Por favor, tente novamente.`
      }]);
      
      toast({
        title: "Erro no upload",
        description: `Erro ao enviar o documento: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    processDocumentUpload(file);
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
      <div className="flex justify-between items-center p-4 border-b border-w1-secondary-dark bg-w1-primary-dark">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-gray-400 hover:text-white hover:bg-w1-secondary-dark">
            <ArrowLeft size={18} />
          </Button>
          <div>
            <h3 className="font-medium text-white">{document.name}</h3>
            <p className="text-xs text-gray-400">{document.description}</p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon" onClick={onNext} className="text-gray-400 hover:text-white hover:bg-w1-secondary-dark">
          <ArrowRight size={18} />
        </Button>
      </div>
      
      {/* Chat window */}
      <div className="flex-1 overflow-y-auto p-4 bg-w1-primary-dark">
        {messages.map((message, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            {message.type === 'assistant' ? (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-w1-primary-accent/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-w1-primary-accent font-bold">R</span>
                </div>
                <div className="bg-w1-secondary-dark/50 p-3 rounded-lg rounded-tl-none max-w-[80%] text-white">
                  {message.content}
                </div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="bg-w1-primary-accent/20 p-3 rounded-lg rounded-tr-none max-w-[80%] text-w1-primary-accent border border-w1-primary-accent/30">
                  {message.content}
                </div>
              </div>
            )}
          </motion.div>
        ))}
        
        {/* Upload progress */}
        {isUploading && (
          <div className="bg-w1-secondary-dark/30 p-4 rounded-lg shadow-sm mb-4 mx-auto max-w-md border border-w1-secondary-dark/50">
            <p className="text-sm text-gray-300 mb-2">Enviando arquivo: {uploadedFile?.name}</p>
            <Progress value={uploadProgress} className="h-2 bg-gray-700" indicatorClassName="bg-w1-primary-accent" />
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Upload area */}
      <div className="p-4 border-t border-w1-secondary-dark bg-w1-primary-dark">
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
            className="w-full bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark gap-2"
            disabled={isUploading}
          >
            <Upload size={18} />
            Selecionar Arquivo
          </Button>
          
          {/* Help button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="mx-auto text-gray-400 hover:text-gray-200">
                <HelpCircle size={14} className="mr-1" />
                Preciso de ajuda com este documento
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-w1-primary-dark border-w1-secondary-dark">
              <DialogHeader>
                <DialogTitle className="text-white">Ajuda com Documentos</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <h3 className="font-medium text-w1-primary-accent">Dúvidas sobre {document.name}?</h3>
                <p className="text-gray-300">
                  Este documento é necessário para validar sua identidade e garantir a segurança do processo.
                  Se você tiver dificuldades para obter este documento, aqui estão algumas opções:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  <li>Você pode enviar uma versão digitalizada do documento original</li>
                  <li>O documento deve estar legível e com todas as informações visíveis</li>
                  <li>Você pode tirar uma foto com seu celular, desde que a qualidade seja boa</li>
                </ul>
                <p className="text-gray-300 mt-4">
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
