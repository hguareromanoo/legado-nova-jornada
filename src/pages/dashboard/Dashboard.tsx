
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, FileText, CircleCheck, Building2, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();
  
  // Example data - in a real app these would come from an API
  const assets = {
    total: 3254895,
    growth: 8.34,
    breakdown: {
      properties: 1750000,
      investments: 1243895,
      other: 261000
    }
  };
  
  const recentAssets = [
    {
      id: 1,
      name: 'Imóvel Alphaville',
      location: 'São Paulo, SP',
      type: 'properties',
      value: 980000,
      change: 3.2,
      status: 'active',
      icon: <Building2 size={16} className="text-blue-400" />
    },
    {
      id: 2,
      name: 'Ações PETR4',
      location: 'Petrobras',
      type: 'investments',
      value: 354780,
      change: 8.7,
      status: 'active',
      icon: <BarChart2 size={16} className="text-purple-400" />
    },
    {
      id: 3,
      name: 'Sala Comercial',
      location: 'Rio de Janeiro, RJ',
      type: 'properties',
      value: 420000,
      change: -1.2,
      status: 'pending',
      icon: <Building2 size={16} className="text-blue-400" />
    }
  ];
  
  const upcomingEvents = [
    {
      id: 1,
      title: 'Reunião com Consultor',
      date: '15/06/2025',
      time: '14:00',
      icon: <Calendar size={18} className="text-blue-400" />
    },
    {
      id: 2,
      title: 'Revisão de Contrato',
      status: 'Pendente',
      icon: <FileText size={18} className="text-blue-400" />
    },
    {
      id: 3,
      title: 'Finalizar Documentação',
      status: 'Em andamento',
      icon: <CircleCheck size={18} className="text-blue-400" />
    }
  ];
  
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div>
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
      >
        <div className="col-span-1 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl p-5 backdrop-blur-sm border border-blue-500/30">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <div className="bg-blue-500/30 p-2 rounded-lg">
                <Building2 className="text-blue-300" />
              </div>
            </div>
            <button className="text-gray-400">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="1" fill="currentColor" />
                <circle cx="10" cy="6" r="1" fill="currentColor" />
                <circle cx="10" cy="14" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
          <h3 className="text-3xl font-bold text-white mb-1">{formatCurrency(assets.total)}</h3>
          <p className="text-gray-400 text-sm mb-4">Patrimônio total</p>
          <div className="flex items-center text-sm">
            <span className={`flex items-center ${assets.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d={assets.growth >= 0 ? "M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" : "M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {Math.abs(assets.growth)}%
            </span>
            <span className="text-gray-400 ml-2">este mês</span>
          </div>
        </div>
        
        <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Imóveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-3">{formatCurrency(assets.breakdown.properties)}</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">3 imóveis</span>
                  <span className="text-green-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    5.2%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Investimentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-3">{formatCurrency(assets.breakdown.investments)}</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">8 ativos</span>
                  <span className="text-green-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 2.5V9.5M6 2.5L3 5.5M6 2.5L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    12.8%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-gray-400">Outros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <div className="text-2xl font-bold mb-3">{formatCurrency(assets.breakdown.other)}</div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">2 ativos</span>
                  <span className="text-red-400 text-sm flex items-center">
                    <svg className="w-3 h-3 mr-1" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9.5V2.5M6 9.5L3 6.5M6 9.5L9 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    1.3%
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Ativos principais</h2>
            <Button 
              variant="outline"
              className="text-white border-gray-700 hover:bg-gray-700"
              onClick={() => navigate('/assets')}
            >
              Ver todos
            </Button>
          </div>
          
          <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-800">
                    <th className="text-left px-4 py-3 font-medium">Nome do Ativo</th>
                    <th className="text-left px-4 py-3 font-medium">Categoria</th>
                    <th className="text-right px-4 py-3 font-medium">Valor</th>
                    <th className="text-right px-4 py-3 font-medium">Variação</th>
                    <th className="text-right px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentAssets.map(asset => (
                    <tr key={asset.id} className="border-b border-gray-800">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                            {asset.icon}
                          </div>
                          <div>
                            <p className="font-medium">{asset.name}</p>
                            <p className="text-gray-400 text-xs">{asset.location}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-300">
                        {asset.type === 'properties' ? 'Imóveis' : 
                         asset.type === 'investments' ? 'Investimentos' : 'Outros'}
                      </td>
                      <td className="px-4 py-4 text-right">{formatCurrency(asset.value)}</td>
                      <td className={`px-4 py-4 text-right ${asset.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          asset.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {asset.status === 'active' ? 'Ativo' : 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold">Próximos Passos</h2>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <Card key={event.id} className="bg-gray-800/30 border-gray-700/30">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="bg-blue-500/20 p-2 rounded-lg mr-3">
                      {event.icon}
                    </div>
                    <div>
                      <p className="font-medium">{event.title}</p>
                      {event.date ? (
                        <p className="text-sm text-gray-400">{event.date} • {event.time}</p>
                      ) : (
                        <p className="text-sm text-gray-400">{event.status}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate('/assistant')}
            >
              Consultar Assistente
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
