
import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  BarChart2, 
  FileText, 
  MessageSquare, 
  Send,
  ArrowUpRight, 
  ArrowDownRight, 
  Clock,
  Building2,
  Wallet,
  Users
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  total_patrimony: number;
  growth_rate: number;
  status: string;
  last_update: string;
  created_at: string;
}

interface ChatMessage {
  id: string;
  message: string;
  sender_type: 'consultant' | 'user' | 'system';
  created_at: string;
  is_read: boolean;
}

const ClientDetail = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [consultantId, setConsultantId] = useState<string | null>(null);

  // Mock data for charts and documents
  const patrimonyChartData = [
    { month: 'Jan', value: 4500000 },
    { month: 'Fev', value: 4800000 },
    { month: 'Mar', value: 5200000 },
    { month: 'Abr', value: 5000000 },
    { month: 'Mai', value: 5400000 },
    { month: 'Jun', value: 5800000 },
    { month: 'Jul', value: 6100000 },
    { month: 'Ago', value: 6500000 },
  ];

  const assetDistributionData = [
    { name: 'Imóveis', value: 45 },
    { name: 'Investimentos', value: 30 },
    { name: 'Empresas', value: 15 },
    { name: 'Outros', value: 10 },
  ];

  const documents = [
    { id: 1, name: "Contrato Social.pdf", type: "PDF", size: "1.2 MB", date: "15/05/2025" },
    { id: 2, name: "Escritura Imóvel SP.pdf", type: "PDF", size: "3.4 MB", date: "12/04/2025" },
    { id: 3, name: "Relatório Fiscal 2024.xlsx", type: "XLSX", size: "0.8 MB", date: "01/03/2025" },
    { id: 4, name: "Certidão Negativa.pdf", type: "PDF", size: "0.5 MB", date: "20/02/2025" },
  ];

  const COLORS = ['#4ECDC4', '#1A535C', '#FF6B6B', '#FFE66D'];

  useEffect(() => {
    async function fetchClient() {
      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (clientError) throw clientError;

        if (clientData) {
          setClient(clientData);
        }

        // Since we don't have a consultants table, we'll use the user_id directly
        // from the authenticated user
        const currentUser = (await supabase.auth.getUser()).data.user;
        
        if (currentUser) {
          setConsultantId(currentUser.id);
          
          // For now, let's use mock chat messages since we don't have the consultant_chat_messages table
          const mockChatMessages: ChatMessage[] = [
            {
              id: '1',
              message: 'Olá, preciso de ajuda com a abertura da minha holding.',
              sender_type: 'user',
              created_at: '2025-05-20T10:30:00Z',
              is_read: true
            },
            {
              id: '2',
              message: 'Claro, posso ajudar com isso. Já enviou os documentos solicitados?',
              sender_type: 'consultant',
              created_at: '2025-05-20T10:35:00Z',
              is_read: true
            },
            {
              id: '3',
              message: 'Sim, enviei ontem. Aguardo os próximos passos.',
              sender_type: 'user',
              created_at: '2025-05-20T11:05:00Z',
              is_read: true
            }
          ];
          
          setChatMessages(mockChatMessages);
          
          // In the future, once we have the appropriate table in Supabase:
          // const { data: messagesData, error: messagesError } = await supabase
          //   .from('chat_messages')
          //   .select('*')
          //   .eq('consultant_id', currentUser.id)
          //   .eq('client_id', clientId)
          //   .order('created_at', { ascending: true });
          
          // if (!messagesError && messagesData) {
          //   setChatMessages(messagesData);
          // }
        }
      } catch (error) {
        console.error('Error fetching client:', error);
        toast({
          title: 'Erro ao carregar cliente',
          description: 'Não foi possível carregar os dados do cliente.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    if (clientId) {
      fetchClient();
    }
  }, [clientId, toast]);

  useEffect(() => {
    // Scroll to bottom of messages when chat updates
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !clientId || !consultantId) return;
    
    setSendingMessage(true);
    
    try {
      // For now, we'll just add the message to the state
      // In the future, we'll save to the database once we have the table
      const newChatMessage: ChatMessage = {
        id: Date.now().toString(),
        message: newMessage,
        sender_type: 'consultant',
        created_at: new Date().toISOString(),
        is_read: false
      };
      
      setChatMessages(prev => [...prev, newChatMessage]);
      setNewMessage("");
      
      // For future implementation when we have the table:
      // const { data, error } = await supabase
      //   .from('chat_messages')
      //   .insert({
      //     client_id: clientId,
      //     consultant_id: consultantId,
      //     message: newMessage,
      //     sender_type: 'consultant'
      //   })
      //   .select()
      //   .single();
        
      // if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Erro ao enviar mensagem',
        description: 'Não foi possível enviar sua mensagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setSendingMessage(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="bg-gray-800/30 h-8 w-32 animate-pulse rounded" />
        <div className="bg-gray-800/30 h-12 w-64 animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="bg-gray-800/30 h-40 animate-pulse rounded-xl" />
          <div className="bg-gray-800/30 h-40 animate-pulse rounded-xl" />
          <div className="bg-gray-800/30 h-40 animate-pulse rounded-xl" />
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl text-white mb-2">Cliente não encontrado</h2>
        <p className="text-gray-400 mb-4">Não foi possível encontrar o cliente solicitado.</p>
        <Button asChild>
          <Link to="/consultant/clients">Voltar para Clientes</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link to="/consultant/clients" className="flex items-center text-gray-400 hover:text-white">
          <ArrowLeft size={16} className="mr-1" /> Voltar para Clientes
        </Link>
      </Button>

      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center">
            <div className="h-16 w-16 rounded-full bg-w1-primary-accent/20 text-w1-primary-accent flex items-center justify-center text-xl mr-4">
              {client.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{client.name}</h1>
              <p className="text-gray-400">{client.city || 'Local não especificado'}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            {client.email && (
              <Button variant="outline" size="sm">
                Enviar Email
              </Button>
            )}
            {client.phone && (
              <Button variant="outline" size="sm">
                Ligar
              </Button>
            )}
            <Button>Agendar Reunião</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="bg-gray-800/40 border border-gray-700/30">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-gray-700/50">
            <BarChart2 size={16} className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="documents" className="data-[state=active]:bg-gray-700/50">
            <FileText size={16} className="mr-2" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="chat" className="data-[state=active]:bg-gray-700/50">
            <MessageSquare size={16} className="mr-2" />
            Chat
          </TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Financial Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Patrimônio Total</h3>
                  <p className="text-2xl font-bold text-white">{formatCurrency(client.total_patrimony)}</p>
                </div>
                <span className={`flex items-center ${
                  client.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {client.growth_rate >= 0 ? (
                    <ArrowUpRight size={20} />
                  ) : (
                    <ArrowDownRight size={20} />
                  )}
                </span>
              </div>
              <div className="mt-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  client.growth_rate >= 0 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {client.growth_rate >= 0 ? '+' : ''}{client.growth_rate}% este ano
                </span>
              </div>
            </Card>
            
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Holdings</h3>
                  <p className="text-2xl font-bold text-white">3</p>
                </div>
                <div className="p-2 rounded-full bg-blue-500/20">
                  <Building2 size={20} className="text-blue-400" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                <p>2 Empresas ativas</p>
                <p>1 Holding patrimonial</p>
              </div>
            </Card>
            
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-400">Documentos</h3>
                  <p className="text-2xl font-bold text-white">{documents.length}</p>
                </div>
                <div className="p-2 rounded-full bg-amber-500/20">
                  <FileText size={20} className="text-amber-400" />
                </div>
              </div>
              <div className="mt-4 text-xs text-gray-400">
                <p>Última atualização: {formatDate(client.last_update)}</p>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Evolução Patrimonial</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={patrimonyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis
                      stroke="#94a3b8"
                      tickFormatter={(value) => `R$${(value / 1000000).toFixed(1)}M`}
                    />
                    <RechartsTooltip
                      formatter={(value) => [`R$${(Number(value) / 1000000).toFixed(2)}M`, 'Patrimônio']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#4ECDC4"
                      strokeWidth={2}
                      dot={{ fill: '#4ECDC4', r: 4 }}
                      activeDot={{ r: 6, fill: '#4ECDC4' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
            
            <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Distribuição de Ativos</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={assetDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {assetDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Client Info */}
          <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Informações do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Nome</h4>
                <p className="text-white">{client.name}</p>
              </div>
              {client.email && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Email</h4>
                  <p className="text-white">{client.email}</p>
                </div>
              )}
              {client.phone && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Telefone</h4>
                  <p className="text-white">{client.phone}</p>
                </div>
              )}
              {client.city && (
                <div>
                  <h4 className="text-sm text-gray-400 mb-1">Cidade</h4>
                  <p className="text-white">{client.city}</p>
                </div>
              )}
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Status</h4>
                <p className="text-white">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                    client.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {client.status === 'active' ? 'Ativo' : 'Pendente'}
                  </span>
                </p>
              </div>
              <div>
                <h4 className="text-sm text-gray-400 mb-1">Cliente desde</h4>
                <p className="text-white">{formatDate(client.created_at)}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Documents Tab */}
        <TabsContent value="documents">
          <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white">Documentos</h3>
              <Button>
                Upload de Documento
              </Button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 text-gray-400 font-medium text-sm">Nome</th>
                    <th className="text-left py-3 text-gray-400 font-medium text-sm">Tipo</th>
                    <th className="text-left py-3 text-gray-400 font-medium text-sm">Tamanho</th>
                    <th className="text-left py-3 text-gray-400 font-medium text-sm">Data</th>
                    <th className="text-left py-3 text-gray-400 font-medium text-sm">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {documents.map(doc => (
                    <tr key={doc.id}>
                      <td className="py-4 text-white">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-2" />
                          {doc.name}
                        </div>
                      </td>
                      <td className="py-4 text-gray-400">{doc.type}</td>
                      <td className="py-4 text-gray-400">{doc.size}</td>
                      <td className="py-4 text-gray-400">{doc.date}</td>
                      <td className="py-4">
                        <Button variant="ghost" size="sm">
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat">
          <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
            <div className="flex flex-col h-[600px]">
              <div className="flex items-center pb-4 border-b border-gray-700">
                <div className="h-10 w-10 rounded-full bg-w1-primary-accent/20 text-w1-primary-accent flex items-center justify-center mr-3">
                  {client.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-white">{client.name}</h3>
                  <p className="text-xs text-gray-400">
                    {client.status === 'active' ? 'Cliente Ativo' : 'Cliente Pendente'}
                  </p>
                </div>
              </div>
              
              <div className="flex-grow overflow-y-auto py-4 space-y-4">
                {chatMessages.length === 0 ? (
                  <div className="text-center py-10">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                    <h3 className="text-white font-medium mb-1">Nenhuma mensagem ainda</h3>
                    <p className="text-gray-400 text-sm">
                      Envie uma mensagem para iniciar a conversa com este cliente.
                    </p>
                  </div>
                ) : (
                  chatMessages.map(msg => (
                    <div 
                      key={msg.id}
                      className={`flex ${msg.sender_type === 'consultant' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] px-4 py-2 rounded-xl ${
                          msg.sender_type === 'consultant' 
                            ? 'bg-w1-primary-accent text-gray-900' 
                            : 'bg-gray-700 text-white'
                        }`}
                      >
                        <p>{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender_type === 'consultant' 
                            ? 'text-gray-900/70' 
                            : 'text-gray-400'
                        }`}>
                          {formatDate(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <form 
                  className="flex gap-2" 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <input
                    type="text"
                    className="flex-grow bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-w1-primary-accent"
                    placeholder="Digite sua mensagem..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <span className="flex items-center">
                        <span className="animate-spin mr-2">
                          <Clock size={16} />
                        </span>
                        Enviando
                      </span>
                    ) : (
                      <>
                        <Send size={16} className="mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientDetail;
