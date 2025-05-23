
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Search,
  PlusCircle,
  User,
  ChevronRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface Client {
  id: string;
  name: string;
  email: string;
  total_patrimony: number;
  status: string;
  growth_rate: number;
  city?: string;
  last_activity?: string;
}

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      try {
        // In a real implementation, fetch from database
        // For now, using sample data
        const sampleClients: Client[] = [
          {
            id: "1",
            name: "Ana Silva",
            email: "ana@email.com",
            total_patrimony: 12500000,
            status: "active",
            growth_rate: 8.5,
            city: "São Paulo"
          },
          {
            id: "2",
            name: "Carlos Mendes",
            email: "carlos@email.com",
            total_patrimony: 8700000,
            status: "active",
            growth_rate: 4.2,
            city: "Rio de Janeiro"
          },
          {
            id: "3",
            name: "Maria Oliveira",
            email: "maria@email.com",
            total_patrimony: 15200000,
            status: "pending",
            growth_rate: -2.1,
            city: "Belo Horizonte"
          },
          {
            id: "4",
            name: "Pedro Santos",
            email: "pedro@email.com",
            total_patrimony: 6100000,
            status: "active",
            growth_rate: 6.8,
            city: "Brasília"
          },
          {
            id: "5",
            name: "Lucia Ferreira",
            email: "lucia@email.com",
            total_patrimony: 9300000,
            status: "pending",
            growth_rate: 1.5,
            city: "Campinas"
          }
        ];
        
        setClients(sampleClients);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client.city && client.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-white">Meus Clientes</h2>
          <p className="text-gray-400">Gerencie todos os seus clientes</p>
        </div>
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cliente..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-w1-primary-accent hover:bg-w1-primary-accent/90 text-w1-primary-dark">
            <PlusCircle className="mr-2 h-4 w-4" /> Novo Cliente
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 h-48 animate-pulse"
            />
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Link key={client.id} to={`/consultant/clients/${client.id}`}>
              <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-10 w-10 rounded-full bg-w1-primary-accent/20 text-w1-primary-accent flex items-center justify-center">
                      {client.name.charAt(0)}
                    </div>
                    <span 
                      className={`px-2.5 py-1 rounded-full text-xs ${
                        client.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {client.status === 'active' ? 'Ativo' : 'Pendente'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-white mb-1">{client.name}</h3>
                  <p className="text-gray-400 text-sm">{client.city || "Local não especificado"}</p>
                  
                  <div className="mt-auto space-y-2">
                    <div className="flex justify-between mt-4 text-sm">
                      <span className="text-gray-400">Patrimônio:</span>
                      <span className="text-white font-medium">{formatCurrency(client.total_patrimony)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
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
                    
                    <div className="flex justify-end items-center text-w1-primary-accent text-xs mt-2">
                      Ver detalhes <ChevronRight className="h-3 w-3 ml-1" />
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30 text-center">
          <User className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">Nenhum cliente encontrado</h3>
          <p className="text-gray-400">
            Não encontramos nenhum cliente com o termo "{searchQuery}"
          </p>
        </Card>
      )}
    </div>
  );
};

export default ClientsList;
