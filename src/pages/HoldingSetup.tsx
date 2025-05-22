import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import { 
  Home, 
  FileText, 
  Settings, 
  User, 
  LogIn, 
  MessageSquare, 
  Upload,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { DocumentRecommendationsResponse, DocumentRecommendation } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

const HoldingSetup = () => {
  const [activeTab, setActiveTab] = useState('documents');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useUser();
  
  // Estados para documentos
  const [documentData, setDocumentData] = useState<DocumentRecommendationsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para upload e progresso
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Recuperar sessionId e dados de documentos
  useEffect(() => {
    const initializeDocuments = async () => {
      try {
        setLoading(true);
        
        // Tentar recuperar dados passados via state
        const passedData = location.state?.documentData as DocumentRecommendationsResponse;
        
        if (passedData) {
          console.log('📋 Usando dados passados via navegação:', passedData);
          setDocumentData(passedData);
          initializeUploadStatus(passedData.recommendations);
        } else {
          // Fallback: tentar recuperar sessionId do localStorage
          const userId = localStorage.getItem('currentUserId');
          const sessionId = userId ? localStorage.getItem(`chatSessionId_${userId}`) : null;
          
          if (sessionId) {
            console.log('📋 Buscando documentos para sessão:', sessionId);
            const data = await api.getDocumentRecommendations(sessionId);
            setDocumentData(data);
            initializeUploadStatus(data.recommendations);
          } else {
            throw new Error('Sessão não encontrada. Por favor, refaça o onboarding.');
          }
        }
        
      } catch (err) {
        console.error('Erro ao carregar documentos:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar documentos');
        
        toast({
          title: "Erro ao carregar documentos",
          description: "Não foi possível carregar a lista de documentos. Tente novamente.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeDocuments();
  }, [location.state, toast]);

  // Inicializar status de upload
  const initializeUploadStatus = (recommendations: DocumentRecommendation[]) => {
    const initialStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'> = {};
    recommendations.forEach(doc => {
      initialStatus[doc.document_key] = 'pending';
    });
    setUploadStatus(initialStatus);
  };

  // Calcular progresso do upload
  useEffect(() => {
    if (!documentData) return;
    
    const uploadedCount = Object.values(uploadStatus).filter(status => status === 'uploaded').length;
    const progress = (uploadedCount / documentData.total_documents) * 100;
    setUploadProgress(progress);
  }, [uploadStatus, documentData]);

  // Função para fazer upload de documento
  const handleDocumentUpload = (documentKey: string, recommendationId: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.jpg,.jpeg,.png';
    fileInput.multiple = false;
    
    fileInput.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await processDocumentUpload(documentKey, recommendationId, file);
      }
    };
    
    fileInput.click();
  };

  // Processar upload do documento para o Supabase
  const processDocumentUpload = async (documentKey: string, recommendationId: string, file: File) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }
      
      setUploadStatus(prev => ({ ...prev, [documentKey]: 'uploading' }));
      
      // Obter extensão do arquivo
      const fileExtension = file.name.split('.').pop() || '';
      
      // Criar nome do arquivo no formato solicitado: <document-key>-<user_id>-<recommendation_id>.[extensão]
      const fileName = `${documentKey}-${user.id}-${recommendationId}.${fileExtension}`;
      
      // Upload do arquivo para o bucket 'documents' no Supabase
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Sobrescrever se já existir
        });
      
      if (error) {
        console.error('Erro no upload:', error);
        setUploadStatus(prev => ({ ...prev, [documentKey]: 'error' }));
        
        toast({
          title: "Erro no upload",
          description: `Erro ao enviar o documento: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      setUploadStatus(prev => ({ ...prev, [documentKey]: 'uploaded' }));
      
      toast({
        title: "Documento enviado com sucesso!",
        description: `O documento ${documentKey} foi enviado e está sendo processado.`,
      });
      
      console.log('Upload realizado com sucesso:', data);
      
      // Aqui você pode adicionar lógica para registrar o upload em uma tabela de documentos se necessário
      // Por exemplo, salvar os metadados do documento em uma tabela 'documents'
      
    } catch (error) {
      console.error('Erro durante o upload:', error);
      setUploadStatus(prev => ({ ...prev, [documentKey]: 'error' }));
      
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao enviar o documento. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  // Toggle expansão de card
  const toggleCardExpansion = (cardId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  // Agrupar documentos por categoria
  const groupDocumentsByCategory = (recommendations: DocumentRecommendation[]) => {
    const grouped: Record<string, DocumentRecommendation[]> = {};
    
    recommendations.forEach(doc => {
      if (!grouped[doc.category]) {
        grouped[doc.category] = [];
      }
      grouped[doc.category].push(doc);
    });
    
    return grouped;
  };

  // Obter nome e ícone da categoria
  const getCategoryInfo = (category: string) => {
    const categoryMap = {
      'pessoal': { name: '👤 Documentos Pessoais', icon: User },
      'familiar': { name: '👨‍👩‍👧‍👦 Documentos Familiares', icon: User },
      'imovel': { name: '🏠 Documentos de Imóveis', icon: Building2 },
      'empresa': { name: '🏢 Documentos de Empresas', icon: Building2 },
      'financeiro': { name: '💰 Documentos Financeiros', icon: FileText },
      'tributario': { name: '📊 Documentos Tributários', icon: FileText },
      'juridico': { name: '⚖️ Documentos Jurídicos', icon: FileText }
    };
    
    return categoryMap[category as keyof typeof categoryMap] || { 
      name: `📄 ${category.charAt(0).toUpperCase() + category.slice(1)}`, 
      icon: FileText 
    };
  };

  // Obter ícone de status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploaded': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'uploading': return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Upload className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleBackToMembers = () => {
    navigate('/members');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center text-white">
          <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Carregando documentos necessários...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center text-white">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => navigate('/onboarding/chat')} variant="w1Primary">
            Voltar ao Chat
          </Button>
        </div>
      </div>
    );
  }

  if (!documentData) return null;

  const groupedDocuments = groupDocumentsByCategory(documentData.recommendations);
  const uploadedCount = Object.values(uploadStatus).filter(status => status === 'uploaded').length;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <Sidebar>
          <SidebarHeader>
            <div className="p-4">
              <h2 className="text-xl font-bold text-white">W1 Consultoria</h2>
              <p className="text-sm text-gray-300">Abertura de Holding</p>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Processo</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    isActive={activeTab === 'documents'} 
                    onClick={() => setActiveTab('documents')}
                    tooltip="Envio de Documentos"
                  >
                    <FileText />
                    <span>Envio de Documentos</span>
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
            <div className="p-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToMembers}
                className="w-full mb-2"
              >
                <Home className="w-4 h-4 mr-2" />
                Voltar para Dashboard
              </Button>
              <div className="text-center text-xs text-gray-300">
                W1 Consultoria © 2024
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <SidebarInset className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          {/* Página de Envio de Documentos */}
          {activeTab === 'documents' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">Envio de Documentos</h1>
                  <p className="text-gray-300">
                    Olá, {documentData.metadata.client_name || 'Cliente'}! Envie os documentos necessários para sua holding.
                  </p>
                </div>
                <SidebarTrigger />
              </header>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Progresso do Envio</h3>
                    <Badge className="bg-blue-600 text-white">
                      {uploadedCount}/{documentData.total_documents} documentos
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Documentos enviados:</span>
                    <span>{Math.round(uploadProgress)}% completo</span>
                  </div>
                  <Progress 
                    value={uploadProgress} 
                    className="h-3 bg-gray-700" 
                    indicatorClassName="bg-w1-primary-accent"
                  />
                  
                  {/* Resumo por categoria */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(documentData.summary.by_category).map(([category, count]) => {
                      const categoryInfo = getCategoryInfo(category);
                      const categoryUploaded = documentData.recommendations
                        .filter(doc => doc.category === category)
                        .filter(doc => uploadStatus[doc.document_key] === 'uploaded').length;
                      
                      return (
                        <div key={category} className="text-center">
                          <div className="text-lg font-bold text-white">
                            {categoryUploaded}/{count}
                          </div>
                          <div className="text-xs text-gray-300">
                            {categoryInfo.name.replace(/^\p{Emoji}\s*/u, '')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Documentos por Categoria */}
              <div className="space-y-6">
                {Object.entries(groupedDocuments).map(([category, docs]) => {
                  const categoryInfo = getCategoryInfo(category);
                  const categoryUploaded = docs.filter(doc => uploadStatus[doc.document_key] === 'uploaded').length;
                  
                  return (
                    <div key={category} className="bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <categoryInfo.icon className="w-6 h-6 text-w1-primary-accent" />
                          <h3 className="text-xl font-semibold text-white">{categoryInfo.name}</h3>
                        </div>
                        <Badge variant="outline" className="text-gray-300">
                          {categoryUploaded}/{docs.length}
                        </Badge>
                      </div>
                      
                      <div className="grid gap-4">
                        {docs.map((doc) => {
                          const isExpanded = expandedCards.has(doc.document_key);
                          const status = uploadStatus[doc.document_key];
                          
                          return (
                            <Card key={doc.document_key} className="bg-gray-800/50 border-gray-700/50">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 flex-1">
                                    {getStatusIcon(status)}
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-white">{doc.name}</h4>
                                        <Badge variant={doc.priority >= 5 ? "destructive" : doc.priority >= 4 ? "default" : "secondary"}>
                                          {'★'.repeat(doc.priority)}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-gray-300">{doc.description}</p>
                                      
                                      {doc.item_description && (
                                        <p className="text-sm text-blue-400 mt-1">
                                          <strong>Item específico:</strong> {doc.item_description}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 ml-4">
                                    <Button
                                      onClick={() => handleDocumentUpload(doc.document_key, doc.recommendation_id)}
                                      disabled={status === 'uploading'}
                                      variant={status === 'uploaded' ? "outline" : "default"}
                                      size="sm"
                                    >
                                      {status === 'uploaded' ? 'Enviado' :
                                       status === 'uploading' ? 'Enviando...' :
                                       status === 'error' ? 'Tentar novamente' :
                                       'Enviar'}
                                    </Button>
                                    
                                    <Collapsible>
                                      <CollapsibleTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleCardExpansion(doc.document_key)}
                                        >
                                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                        </Button>
                                      </CollapsibleTrigger>
                                    </Collapsible>
                                  </div>
                                </div>
                                
                                <Collapsible open={isExpanded}>
                                  <CollapsibleContent className="mt-4 pt-4 border-t border-gray-700/50">
                                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                                      {doc.how_to_obtain && (
                                        <div>
                                          <strong className="text-gray-300">Como obter:</strong>
                                          <p className="text-gray-400 mt-1">{doc.how_to_obtain}</p>
                                        </div>
                                      )}
                                      
                                      {doc.processing_time && (
                                        <div>
                                          <strong className="text-gray-300">Prazo:</strong>
                                          <p className="text-gray-400 mt-1">{doc.processing_time}</p>
                                        </div>
                                      )}
                                      
                                      {doc.estimated_cost && (
                                        <div>
                                          <strong className="text-gray-300">Custo estimado:</strong>
                                          <p className="text-gray-400 mt-1">{doc.estimated_cost}</p>
                                        </div>
                                      )}
                                      
                                      <div>
                                        <strong className="text-gray-300">ID do documento:</strong>
                                        <p className="text-gray-400 mt-1 font-mono text-xs">{doc.document_key}</p>
                                      </div>
                                    </div>
                                    
                                    {doc.reason && (
                                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
                                        <strong className="text-blue-400">Por que é necessário:</strong>
                                        <p className="text-blue-300 mt-1">{doc.reason}</p>
                                      </div>
                                    )}
                                  </CollapsibleContent>
                                </Collapsible>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Resumo Final */}
              <div className="mt-8 bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
                <h3 className="text-lg font-semibold text-white mb-4">Resumo dos Documentos</h3>
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-w1-primary-accent">{documentData.total_documents}</div>
                    <div className="text-sm text-gray-300">Total de documentos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">{uploadedCount}</div>
                    <div className="text-sm text-gray-300">Enviados</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{documentData.summary.estimated_total_cost}</div>
                    <div className="text-sm text-gray-300">Custo estimado</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Outras abas */}
          {activeTab !== 'documents' && (
            <div className="p-6">
              <header className="flex justify-between items-center mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-white">
                    {activeTab === 'assistant' && 'Chat Assistente'}
                    {activeTab === 'profile' && 'Perfil'}
                    {activeTab === 'settings' && 'Configurações'}
                  </h1>
                  <p className="text-gray-300">
                    {activeTab === 'assistant' && 'Tire suas dúvidas sobre o processo'}
                    {activeTab === 'profile' && 'Gerencie suas informações pessoais'}
                    {activeTab === 'settings' && 'Configure sua conta'}
                  </p>
                </div>
                <SidebarTrigger />
              </header>
              
              <div className="text-center p-12">
                <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700/30 inline-block">
                  {activeTab === 'assistant' && <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'profile' && <User size={48} className="mx-auto mb-4 text-gray-300" />}
                  {activeTab === 'settings' && <Settings size={48} className="mx-auto mb-4 text-gray-300" />}
                  
                  <h2 className="text-xl font-medium mb-2 text-white">
                    {activeTab} em desenvolvimento
                  </h2>
                  <p className="text-gray-300 mb-4">
                    Esta seção será implementada em breve.
                  </p>
                  
                  <Button 
                    variant="w1Primary" 
                    onClick={() => setActiveTab('documents')}
                  >
                    Voltar para Documentos
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default HoldingSetup;
