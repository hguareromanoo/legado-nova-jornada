
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel
} from '@/components/ui/sidebar';
import { Home, FileText, BarChart2, Settings, Users, User, LogIn, Calendar, CircleCheck, MessageSquare, Building2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import VerticalRoadmap, { RoadmapStep } from '@/components/VerticalRoadmap';
import ChatModal from '@/components/ChatModal';
import { useToast } from '@/hooks/use-toast';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { motion } from 'framer-motion';

const Members = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentStep, completeStep } = useOnboarding();
  
  // State para gerenciar o status da holding
  const [holdingStatus, setHoldingStatus] = useState<'document_collection' | 'in_progress' | 'completed'>('document_collection');
  
  // Buscar o status da holding do localStorage ou alguma outra fonte
  useEffect(() => {
    const storedHoldingSetupCompleted = localStorage.getItem('holdingSetupCompleted');
    const storedDocumentsCompleted = localStorage.getItem('documentsCompleted');
    
    if (storedHoldingSetupCompleted === 'true') {
      setHoldingStatus('completed');
    } else if (storedDocumentsCompleted === 'true') {
      setHoldingStatus('in_progress');
    } else {
      setHoldingStatus('document_collection');
    }
  }, []);
  
  // State para o fluxo de documentos
  const [documents, setDocuments] = useState<RoadmapStep[]>([
    { 
      id: 'identity',
      name: 'Documentos de Identidade',
      description: 'RG e CPF de todos os sócios',
      icon: <User size={16} className="text-blue-300" />,
      status: 'completed'
    },
    { 
      id: 'address',
      name: 'Comprovante de Endereço',
      description: 'Conta de luz, água ou telefone',
      icon: <Home size={16} className="text-blue-300" />,
      status: 'current'
    },
    { 
      id: 'company',
      name: 'Contrato Social',
      description: 'Ou estatuto da empresa',
      icon: <FileText size={16} className="text-blue-300" />,
      status: 'locked'
    },
    { 
      id: 'realestate',
      name: 'Documentos dos Imóveis',
      description: 'Escrituras e matrículas',
      icon: <Building2 size={16} className="text-blue-300" />,
      status: 'locked'
    }
  ]);
  
  const [currentDocStep, setCurrentDocStep] = useState(1);
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<RoadmapStep | null>(null);
  const [docsProgress, setDocsProgress] = useState(0);
  
  // Calcular progresso com base nos documentos completados
  useEffect(() => {
    const completedDocs = documents.filter(doc => doc.status === 'completed').length;
    setDocsProgress((completedDocs / documents.length) * 100);
  }, [documents]);

  const handleDocumentSelect = (documentId: string) => {
    const document = documents.find(step => step.id === documentId);
    if (document && document.status !== 'locked') {
      setSelectedDocument(document);
      setChatModalOpen(true);
    } else if (document?.status === 'locked') {
      toast({
        title: "Documento bloqueado",
        description: "Complete os documentos anteriores primeiro.",
      });
    }
  };

  const handleDocumentComplete = (documentId: string) => {
    toast({
      title: "Documento enviado com sucesso!",
      description: "Seu documento foi recebido e está em análise.",
    });
    
    setDocuments(docs => docs.map((doc, index) => {
      if (doc.id === documentId) {
        return { ...doc, status: 'completed' };
      }
      
      // Set next document as current
      if (index === currentDocStep + 1) {
        return { ...doc, status: 'current' };
      }
      
      return doc;
    }));
    
    // Move to next step
    setCurrentDocStep(prev => prev + 1);
    
    // Check if all documents are completed
    setTimeout(() => {
      const allCompleted = documents.length === currentDocStep + 1;
      if (allCompleted) {
        // Set the flag for completed documents
        localStorage.setItem('documentsCompleted', 'true');
        
        toast({
          title: "Todos os documentos enviados!",
          description: "Parabéns! Vamos agendar sua reunião com um consultor.",
        });
        
        // Complete the documents step
        completeStep('documents');
        
        // Update holding status
        setHoldingStatus('in_progress');
      }
    }, 1000);
    
    // In a real app, we would update the status on the server
    setChatModalOpen(false);
  };

  const handleNextDocument = () => {
    const currentIndex = documents.findIndex(doc => doc.id === selectedDocument?.id);
    if (currentIndex < documents.length - 1) {
      setSelectedDocument(documents[currentIndex + 1]);
    }
  };

  const handlePreviousDocument = () => {
    const currentIndex = documents.findIndex(doc => doc.id === selectedDocument?.id);
    if (currentIndex > 0) {
      setSelectedDocument(documents[currentIndex - 1]);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  // Renderizar o conteúdo principal com base no status da holding
  const renderMainContent = () => {
    if (holdingStatus === 'document_collection') {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Processo de Criação da Holding</h2>
            <p className="text-gray-300 mb-6">
              Estamos no processo de envio de documentos. Por favor, envie todos os documentos solicitados.
            </p>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Progresso da documentação:</span>
                <span>{Math.round(docsProgress)}% completo</span>
              </div>
              <Progress value={docsProgress} className="h-2" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h3 className="text-xl font-semibold mb-4 text-white">Documentos Necessários</h3>
                <p className="text-gray-300 mb-6">
                  Selecione um documento para enviar ou continue de onde parou.
                </p>
                
                {/* Grid de cartões de documentos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        doc.status === 'locked' 
                          ? 'bg-gray-800/30 border-gray-700/30 opacity-60 cursor-not-allowed' 
                          : doc.status === 'completed'
                            ? 'bg-w1-primary-dark/20 border-w1-primary-dark/30 hover:bg-w1-primary-dark/30'
                            : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70'
                      }`}
                      onClick={() => doc.status !== 'locked' && handleDocumentSelect(doc.id)}
                    >
                      <div className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          doc.status === 'completed' 
                            ? 'bg-blue-500/30' 
                            : doc.status === 'current' 
                              ? 'bg-blue-500/20 ring-2 ring-blue-400' 
                              : 'bg-gray-800/70'
                        }`}>
                          {doc.status === 'completed' ? (
                            <CircleCheck size={20} className="text-blue-400" />
                          ) : (
                            <div className="text-center">
                              {doc.icon}
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <h4 className={`font-medium ${
                            doc.status === 'completed' ? 'text-blue-400' : 'text-white'
                          }`}>{doc.name}</h4>
                          <p className="text-sm text-gray-300">{doc.description}</p>
                          
                          {doc.status === 'current' && (
                            <Button 
                              variant="w1Primary" 
                              size="sm" 
                              className="mt-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDocumentSelect(doc.id);
                              }}
                            >
                              <Upload size={14} className="mr-1" />
                              Enviar Documento
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h2 className="text-xl font-semibold mb-4 text-white">Trilha de Abertura da Holding</h2>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-w1-primary-accent/20 rounded-lg border border-w1-primary-accent/30">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-w1-primary-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-w1-primary-accent">Consulta Inicial</p>
                      <p className="text-sm text-gray-300">Concluído</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-w1-primary-accent/10 rounded-lg border border-w1-primary-accent/20">
                    <div className="bg-w1-primary-accent/10 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-w1-primary-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-w1-primary-accent">Definição de Estrutura</p>
                      <p className="text-sm text-gray-300">Concluído</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      <FileText size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Envio de Documentos</p>
                      <p className="text-sm text-gray-300">Em andamento</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-gray-700/20 p-2 rounded-lg mr-3">
                      <Calendar size={18} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Reunião com Consultor</p>
                      <p className="text-sm text-gray-300">Próxima etapa</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-gray-700/20 p-2 rounded-lg mr-3">
                      <Building2 size={18} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Abertura da Empresa</p>
                      <p className="text-sm text-gray-300">Pendente</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-gray-700/20 p-2 rounded-lg mr-3">
                      <Users size={18} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Transferência de Ativos</p>
                      <p className="text-sm text-gray-300">Pendente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (holdingStatus === 'in_progress') {
      return (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Processo de Criação da Holding</h2>
            <p className="text-gray-300 mb-6">
              Seus documentos foram recebidos e estão sendo analisados por nossa equipe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h3 className="text-xl font-semibold mb-4 text-white">Próximos Passos</h3>
                
                <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-blue-400" />
                    <h4 className="font-medium text-white">Reunião com Consultor Agendada</h4>
                  </div>
                  <p className="text-gray-300">15/06/2025 às 14:00</p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="w1Primary">
                      Adicionar ao Calendário
                    </Button>
                    <Button size="sm" variant="w1Secondary">
                      Reagendar
                    </Button>
                  </div>
                </div>
                
                <h4 className="font-medium text-white mb-3">Checklist para reunião:</h4>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <CircleCheck size={12} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300">Enviar todos os documentos solicitados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <CircleCheck size={12} className="text-blue-400" />
                    </div>
                    <span className="text-gray-300">Revisar proposta inicial de estrutura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-xs text-gray-300">3</span>
                    </div>
                    <span className="text-gray-300">Preparar dúvidas sobre o processo</span>
                  </div>
                </div>
                
                <Button variant="w1Primary" className="mt-2">
                  Preparar-se para a Reunião
                </Button>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h2 className="text-xl font-semibold mb-4 text-white">Trilha de Abertura da Holding</h2>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-w1-primary-accent/20 rounded-lg border border-w1-primary-accent/30">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-w1-primary-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-w1-primary-accent">Consulta Inicial</p>
                      <p className="text-sm text-gray-300">Concluído</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-w1-primary-accent/20 rounded-lg border border-w1-primary-accent/30">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-w1-primary-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-w1-primary-accent">Definição de Estrutura</p>
                      <p className="text-sm text-gray-300">Concluído</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-w1-primary-accent/20 rounded-lg border border-w1-primary-accent/30">
                    <div className="bg-w1-primary-accent/20 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-w1-primary-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-w1-primary-accent">Envio de Documentos</p>
                      <p className="text-sm text-gray-300">Concluído</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      <Calendar size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Reunião com Consultor</p>
                      <p className="text-sm text-gray-300">Em andamento</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-gray-700/20 p-2 rounded-lg mr-3">
                      <Building2 size={18} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Abertura da Empresa</p>
                      <p className="text-sm text-gray-300">Pendente</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-gray-700/20 p-2 rounded-lg mr-3">
                      <Users size={18} className="text-gray-300" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-300">Transferência de Ativos</p>
                      <p className="text-sm text-gray-300">Pendente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      // Holding completa - mostrar dashboard
      return (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-white">Dashboard da Holding</h2>
            <p className="text-gray-300 mb-6">
              Acompanhe o desempenho e as informações da sua holding.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="col-span-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-5 backdrop-blur-sm border border-blue-500/30">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <div className="bg-blue-500/30 p-2 rounded-lg">
                    <Building2 className="text-blue-300" />
                  </div>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">R$ 3.254.895</h3>
              <p className="text-gray-300 text-sm mb-4">Patrimônio total</p>
              <div className="flex items-center text-sm">
                <span className="text-green-400 flex items-center">
                  <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  8.34%
                </span>
                <span className="text-gray-300 ml-2">este mês</span>
              </div>
            </div>
            
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-300 text-sm">Imóveis</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">R$ 1.750.000</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">3 imóveis</span>
                  <span className="text-green-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    5.2%
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-300 text-sm">Investimentos</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">R$ 1.243.895</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">8 ativos</span>
                  <span className="text-green-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    12.8%
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-800/30 p-5 rounded-2xl backdrop-blur-sm border border-gray-700/30">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-gray-300 text-sm">Outros</div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">R$ 261.000</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 text-sm">2 ativos</span>
                  <span className="text-red-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    1.3%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h3 className="text-xl font-semibold mb-4 text-white">Estrutura Societária</h3>
                <div className="bg-gray-700/30 p-6 rounded-lg border border-gray-700/50 flex items-center justify-center h-60">
                  <div className="text-center">
                    <Building2 size={40} className="text-gray-300 mx-auto mb-2" />
                    <h4 className="text-lg font-medium text-white mb-1">Holding Familiar ABC</h4>
                    <p className="text-gray-300">Visualização em desenvolvimento</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h3 className="text-xl font-semibold mb-4 text-white">Próximos Passos</h3>
                <div className="space-y-4">
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      <Calendar size={18} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Reunião Trimestral</p>
                      <p className="text-sm text-gray-300">28/06/2025 • 10:00</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-yellow-500/20 p-2 rounded-lg mr-3">
                      <FileText size={18} className="text-yellow-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Declaração de IR</p>
                      <p className="text-sm text-gray-300">Prazo: 31/05/2025</p>
                    </div>
                  </div>
                  <div className="flex items-start p-3 bg-gray-700/20 rounded-lg border border-gray-700/30">
                    <div className="bg-green-500/20 p-2 rounded-lg mr-3">
                      <CircleCheck size={18} className="text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Revisão de Investimentos</p>
                      <p className="text-sm text-gray-300">Concluído em 15/04/2025</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-300">Área de Membros</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'dashboard'} 
                    onClick={() => setActiveTab('dashboard')}
                    tooltip="Sua Holding"
                  >
                    <Home />
                    <span>Sua Holding</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'assets'} 
                    onClick={() => navigate('/assets')}
                    tooltip="Ativos"
                  >
                    <BarChart2 />
                    <span>Ativos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'assistant'} 
                    onClick={() => setActiveTab('assistant')}
                    tooltip="Chat Assistente"
                  >
                    <MessageSquare />
                    <span>Chat Assistente</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'documents'} 
                    onClick={() => setActiveTab('documents')}
                    tooltip="Documentos"
                  >
                    <FileText />
                    <span>Documentos</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'structure'} 
                    onClick={() => setActiveTab('structure')}
                    tooltip="Estrutura Societária"
                  >
                    <Users />
                    <span>Estrutura Societária</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            
            <SidebarGroup>
              <SidebarGroupLabel>Conta</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'profile'} 
                    onClick={() => setActiveTab('profile')}
                    tooltip="Perfil"
                  >
                    <User />
                    <span>Perfil</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'settings'} 
                    onClick={() => setActiveTab('settings')}
                    tooltip="Configurações"
                  >
                    <Settings />
                    <span>Configurações</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout}
                    tooltip="Sair"
                  >
                    <LogIn />
                    <span>Sair</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter>
            <div className="p-4 text-center text-xs text-gray-300">
              W1 Consultoria Patrimonial © 2024
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Dashboard Content */}
          {activeTab === 'dashboard' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">Sua Holding</h1>
                  <p className="text-gray-300">
                    {holdingStatus === 'completed' 
                      ? 'Gerencie e acompanhe sua holding familiar' 
                      : 'Acompanhe o processo de abertura da sua holding'}
                  </p>
                </div>
                <SidebarTrigger />
              </header>

              {renderMainContent()}
            </div>
          )}
          
          {/* Outros tabs mantêm seu conteúdo original */}
          {activeTab !== 'dashboard' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {activeTab === 'assets' && 'Ativos'}
                    {activeTab === 'documents' && 'Documentos'}
                    {activeTab === 'structure' && 'Estrutura Societária'}
                    {activeTab === 'assistant' && 'Chat Assistente'}
                    {activeTab === 'profile' && 'Perfil'}
                    {activeTab === 'settings' && 'Configurações'}
                  </h1>
                  <p className="text-gray-300">
                    {activeTab === 'assets' && 'Gerencie seus ativos patrimoniais'}
                    {activeTab === 'documents' && 'Gerencie seus documentos'}
                    {activeTab === 'structure' && 'Visualize a estrutura da sua holding'}
                    {activeTab === 'assistant' && 'Tire suas dúvidas com nosso consultor virtual'}
                    {activeTab === 'profile' && 'Gerencie suas informações pessoais'}
                    {activeTab === 'settings' && 'Configure sua conta'}
                  </p>
                </div>
                <SidebarTrigger />
              </header>
              
              <div className="text-center p-12">
                <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700/30 inline-block">
                  {activeTab === 'assets' && <BarChart2 size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'documents' && <FileText size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'structure' && <Users size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'assistant' && <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'profile' && <User size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'settings' && <Settings size={48} className="mx-auto mb-4 text-gray-300" />}
                  
                  <h2 className="text-xl font-medium mb-2 text-white">
                    Conteúdo de {activeTab} em desenvolvimento
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Esta seção será implementada em breve.
                  </p>
                  
                  <Button 
                    variant="w1Primary" 
                    onClick={() => setActiveTab('dashboard')}
                  >
                    Voltar para Sua Holding
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
      
      {/* Chat Modal para upload de documentos */}
      <ChatModal 
        isOpen={chatModalOpen}
        onClose={() => setChatModalOpen(false)}
        selectedDocument={selectedDocument}
        onDocumentComplete={handleDocumentComplete}
        onNextDocument={handleNextDocument}
        onPreviousDocument={handlePreviousDocument}
      />
    </SidebarProvider>
  );
};

export default Members;
