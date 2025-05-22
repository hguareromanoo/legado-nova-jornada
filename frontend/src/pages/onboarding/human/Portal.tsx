
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, CheckCircle2, Clock, FileText, Upload, ArrowRight, PlusCircle, MessageSquare } from 'lucide-react';
import { useOnboarding } from '@/contexts/OnboardingContext';

// Mock data for documents requested by the consultant
const requestedDocuments = [
  { 
    id: 'doc1', 
    name: 'RG/CPF dos sócios', 
    description: 'Cópias digitalizadas dos documentos de identificação de todos os sócios',
    status: 'pending'
  },
  { 
    id: 'doc2', 
    name: 'Certidão de casamento', 
    description: 'Certidão de casamento ou união estável, se aplicável',
    status: 'pending'
  },
  { 
    id: 'doc3', 
    name: 'Certidão de imóveis', 
    description: 'Certidões atualizadas dos imóveis a serem incluídos na holding',
    status: 'pending'
  },
  { 
    id: 'doc4', 
    name: 'Contratos sociais', 
    description: 'Contratos sociais de empresas já existentes, se houver',
    status: 'pending'
  },
];

// Mock timeline steps for holding implementation
const implementationSteps = [
  {
    id: 1,
    name: 'Consulta Inicial',
    description: 'Primeira conversa para entender seus objetivos',
    date: new Date(2023, 4, 15), // May 15, 2023
    completed: true,
  },
  {
    id: 2,
    name: 'Envio de Documentação',
    description: 'Upload dos documentos solicitados pelo consultor',
    date: null,
    completed: false,
  },
  {
    id: 3,
    name: 'Análise e Elaboração do Plano',
    description: 'Nossos especialistas analisam os documentos e elaboram proposta personalizada',
    date: null,
    completed: false,
  },
  {
    id: 4,
    name: 'Aprovação do Plano',
    description: 'Apresentação da proposta para sua aprovação',
    date: null,
    completed: false,
  },
  {
    id: 5,
    name: 'Implementação Jurídica',
    description: 'Registro de contratos e criação da estrutura definida',
    date: null,
    completed: false,
  },
];

// Mock messages from consultant
const consultantMessages = [
  {
    id: 1,
    date: new Date(2023, 4, 15, 16, 30), // May 15, 2023, 16:30
    content: 'Foi um prazer conversar com você hoje! Conforme discutimos, preparei uma lista dos documentos necessários para avançarmos com a estruturação da sua holding familiar. Por favor, envie-os através deste portal assim que possível.',
    sender: 'consultant',
  },
  {
    id: 2,
    date: new Date(2023, 4, 15, 16, 32), // May 15, 2023, 16:32
    content: 'Além disso, preparei um resumo da nossa conversa que está disponível na aba "Resumo da Consulta". Fique à vontade para revisá-lo e me avisar se tiver alguma dúvida ou se quiser adicionar algum ponto importante que discutimos.',
    sender: 'consultant',
  },
];

// Mock booking info for displaying consultation summary
const mockBookingInfo = {
  date: new Date(2023, 4, 15, 14, 0), // May 15, 2023, 14:00
  time: '14:00',
  type: 'online',
  consultant: {
    id: 1,
    name: 'Dra. Amanda Silva',
    specialty: 'Planejamento Patrimonial',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop',
  },
  summaryPoints: [
    'Estruturação de holding familiar para proteção patrimonial',
    'Preocupação com otimização tributária na transmissão de herança',
    'Inclusão de 3 imóveis residenciais e 1 comercial na estrutura',
    'Previsão de investimentos futuros em renda variável',
    'Necessidade de planejamento sucessório para 2 filhos'
  ]
};

