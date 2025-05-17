
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, FileText, PlusCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';

const Assistant = () => {
  const [message, setMessage] = useState('');
  
  // Example conversation
  const [conversation, setConversation] = useState([
    { id: 1, sender: 'assistant', content: 'Olá! Eu sou o Robson, seu assistente virtual da W1 Consultoria. Como posso ajudar você hoje?' },
  ]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setConversation([...conversation, { id: Date.now(), sender: 'user', content: message }]);
    setMessage('');
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      setConversation(prev => [...prev, { 
        id: Date.now(), 
        sender: 'assistant', 
        content: 'Obrigado por sua mensagem. Estou processando sua solicitação e em breve retornarei com uma resposta personalizada.' 
      }]);
    }, 1000);
  };
  
  return (
    <div>
      <div className="mb-8">
        <p className="text-gray-400">
          Converse com seu assistente virtual para tirar dúvidas e receber recomendações personalizadas sobre sua holding.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="bg-gray-800/30 border-gray-700/30 h-full flex flex-col">
            <CardHeader className="bg-gray-800/50 border-b border-gray-700/50">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Robson</CardTitle>
                  <p className="text-sm text-gray-400">Assistente Virtual W1</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-grow flex flex-col overflow-hidden">
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {conversation.map(msg => (
                  <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.sender === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-800 text-white'
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700/50">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="bg-gray-800/70 border-gray-700/50 resize-none"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <CardTitle className="text-lg">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start text-white border-gray-700 hover:bg-gray-700">
                <FileText size={16} className="mr-2" />
                Enviar documento
              </Button>
              <Button variant="outline" className="w-full justify-start text-white border-gray-700 hover:bg-gray-700">
                <Calendar size={16} className="mr-2" />
                Agendar reunião
              </Button>
              <Button variant="outline" className="w-full justify-start text-white border-gray-700 hover:bg-gray-700">
                <PlusCircle size={16} className="mr-2" />
                Adicionar ativo
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-800/30 border-gray-700/30">
            <CardHeader>
              <CardTitle className="text-lg">Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <p className="text-sm">Como transferir um imóvel para a holding?</p>
                </div>
                <Separator className="bg-gray-700/50" />
                <div className="p-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <p className="text-sm">Quais os benefícios fiscais da holding?</p>
                </div>
                <Separator className="bg-gray-700/50" />
                <div className="p-2 rounded-md hover:bg-gray-700/50 cursor-pointer transition-colors">
                  <p className="text-sm">Como funciona o planejamento sucessório?</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Assistant;
