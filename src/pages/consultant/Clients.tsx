
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Search, 
  Plus, 
  Filter, 
  ArrowLeft 
} from "lucide-react";
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

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

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
          setFilteredClients(data);
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

  useEffect(() => {
    let result = clients;
    
    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(client => client.status === statusFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      result = result.filter(client => 
        client.name.toLowerCase().includes(lowerSearchTerm) ||
        (client.city && client.city.toLowerCase().includes(lowerSearchTerm)) ||
        (client.email && client.email.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    setFilteredClients(result);
  }, [clients, searchTerm, statusFilter]);

  return (
    <div>
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link to="/consultant" className="flex items-center text-gray-400 hover:text-white">
            <ArrowLeft size={16} className="mr-1" /> Voltar ao Dashboard
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-white mb-2">Meus Clientes</h1>
        <p className="text-gray-400">Gerencie e acompanhe todos os seus clientes e seus patrimônios</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative flex-grow max-w-md w-full">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar clientes..." 
            className="bg-gray-800/40 border-gray-700 pl-10 text-white" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button 
            variant={statusFilter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("all")}
          >
            Todos
          </Button>
          <Button 
            variant={statusFilter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("active")}
          >
            Ativos
          </Button>
          <Button 
            variant={statusFilter === "pending" ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter("pending")}
          >
            Pendentes
          </Button>
        </div>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 rounded-xl h-56 animate-pulse"/>
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-8 text-center">
          <h3 className="text-xl font-medium text-white mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-400 mb-4">Não encontramos clientes com os critérios selecionados</p>
          {searchTerm || statusFilter !== "all" ? (
            <Button onClick={() => { setSearchTerm(""); setStatusFilter("all"); }}>
              Limpar Filtros
            </Button>
          ) : (
            <Button>
              <Plus size={16} className="mr-2" /> Adicionar Cliente
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <Link 
              key={client.id} 
              to={`/consultant/clients/${client.id}`}
              className="group"
            >
              <Card className="bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 p-6 h-full hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="h-12 w-12 rounded-full bg-w1-primary-accent/20 text-w1-primary-accent flex items-center justify-center text-lg">
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
                    
                    {client.email && (
                      <p className="text-gray-400 text-sm mt-2">{client.email}</p>
                    )}
                    {client.phone && (
                      <p className="text-gray-400 text-sm">{client.phone}</p>
                    )}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