const Portal = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { completeStep } = useOnboarding();
  
  const [documents, setDocuments] = useState(requestedDocuments);
  const [implementationProgress, setImplementationProgress] = useState(implementationSteps);
  const [messages, setMessages] = useState(consultantMessages);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('documents');
  
  // Check if user has completed the consultation - otherwise redirect
  useEffect(() => {
    const consultationCompleted = localStorage.getItem('humanConsultationCompleted');
    
    if (consultationCompleted !== 'true') {
      navigate('/onboarding/human/confirmation');
      toast({
        title: "Acesso não autorizado",
        description: "Você precisa completar sua consulta antes de acessar o portal.",
        variant: "destructive",
      });
    }
  }, [navigate, toast]);
  
  // Function to handle document upload
  const handleDocumentUpload = (docId: string) => {
    // In a real app, this would trigger a file upload UI
    // Here we'll just simulate a successful upload
    const updatedDocs = documents.map(doc => {
      if (doc.id === docId) {
        return { ...doc, status: 'uploaded' };
      }
      return doc;
    });
    
    setDocuments(updatedDocs);
    
    toast({
      title: "Documento enviado!",
      description: "Seu documento foi enviado com sucesso e está sendo analisado.",
    });
    
    // Check if all documents have been uploaded
    const allUploaded = updatedDocs.every(doc => doc.status !== 'pending');
    if (allUploaded) {
      // Update implementation progress
      const updatedProgress = implementationProgress.map(step => {
        if (step.id === 2) {
          return { ...step, completed: true, date: new Date() };
        }
        return step;
      });
      setImplementationProgress(updatedProgress);
      
      // Add a new message from consultant
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          {
            id: prev.length + 1,
            date: new Date(),
            content: 'Todos os documentos foram recebidos! Vamos iniciar a análise e elaboração do seu plano personalizado. Entraremos em contato em breve.',
            sender: 'consultant',
          }
        ]);
        
        // Show toast notification
        toast({
          title: "Todos os documentos enviados!",
          description: "Avançamos para a próxima etapa do processo.",
        });
      }, 1500);
    }
  };
  
  // Calculate overall progress
  const overallProgress = Math.round(
    (implementationProgress.filter(step => step.completed).length / implementationProgress.length) * 100
  );
  
  // Function to handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    // Add user message
    setMessages(prev => [
      ...prev, 
      {
        id: prev.length + 1,
        date: new Date(),
        content: newMessage,
        sender: 'user',
      }
    ]);
    
    setNewMessage('');
    
    // Simulate consultant response after delay
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        {
          id: prev.length + 1,
          date: new Date(),
          content: 'Obrigado por sua mensagem! Nosso consultor responderá em breve. Por favor, continue enviando os documentos solicitados enquanto isso.',
          sender: 'system',
        }
      ]);
    }, 1000);
  };
  
  // For demo purposes, show a "Proceed to Plan Approval" button after all docs are uploaded
  const canProceedToApproval = documents.every(doc => doc.status !== 'pending');
  
  const handleProceedToApproval = () => {
    // In a real app, this would be enabled based on backend progress status
    navigate('/onboarding/human/plan-approval');
  };
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Portal do Cliente
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Acompanhe o progresso da implementação da sua holding e envie os documentos solicitados.
        </p>
      </div>
      
      {/* Overall progress card */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-blue-600" />
            Progresso da Implementação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Status atual</span>
              <span className="font-medium">{overallProgress}% concluído</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>
          
          <div className="mt-6 space-y-4">
            {implementationProgress.map((step, index) => (
              <div key={step.id} className="flex items-start">
                <div className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${
                  step.completed ? 'bg-green-100 border-green-600' : 'bg-gray-100 border-gray-300'
                }`}>
                  <span className={`text-sm font-medium ${step.completed ? 'text-green-600' : 'text-gray-600'}`}>
                    {step.id}
                  </span>
                  
                  {/* Vertical connector line */}
                  {index < implementationProgress.length - 1 && (
                    <div className={`absolute top-8 left-1/2 h-8 w-px -translate-x-1/2 ${
                      step.completed && implementationProgress[index+1].completed 
                        ? 'bg-green-600' 
                        : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>
                
                <div className="ml-4 pb-8">
                  <div className="flex items-center">
                    <p className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-900'}`}>
                      {step.name}
                    </p>
                    {step.completed && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        Concluído
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{step.description}</p>
                  {step.date && (
                    <p className="mt-1 text-xs text-gray-500">
                      {format(step.date, "PPP 'às' HH:mm", { locale: ptBR })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50 border-t">
          <Button
            onClick={handleProceedToApproval}
            disabled={!canProceedToApproval}
            className="ml-auto bg-blue-600 hover:bg-blue-700"
          >
            {canProceedToApproval ? (
              <>Prosseguir para Aprovação do Plano <ArrowRight className="ml-2 h-4 w-4" /></>
            ) : (
              'Envie todos os documentos para continuar'
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {/* Tabs for documents, messages, and summary */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Documentos Solicitados
          </TabsTrigger>
          <TabsTrigger value="messages" className="flex items-center">
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens do Consultor
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center">
            <ClipboardCheck className="mr-2 h-4 w-4" />
            Resumo da Consulta
          </TabsTrigger>
        </TabsList>
        
        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Solicitados pelo Consultor</CardTitle>
              <CardDescription>
                Envie os documentos abaixo para avançarmos com a implementação da sua holding
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map(doc => (
                  <div key={doc.id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-500">{doc.description}</p>
                    </div>
                    <Button 
                      variant={doc.status === 'uploaded' ? 'outline' : 'default'}
                      onClick={() => handleDocumentUpload(doc.id)}
                      disabled={doc.status === 'uploaded'}
                      className={doc.status === 'uploaded' ? 'text-green-600 border-green-200' : ''}
                    >
                      {doc.status === 'uploaded' ? (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" /> 
                          Enviado
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" /> 
                          Enviar
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Comunicação com Seu Consultor</CardTitle>
              <CardDescription>
                Acompanhe as mensagens do seu consultor e envie suas dúvidas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto p-2">
                {messages.map(message => (
                  <div 
                    key={message.id} 
                    className={`p-3 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-50 ml-12' 
                        : message.sender === 'consultant'
                          ? 'bg-gray-100'
                          : 'bg-yellow-50'
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">
                        {message.sender === 'user' ? 'Você' : 
                         message.sender === 'consultant' ? 'Dra. Amanda Silva' : 
                         'Sistema'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(message.date, "dd/MM/yy HH:mm")}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                ))}
              </div>
              
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem aqui..."
                  className="flex-1 border p-2 rounded-md"
                />
                <Button type="submit" disabled={!newMessage.trim()}>Enviar</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Summary Tab */}
        <TabsContent value="summary">
          <Card>
            <CardHeader className="bg-gray-50 border-b">
              <div className="flex justify-between items-center">
                <CardTitle>Resumo da Consulta Inicial</CardTitle>
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {format(mockBookingInfo.date, "PPP", { locale: ptBR })}
                  <Clock className="ml-2 mr-1 h-4 w-4" />
                  {mockBookingInfo.time}
                </div>
              </div>
              <CardDescription>
                Consultor: {mockBookingInfo.consultant.name} - {mockBookingInfo.consultant.specialty}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-lg mb-2">Principais pontos discutidos:</h3>
                  <ul className="space-y-2">
                    {mockBookingInfo.summaryPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 mr-2"></span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium text-lg mb-2">Próximos passos:</h3>
                  <ol className="space-y-2 list-decimal ml-4">
                    <li className="pl-1">Enviar todos os documentos solicitados</li>
                    <li className="pl-1">Aguardar análise e elaboração do plano personalizado</li>
                    <li className="pl-1">Revisar e aprovar o plano proposto</li>
                    <li className="pl-1">Iniciar o processo de implementação jurídica</li>
                  </ol>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-blue-50 border-t border-blue-100">
              <div className="flex items-start space-x-2 text-sm text-blue-700 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 16v-4"></path>
                  <path d="M12 8h.01"></path>
                </svg>
                <p>Este resumo foi gerado pelo sistema com base em sua consulta. 
                Se notar qualquer imprecisão ou quiser adicionar informações, 
                utilize a aba de mensagens para comunicar-se com seu consultor.</p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Schedule new appointment card */}
      <Card className="mt-8 border-blue-100">
        <CardHeader className="bg-blue-50 border-b border-blue-100">
          <CardTitle className="text-blue-800">Precisa de ajuda adicional?</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <h3 className="font-medium text-lg">Agende uma nova consulta</h3>
              <p className="text-gray-600 mt-1">
                Se tiver dúvidas ou precisar de esclarecimentos adicionais, 
                agende uma nova conversa com seu consultor.
              </p>
            </div>
            <Button className="flex items-center" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Agendar Nova Consulta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Missing lucide icon component
const ClipboardCheck = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
};

export default Portal;
