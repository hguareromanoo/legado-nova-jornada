
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Home, Building, CheckCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import VerticalRoadmap, { RoadmapStep } from '@/components/VerticalRoadmap';
import DocumentUploadChat from '@/components/DocumentUploadChat';

const DocumentCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<RoadmapStep[]>([
    { 
      id: 'id', 
      name: 'Documento de Identidade', 
      description: 'RG, CNH ou Passaporte válido', 
      icon: <FileText size={20} className="text-w1-primary-dark" />, 
      status: 'current' 
    },
    { 
      id: 'tax-return', 
      name: 'Declaração de IR', 
      description: 'Última declaração completa', 
      icon: <FileText size={20} className="text-gray-500" />, 
      status: 'locked' 
    },
    { 
      id: 'property-deed', 
      name: 'Matrícula dos Imóveis', 
      description: 'Certidão atualizada (30 dias)', 
      icon: <Home size={20} className="text-gray-500" />, 
      status: 'locked' 
    },
    { 
      id: 'company-docs', 
      name: 'Contrato Social', 
      description: 'Das empresas que você possui', 
      icon: <Building size={20} className="text-gray-500" />, 
      status: 'locked' 
    },
  ]);
  
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<RoadmapStep | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  
  useEffect(() => {
    // Calculate progress based on completed documents
    const completedDocs = documents.filter(doc => doc.status === 'completed').length;
    setProgress((completedDocs / documents.length) * 100);
  }, [documents]);
  
  const handleStepSelect = (documentId: string) => {
    const document = documents.find(doc => doc.id === documentId);
    if (document && document.status !== 'locked') {
      setSelectedDocument(document);
      setChatOpen(true);
    } else if (document?.status === 'locked') {
      toast({
        title: "Documento bloqueado",
        description: "Complete os documentos anteriores primeiro.",
      });
    }
  };
  
  const handleDocumentComplete = (documentId: string) => {
    setDocuments(docs => docs.map((doc, index) => {
      if (doc.id === documentId) {
        return { ...doc, status: 'completed' };
      }
      
      // Set next document as current
      if (index === currentStep + 1) {
        return { ...doc, status: 'current' };
      }
      
      return doc;
    }));
    
    // Move to next step
    setCurrentStep(prev => prev + 1);
    
    // Check if all documents are completed
    setTimeout(() => {
      const allCompleted = documents.length === currentStep + 1;
      if (allCompleted) {
        toast({
          title: "Todos os documentos enviados!",
          description: "Parabéns! Vamos agendar sua reunião com um consultor.",
        });
        navigate('/roadmap-progress');
      }
    }, 1000);
  };
  
  const handleNextDocument = () => {
    if (currentStep < documents.length - 1) {
      const nextDoc = documents[currentStep + 1];
      if (nextDoc.status !== 'locked') {
        setSelectedDocument(nextDoc);
      }
    } else {
      setChatOpen(false);
    }
  };
  
  const handleContinue = () => {
    // Find the first non-completed document
    const currentDoc = documents.find(doc => doc.status === 'current');
    if (currentDoc) {
      handleStepSelect(currentDoc.id);
    } else if (progress === 100) {
      // All documents completed, navigate to next page
      navigate('/roadmap-progress');
    }
  };
  
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="w1-container max-w-7xl mx-auto flex-grow py-8 px-4">
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
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg max-w-3xl mx-auto">
            Uma vez recebidos todos os documentos, você será convidado a agendar uma chamada 
            individual com um consultor da W1 para concluir a configuração da sua holding.
          </div>
        </motion.div>
        
        {/* FAQ Button */}
        <motion.div 
          className="text-center mb-6"
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
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progresso:</span>
            <span>{Math.round(progress)}% completo</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-col md:flex-row rounded-xl border overflow-hidden shadow-sm max-w-5xl mx-auto mb-8 min-h-[400px]">
          {/* Vertical Roadmap - Left Side */}
          <div className="w-full md:w-1/3 border-b md:border-b-0">
            <VerticalRoadmap 
              steps={documents} 
              currentStep={currentStep} 
              onStepSelect={handleStepSelect} 
            />
          </div>
          
          {/* Main Content Area - Right Side */}
          <div className="w-full md:w-2/3 bg-white p-8 flex items-center justify-center">
            {chatOpen ? (
              <div className="w-full h-full">
                <DocumentUploadChat 
                  document={selectedDocument} 
                  onBack={() => setChatOpen(false)}
                  onClose={() => setChatOpen(false)}
                  onComplete={handleDocumentComplete}
                  onNext={handleNextDocument}
                />
              </div>
            ) : (
              <div className="text-center max-w-md mx-auto">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <FileText size={32} className="text-w1-primary-dark" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-w1-primary-dark">Envie seus documentos</h3>
                <p className="text-gray-600 mb-6">
                  Selecione um documento da lista ao lado para iniciar o processo de upload.
                  Cada documento é necessário para validarmos e personalizarmos sua holding.
                </p>
                <Button
                  onClick={handleContinue}
                  className="bg-w1-primary-dark hover:bg-opacity-90"
                >
                  Continuar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCollection;
