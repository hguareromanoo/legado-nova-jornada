
import React, { useState, useEffect } from "react";
import { useUser } from "@/contexts/UserContext";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
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
  ResponsiveContainer 
} from "recharts";
import { 
  ArrowUpRight, 
  Users, 
  Calendar, 
  FileText,
  AlertTriangle
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const ConsultantDashboard = () => {
  const { user } = useUser();
  const [clientCount, setClientCount] = useState(0);
  const [totalPatrimony, setTotalPatrimony] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // Sample data for the charts
  const patrimonioData = [
    { name: "Jan", value: 4500000 },
    { name: "Fev", value: 4700000 },
    { name: "Mar", value: 5200000 },
    { name: "Abr", value: 5500000 },
    { name: "Mai", value: 5400000 },
    { name: "Jun", value: 5900000 },
  ];

  const clientesData = [
    { name: "Imóveis", value: 45 },
    { name: "Investimentos", value: 30 },
    { name: "Empresas", value: 15 },
    { name: "Outros", value: 10 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
  // Mock appointments
  const appointments = [
    { id: 1, client: "Ana Silva", date: "26/05/2025", time: "14:30", type: "Reunião de Planejamento" },
    { id: 2, client: "Carlos Mendes", date: "27/05/2025", time: "10:00", type: "Revisão Estrutural" },
    { id: 3, client: "Maria Oliveira", date: "28/05/2025", time: "16:15", type: "Assinatura de Documentos" },
  ];
  
  // Mock alerts
  const alerts = [
    { id: 1, client: "Pedro Santos", message: "Pendente assinar documentos de constituição", type: "warning" },
    { id: 2, client: "Lucia Ferreira", message: "Documentos enviados para revisão", type: "info" },
  ];

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // In a real implementation, we would fetch data from the database
        // For now, we'll just use mock data
        setClientCount(15);
        setTotalPatrimony(75000000); // R$75 milhões
        setLoading(false);
      } catch (error) {
        console.error("Error fetching client data:", error);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [user?.id]);

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-400">Total de Clientes</p>
              <h3 className="text-2xl font-bold text-white">{loading ? "..." : clientCount}</h3>
            </div>
            <div className="p-2 rounded-full bg-blue-500/20">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-400">Patrimônio Total</p>
              <h3 className="text-2xl font-bold text-white">
                {loading ? "..." : formatCurrency(totalPatrimony)}
              </h3>
            </div>
            <span className="bg-green-500/20 text-green-400 text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <ArrowUpRight size={14} className="mr-1" />
              8.5%
            </span>
          </div>
        </Card>
        
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-400">Próxima Reunião</p>
              <h3 className="text-2xl font-bold text-white">{appointments[0]?.date || "Nenhuma"}</h3>
              <p className="text-sm text-gray-400">{appointments[0]?.client || ""}</p>
            </div>
            <div className="p-2 rounded-full bg-amber-500/20">
              <Calendar className="h-5 w-5 text-amber-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <h3 className="text-lg font-medium text-white mb-4">Evolução Patrimonial</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={patrimonioData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis
                  stroke="#9CA3AF"
                  tickFormatter={(value) => `R$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value) => [`R$${(Number(value) / 1000000).toFixed(2)}M`, "Patrimônio"]}
                  contentStyle={{ backgroundColor: "#1F2937", color: "#F9FAFB", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10B981"
                  strokeWidth={2}
                  dot={{ fill: "#10B981", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <h3 className="text-lg font-medium text-white mb-4">Distribuição de Ativos</h3>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={clientesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {clientesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Appointments and Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="h-5 w-5 text-blue-400" />
            <h3 className="text-lg font-medium text-white">Próximas Reuniões</h3>
          </div>
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div key={apt.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{apt.client}</p>
                  <p className="text-sm text-gray-400">{apt.date} às {apt.time}</p>
                  <p className="text-xs text-gray-500">{apt.type}</p>
                </div>
                <div>
                  <span className="bg-blue-500/20 text-blue-400 text-xs px-2.5 py-1 rounded-full">
                    {apt.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gray-800/30 backdrop-blur-sm border border-gray-700/30">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <h3 className="text-lg font-medium text-white">Alertas</h3>
          </div>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="font-medium text-white">{alert.client}</p>
                  <p className="text-sm text-gray-400">{alert.message}</p>
                </div>
                <div>
                  <span className={`
                    ${alert.type === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-500/20 text-blue-400'}
                    text-xs px-2.5 py-1 rounded-full
                  `}>
                    {alert.type === 'warning' ? 'Pendente' : 'Informação'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsultantDashboard;
