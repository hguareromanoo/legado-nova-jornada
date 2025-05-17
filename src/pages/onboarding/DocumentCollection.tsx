
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Home, Building, CheckCircle, HelpCircle, Upload, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import VerticalRoadmap, { RoadmapStep } from '@/components/VerticalRoadmap';
import ChatModal from '@/components/ChatModal';
import { useOnboarding } from '@/contexts/OnboardingContext';

const DocumentCollection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { path, progress, completeStep } = useOnboarding();
  
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
  const [selectedDocument, setSelectedDocument] = useState<RoadmapStep | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [docsProgress, setDocsProgress] = useState(0);
  
  // Calculate progress based on completed documents
  React.useEffect(() => {
    const completedDocs = documents.filter(doc => doc.status === 'completed').length;
    setDocsProgress((completedDocs / documents.length) * 100);
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
          description: "Parabéns! Vamos prosseguir para a revisão dos documentos.",
        });
        
        // Complete the documents step in the onboarding flow
        completeStep('documents');
        
        // Navigate to document review
        navigate('/document-review');
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
  
  const handlePreviousDocument = () => {
    if (currentStep > 0) {
      const prevDoc = documents[currentStep - 1];
      setSelectedDocument(prevDoc);
    }
  };
  
  const handleContinue = () => {
    // Find the first non-completed document
    const currentDoc = documents.find(doc => doc.status === 'current');
    if (currentDoc) {
      handleStepSelect(currentDoc.id);
    } else if (docsProgress === 100) {
      // All documents completed, navigate to review page
      navigate('/document-review');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {path === 'ai' ? 'Envie os Documentos Necessários' : 'Documentos para sua Holding'}
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          {path === 'ai' 
            ? 'Com base no seu perfil, nossa IA identificou os documentos necessários para configurar sua holding. Por favor, envie cada um deles para prosseguirmos.' 
            : 'Com base na sua consulta, nosso especialista definiu os documentos necessários para estruturar sua holding. Por favor, envie cada um deles para análise.'}
        </p>
        <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg max-w-3xl mx-auto">
          Uma vez recebidos todos os documentos, nossa equipe irá analisá-los e preparar a estrutura ideal
          para sua holding familiar.
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
              Dúvidas Frequentes
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
      
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-8 mb-8">
        {/* Left side - Document list */}
        <motion.div 
          className="w-full md:w-1/3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden h-full">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-gray-900">Documentos Necessários</h2>
              <div className="flex justify-between text-sm text-gray-600 mt-2 mb-1">
                <span>Progresso</span>
                <span>{Math.round(docsProgress)}% completo</span>
              </div>
              <Progress value={docsProgress} className="h-2" />
            </div>
            
            <div className="divide-y">
              {documents.map((doc, index) => (
                <div
                  key={doc.id}
                  className={`p-4 flex items-center gap-4 cursor-pointer transition-colors ${
                    doc.status === 'locked' 
                      ? 'opacity-60 cursor-not-allowed' 
                      : 'hover:bg-gray-50'
                  } ${selectedDocument?.id === doc.id ? 'bg-blue-50' : ''}`}
                  onClick={() => doc.status !== 'locked' && handleStepSelect(doc.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    doc.status === 'completed' 
                      ? 'bg-green-100 text-green-600' 
                      : doc.status === 'current'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    {doc.status === 'completed' ? (
                      <CheckCircle size={20} />
                    ) : (
                      doc.icon
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className={`font-medium ${
                      doc.status === 'locked' ? 'text-gray-400' : 'text-gray-900'
                    }`}>
                      {doc.name}
                    </h3>
                    <p className={`text-sm ${
                      doc.status === 'locked' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {doc.description}
                    </p>
                  </div>
                  
                  {doc.status === 'completed' && <CheckCircle size={18} className="text-green-500" />}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Right side - Upload area or document details */}
        <motion.div 
          className="w-full md:w-2/3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden min-h-[400px] p-6 h-full flex flex-col">
            {selectedDocument ? (
              <div className="h-full flex flex-col">
                <div className="mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      {selectedDocument.icon}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold">{selectedDocument.name}</h2>
                      <p className="text-gray-600">{selectedDocument.description}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                    <h3 className="font-medium mb-2">O que é necessário:</h3>
                    <ul className="space-y-2 text-sm">
                      {selectedDocument.id === 'id' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Documento de identificação válido (RG, CNH ou Passaporte)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Documento deve estar dentro da validade</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Frente e verso do documento em uma única imagem ou PDF</span>
                          </li>
                        </>
                      )}
                      {selectedDocument.id === 'tax-return' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Declaração de Imposto de Renda completa</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Última declaração entregue à Receita Federal</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Incluir recibo de entrega</span>
                          </li>
                        </>
                      )}
                      {selectedDocument.id === 'property-deed' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Matrícula atualizada dos imóveis (até 30 dias)</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Escritura do imóvel</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>IPTU do ano corrente</span>
                          </li>
                        </>
                      )}
                      {selectedDocument.id === 'company-docs' && (
                        <>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Contrato Social ou Estatuto atualizado</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Última alteração contratual</span>
                          </li>
                          <li className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>Cartão CNPJ</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center flex-grow flex flex-col items-center justify-center">
                  <Upload size={40} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Arraste e solte o arquivo aqui</h3>
                  <p className="text-gray-500 mb-4">ou</p>
                  <Button 
                    onClick={() => {
                      // In a real app, this would open a file picker
                      setTimeout(() => {
                        toast({
                          title: "Documento enviado com sucesso!",
                          description: `${selectedDocument.name} foi enviado e está em análise.`,
                        });
                        handleDocumentComplete(selectedDocument.id);
                      }, 1500);
                    }}
                  >
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="mb-6">
                  <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <FileText size={36} className="text-gray-500" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-700">Envio de Documentos</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  Selecione um documento da lista para iniciar o processo de upload.
                  O envio de todos os documentos é necessário para configurarmos sua holding.
                </p>
                <Button
                  onClick={handleContinue}
                  className="bg-blue-600 hover:bg-blue-700"
                  size="lg"
                >
                  Começar Uploads
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Chat Modal using Sheet for center positioning */}
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        selectedDocument={selectedDocument}
        onDocumentComplete={handleDocumentComplete}
        onNextDocument={handleNextDocument}
        onPreviousDocument={handlePreviousDocument}
      />
    </div>
  );
};

export default DocumentCollection;
