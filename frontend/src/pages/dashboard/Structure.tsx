
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Users, Building, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Structure = () => {
  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400">
          Visualize e gerencie a estrutura societária da sua holding familiar.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-gray-800/30 border-gray-700/30 h-full">
            <CardHeader>
              <CardTitle className="text-xl">Estrutura Societária</CardTitle>
              <CardDescription>
                Visualização gráfica das relações entre pessoas e empresas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 p-12 flex items-center justify-center h-96">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users size={30} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Visualizador de Estrutura</h3>
                  <p className="text-gray-400 mb-6">
                    O visualizador de estrutura societária está sendo implementado.
                    <br />Aguarde as próximas atualizações.
                  </p>
                  <Button variant="blue" className="mx-auto">
                    Pré-visualizar Estrutura
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <CardTitle className="text-lg">Participantes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <User size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">João Silva</p>
                    <p className="text-xs text-gray-400">Sócio-Administrador • 70%</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mr-3">
                    <User size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="font-medium">Maria Silva</p>
                    <p className="text-xs text-gray-400">Sócia • 30%</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full text-white border-gray-700 bg-gray-700/40 hover:bg-gray-700">
                  Adicionar Participante
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <CardTitle className="text-lg">Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                    <Building size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Silva Participações Ltda</p>
                    <p className="text-xs text-gray-400">Holding Familiar • CNPJ XX.XXX.XXX/0001-XX</p>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full text-white border-gray-700 bg-gray-700/40 hover:bg-gray-700">
                  Adicionar Empresa
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <CardTitle className="text-lg">Ações Recomendadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-900/30 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Completar transferência de imóveis</p>
                    <ArrowRight size={16} className="text-blue-400" />
                  </div>
                  <p className="text-gray-400 text-xs">Recomendado pelo seu consultor</p>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Revisar contrato social</p>
                    <ArrowRight size={16} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-xs">Atualização anual necessária</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Structure;
