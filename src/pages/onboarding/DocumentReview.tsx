
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, FileText, Home, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useOnboarding } from '@/contexts/OnboardingContext';

const DocumentReview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeOnboarding } = useUser();
  const { documents, progress, completeStep } = useOnboarding();
  const [reviewProgress, setReviewProgress] = useState(30); // Simulate review progress
  
  // Simulate document review progress
  useEffect(() => {
    const interval = setInterval(() => {
      setReviewProgress(prev => {
        const newProgress = prev + 5;
        if (newProgress >= 100) {
          clearInterval(interval);
          return 100;
        }
        return newProgress;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  // When review is complete
  useEffect(() => {
    if (reviewProgress === 100) {
      // Mark documents step as complete
      completeStep('documents');
    }
  }, [reviewProgress, completeStep]);
  
  const handleFinalize = () => {
    // Complete onboarding
    completeOnboarding();
    
    toast({
      title: "Parabéns! Sua holding está pronta.",
      description: "Você completou o processo de abertura da holding com sucesso.",
    });
    
    // Navigate to dashboard
    navigate('/dashboard');
  };
  
  const getDocumentStatusIcon = (status) => {
    switch(status) {
      case 'approved':
        return <CheckCircle2 size={20} className="text-green-400" />;
      case 'rejected':
        return <AlertCircle size={20} className="text-red-400" />;
      case 'uploaded':
        return <Clock size={20} className="text-blue-400" />;
      default:
        return <Clock size={20} className="text-gray-400" />;
    }
  };
  
  const getDocumentIcon = (type) => {
    switch(type) {
      case 'property':
        return <Home size={20} className="text-blue-400" />;
      case 'company':
        return <Building2 size={20} className="text-purple-400" />;
      default:
        return <FileText size={20} className="text-blue-400" />;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <motion.div 
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Revisão de Documentos
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Nossa equipe está analisando seus documentos para finalizar o processo de abertura da sua holding.
          Este processo pode levar até 48 horas.
        </p>
      </motion.div>
      
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden mb-8">
        <div className="p-6 bg-blue-50 border-b border-blue-100">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                <FileText size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Análise de Documentação</h2>
                <p className="text-gray-600">
                  {reviewProgress < 100 
                    ? 'Documentos em análise por nossa equipe' 
                    : 'Análise concluída! Sua holding está pronta para criação'}
                </p>
              </div>
            </div>
            
            <div className="bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
              <span className="font-medium">{reviewProgress}%</span> concluído
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso da análise</span>
              <span>{reviewProgress}%</span>
            </div>
            <Progress value={reviewProgress} className="h-2" />
          </div>
          
          <div className="space-y-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-3">Status dos documentos:</h3>
            
            {documents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Nenhum documento encontrado. Volte para a etapa de coleta de documentos.
              </div>
            ) : (
              documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg border bg-gray-50">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {getDocumentIcon(doc.type)}
                  </div>
                  
                  <div className="flex-grow">
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-500">
                      {doc.uploadDate ? `Enviado em ${new Date(doc.uploadDate).toLocaleDateString()}` : 'Pendente de envio'}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border flex items-center justify-center">
                      {getDocumentStatusIcon(doc.status)}
                    </div>
                    <span className="text-sm whitespace-nowrap">
                      {doc.status === 'approved' ? 'Aprovado' :
                       doc.status === 'rejected' ? 'Rejeitado' : 
                       doc.status === 'uploaded' ? 'Em análise' : 'Pendente'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {reviewProgress === 100 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 bg-green-50 border border-green-100 rounded-lg text-center"
            >
              <CheckCircle2 size={50} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">
                Análise concluída com sucesso!
              </h3>
              <p className="text-green-700 mb-6">
                Todos os documentos necessários foram aprovados e sua holding está pronta para ser criada.
              </p>
              <Button 
                size="lg"
                onClick={handleFinalize}
                className="bg-green-600 hover:bg-green-700"
              >
                Finalizar e acessar sua holding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="font-medium text-gray-900 mb-4">O que acontece depois?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={22} className="text-blue-600" />
            </div>
            <h4 className="font-medium">Aprovação</h4>
            <p className="text-sm text-gray-600">
              Nossa equipe revisará todos os documentos enviados
            </p>
          </div>
          
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <FileText size={22} className="text-blue-600" />
            </div>
            <h4 className="font-medium">Documentação</h4>
            <p className="text-sm text-gray-600">
              Preparamos toda a documentação legal da sua holding
            </p>
          </div>
          
          <div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
              <Building2 size={22} className="text-blue-600" />
            </div>
            <h4 className="font-medium">Implementação</h4>
            <p className="text-sm text-gray-600">
              Registro e implementação completa da estrutura da holding
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentReview;
