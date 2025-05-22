
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend
} from "recharts";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Building2,
  FileText,
  Calendar,
  ChevronRight
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

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

const Consultant = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPatrimony: 0,
    activeClients: 0,
    totalGrowth: 0,
    pendingClients: 0,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock appointments for demo
  const upcomingAppointments = [
    { id: 1, client: "Maria Oliveira", date: "24/05/2025", time: "14:30", type: "Reunião Presencial" },
    { id: 2, client: "Carlos Santos", date: "26/05/2025", time: "10:00", type: "Videochamada" },
    { id: 3, client: "Ana Pereira", date: "27/05/2025", time: "16:15", type: "Reunião Presencial" },
  ];

  // Mock data for charts
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

  const COLORS = ['#4ECDC4', '#1A535C', '#FF6B6B', '#FFE66D'];

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          setClients(data);
          
          // Calculate statistics
          const totalPatrimony = data.reduce((sum, client) => sum + Number(client.total_patrimony), 0);
          const activeClients = data.filter(client => client.status === 'active').length;
          const avgGrowth = data.reduce((sum, client) => sum + Number(client.growth_rate), 0) / data.length;
          const pendingClients = data.filter(client => client.status === 'pending').length;
          
          setStats({
            totalPatrimony,
            activeClients,
            totalGrowth: avgGrowth,
            pendingClients,
          });
        }
      } catch (error) {
        console.error('Error fetching clients:', error);
        toast({
          title: 'Erro ao carregar clientes',
          description: 'Não foi possível carregar a lista de clientes.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchClients();
  }, [toast]);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Patrimônio Total</h3>
              <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalPatrimony)}</p>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <ArrowUpRight size={14} className="mr-1" />
              {stats.totalGrowth.toFixed(1)}%
            </span>
          </div>
        </Card>
        
        <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Clientes Ativos</h3>
              <p className="text-2xl font-bold text-white">{stats.activeClients}</p>
            </div>
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users size={20} className="text-blue-400" />
            </div>
          </div>
        </Card>
        
        <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-400">Requisição de Clientes</h3>
              <p className="text-2xl font-bold text-white">{stats.pendingClients}</p>
            </div>
            <div className="p-2 rounded-full bg-amber-500/20">
              <Users size={20} className="text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
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
                <Tooltip
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
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Clients Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Clientes Recentes</h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/consultant/clients')}>
            Ver Todos
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl h-44 animate-pulse"
              />
            ))
          ) : (
            clients.slice(0, 3).map((client) => (
              <Link 
                key={client.id} 
                to={`/consultant/clients/${client.id}`}
                className="group"
              >
                <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 h-full hover:bg-gray-700/30 transition-colors">
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="h-10 w-10 rounded-full bg-w1-primary-accent/20 text-w1-primary-accent flex items-center justify-center">
                          {client.name.charAt(0)}
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs ${
                          client.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {client.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-white mb-1">{client.name}</h3>
                      <p className="text-gray-400 text-sm">{client.city || 'Local não especificado'}</p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between mt-2 text-sm">
                        <span className="text-gray-400">Patrimônio:</span>
                        <span className="text-white font-medium">{formatCurrency(client.total_patrimony)}</span>
                      </div>
                      <div className="flex justify-between mt-1 text-sm">
                        <span className="text-gray-400">Crescimento:</span>
                        <span className={`font-medium flex items-center ${
                          client.growth_rate >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {client.growth_rate >= 0 ? (
                            <ArrowUpRight size={14} className="mr-1" />
                          ) : (
                            <ArrowDownRight size={14} className="mr-1" />
                          )}
                          {Math.abs(client.growth_rate)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Appointments Section */}
      <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">Próximos Compromissos</h3>
          <Button variant="outline" size="sm" onClick={() => navigate('/consultant/agenda')}>
            Ver Agenda
          </Button>
        </div>
        
        <div className="divide-y divide-gray-700/50">
          {upcomingAppointments.map((apt) => (
            <div key={apt.id} className="py-4 flex justify-between items-center">
              <div className="flex items-center">
                <div className="p-2 rounded-full bg-blue-500/20 mr-4">
                  <Calendar size={20} className="text-blue-400" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{apt.client}</h4>
                  <p className="text-gray-400 text-sm">{apt.date} às {apt.time} - {apt.type}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-500" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Consultant;
