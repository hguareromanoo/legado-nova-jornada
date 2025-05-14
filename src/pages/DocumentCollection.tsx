
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Home, 
  Upload, 
  CheckCircle, 
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Document {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'locked';
}

const DocumentCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([
    { 
      id: 'id', 
      name: 'Documento de Identidade', 
      description: 'RG, CNH ou Passaporte válido', 
      icon: <FileText size={24} />, 
      status: 'current' 
    },
    { 
      id: 'tax-return', 
      name: 'Declaração de IR', 
      description: 'Última declaração completa', 
      icon: <FileText size={24} />, 
      status: 'locked' 
    },
    { 
      id: 'property-deed', 
      name: 'Matrícula dos Imóveis', 
      description: 'Certidão atualizada (30 dias)', 
      icon: <Home size={24} />, 
      status: 'locked' 
    },
    { 
      id: 'company-docs', 
      name: 'Contrato Social', 
      description: 'Das empresas que você possui', 
      icon: <FileText size={24} />, 
      status: 'locked' 
    },
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    // Calculate progress based on completed documents
    const completedDocs = documents.filter(doc => doc.status === 'completed').length;
    setProgress((completedDocs / documents.length) * 100);
  }, [documents]);
  
  const handleDocumentClick = (document: Document) => {
    if (document.status === 'locked') {
      toast({
        title: "Documento bloqueado",
        description: "Complete os documentos anteriores primeiro.",
      });
      return;
    }
    
    setSelectedDocument(document);
    setChatOpen(true);
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    
    // Simulate upload progress
    let uploadProgress = 0;
    const interval = setInterval(() => {
      uploadProgress += 10;
      if (uploadProgress >= 100) {
        clearInterval(interval);
        
        // Update document status
        setDocuments(docs => docs.map((doc, index) => {
          if (doc.id === docId) {
            return { ...doc, status: 'completed' };
          }
          // Set next document as current
          if (index === currentStep + 1) {
            return { ...doc, status: 'current' };
          }
          return doc;
        }));
        
        // Save the uploaded file
        setUploadedFiles(prev => ({
          ...prev,
          [docId]: file
        }));
        
        // Show success toast
        toast({
          title: "✅ Documento recebido!",
          description: "Seu documento foi enviado com sucesso.",
        });
        
        // Move to next step
        setCurrentStep(prev => prev + 1);
        setChatOpen(false);
        
        // Check if all documents are completed
        if (currentStep === documents.length - 1) {
          // All documents uploaded
          setTimeout(() => {
            navigate('/roadmap-progress');
          }, 1500);
        }
      }
    }, 200);
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const renderDocumentChat = () => {
    if (!selectedDocument) return null;
    
    return (
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => setChatOpen(false)}>
            <ArrowLeft size={18} />
            Voltar
          </Button>
          <span className="font-medium">{selectedDocument.name}</span>
          <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
            <X size={18} />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4">
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-w1-primary-accent flex items-center justify-center">
              <span className="text-w1-primary-dark font-bold">R</span>
            </div>
            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[80%]">
              <p className="text-gray-800">
                Olá! Por favor, envie seu <strong>{selectedDocument.name}</strong> para continuarmos. 
                <br /><br />
                <span className="text-sm text-gray-600">Formatos aceitos: PDF, JPG, PNG</span>
              </p>
            </div>
          </div>
          
          {uploadedFiles[selectedDocument.id] && (
            <div className="flex justify-end mb-4">
              <div className="bg-w1-primary-accent p-3 rounded-lg rounded-tr-none max-w-[80%]">
                <p className="text-w1-primary-dark">
                  Documento enviado: {uploadedFiles[selectedDocument.id]?.name}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => handleFileUpload(e, selectedDocument.id)}
          />
          <Button 
            onClick={triggerFileInput}
            className="w-full bg-w1-primary-dark hover:bg-opacity-90 gap-2"
          >
            <Upload size={18} />
            Selecionar Arquivo
          </Button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="w1-container max-w-5xl py-16 mx-auto">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-w1-primary-dark mb-4">
            Valide sua Estrutura de Holding
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Com base no seu perfil, delineamos estratégias potenciais para configurar sua holding. 
            Para confirmar o melhor caminho, precisamos revisar alguns documentos importantes. 
            Não se preocupe — Robson irá guiá-lo passo a passo.
          </p>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg">
            Uma vez recebidos todos os documentos, você será convidado a agendar uma chamada 
            individual com um consultor da W1 para concluir a configuração da sua holding.
          </div>
        </motion.div>
        
        {/* FAQ Button */}
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                className="bg-white border-w1-primary-accent text-w1-primary-dark hover:bg-gray-50"
              >
                <HelpCircle size={18} className="mr-2" />
                Dúvidas? Converse com o Robson
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>FAQ — Perguntas Frequentes</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-w1-primary-dark">Por que preciso enviar estes documentos?</h3>
                  <p className="text-gray-600">Eles são necessários para validarmos sua situação atual e personalizarmos a estrutura da holding de acordo com seu patrimônio.</p>
                </div>
                <div>
                  <h3 className="font-medium text-w1-primary-dark">Os documentos são seguros?</h3>
                  <p className="text-gray-600">Sim! Todos os arquivos são criptografados e seguem normas rígidas de LGPD.</p>
                </div>
                <div>
                  <h3 className="font-medium text-w1-primary-dark">E se eu não tiver algum documento?</h3>
                  <p className="text-gray-600">Não se preocupe. Você pode pular e retomar mais tarde, ou conversar com um consultor para alternativas.</p>
                </div>
              </div>
              <DialogClose asChild>
                <Button className="w-full mt-4">Entendi</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </motion.div>
        
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso:</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Document Roadmap */}
        <motion.div 
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-center">Documentos Necessários</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
              >
                <Card 
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    doc.status === 'current' ? 'ring-2 ring-w1-primary-accent shadow-md' : 
                    doc.status === 'completed' ? 'bg-gray-50' :
                    'opacity-70'
                  }`}
                  onClick={() => handleDocumentClick(doc)}
                >
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-full ${
                      doc.status === 'completed' ? 'bg-green-100' : 
                      doc.status === 'current' ? 'bg-w1-primary-accent/20' :
                      'bg-gray-100'
                    }`}>
                      {doc.status === 'completed' ? (
                        <CheckCircle size={24} className="text-green-600" />
                      ) : doc.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-w1-primary-dark">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                    </div>
                    {doc.status === 'completed' && (
                      <span className="text-green-600 text-sm font-medium">Concluído</span>
                    )}
                    {doc.status === 'current' && (
                      <div className="relative">
                        <div className="w-2.5 h-2.5 bg-w1-primary-accent rounded-full"></div>
                        <div className="absolute inset-0 w-2.5 h-2.5 bg-w1-primary-accent rounded-full animate-ping opacity-75"></div>
                      </div>
                    )}
                    {doc.status === 'locked' && (
                      <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">
                        <span className="text-gray-400 text-xs">{index + 1}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Continue Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={() => {
              // Find the first non-completed document
              const nextDoc = documents.find(doc => doc.status === 'current');
              if (nextDoc) {
                handleDocumentClick(nextDoc);
              } else if (progress === 100) {
                // All documents completed, navigate to next page
                navigate('/roadmap-progress');
              }
            }}
            className="bg-w1-primary-dark hover:bg-opacity-90 gap-2"
            size="lg"
          >
            Continuar
            <ArrowRight size={18} />
          </Button>
        </div>
        
        {/* Chat Dialog */}
        <Dialog open={chatOpen} onOpenChange={setChatOpen}>
          <DialogContent className="sm:max-w-md h-[80vh] flex flex-col p-0">
            {renderDocumentChat()}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DocumentCollection;
