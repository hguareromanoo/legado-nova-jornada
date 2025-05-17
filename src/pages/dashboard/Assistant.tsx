
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, FileText, PlusCircle, Calendar, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const Assistant = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Example conversation
  const [conversation, setConversation] = useState([
    { id: 1, sender: 'assistant', content: 'Olá! Eu sou o Robson, seu assistente virtual da W1 Consultoria. Como posso ajudar você hoje?' },
  ]);
  
  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);
  
  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setConversation([...conversation, { id: Date.now(), sender: 'user', content: message }]);
    setMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setConversation(prev => [...prev, { 
        id: Date.now(), 
        sender: 'assistant', 
        content: 'Obrigado por sua mensagem. Estou processando sua solicitação e em breve retornarei com uma resposta personalizada.' 
      }]);
    }, 2000);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleQuickQuestion = (question: string) => {
    setConversation([...conversation, { id: Date.now(), sender: 'user', content: question }]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Prepare responses based on the question
    let response = '';
    switch (question) {
      case 'Como transferir um imóvel para a holding?':
        response = 'Para transferir um imóvel para a holding, é necessário realizar uma escritura pública de integralização de capital. O processo envolve avaliação do imóvel, escritura em cartório e registro no Registro de Imóveis. Nossa equipe pode auxiliar em todo o processo.';
        break;
      case 'Quais os benefícios fiscais da holding?':
        response = 'Os benefícios fiscais da holding incluem economia de impostos na transmissão de bens (redução de até 85% do ITCMD em alguns casos), economia no imposto de renda sobre os aluguéis, e possibilidade de planejamento sucessório com menores custos tributários.';
        break;
      case 'Como funciona o planejamento sucessório?':
        response = 'O planejamento sucessório com holding permite a transferência de bens aos herdeiros ainda em vida, com menor carga tributária, evitando inventário judicial. A gestão dos bens permanece com os fundadores enquanto vivos, mesmo após a transferência das quotas, através de cláusulas específicas no contrato social.';
        break;
      default:
        response = 'Este é um tema importante. Gostaria de agendar uma conversa com um de nossos consultores para uma orientação detalhada sobre este assunto?';
    }
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      setIsTyping(false);
      setConversation(prev => [...prev, { 
        id: Date.now(), 
        sender: 'assistant', 
        content: response
      }]);
    }, 2000);
  };
  
  const handleActionButtonClick = (action: string) => {
    toast({
      title: "Ação iniciada",
      description: `Você selecionou: ${action}`,
    });
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
          <Card className="bg-w1-primary-dark/80 border-w1-secondary-dark h-full flex flex-col">
            <CardHeader className="bg-w1-primary-dark border-b border-w1-secondary-dark">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-w1-primary-accent/20 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-w1-primary-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg text-white">Robson</CardTitle>
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
                          ? 'bg-w1-primary-accent text-w1-primary-dark' 
                          : 'bg-w1-secondary-dark text-white'
                      }`}
                    >
                      {msg.content}
                    </motion.div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-w1-secondary-dark text-white rounded-2xl p-4 max-w-[80%]">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
              
              <div className="p-4 border-t border-w1-secondary-dark">
                <div className="flex gap-2">
                  <Textarea
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua mensagem..."
                    className="bg-w1-secondary-dark/50 border-w1-secondary-dark text-white resize-none min-h-[60px]"
                  />
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark h-10"
                    >
                      <Send size={18} />
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Paperclip size={16} className="text-gray-400" />
                      </Button>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <Mic size={16} className="text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-w1-primary-dark/80 border-w1-secondary-dark">
            <CardHeader>
              <CardTitle className="text-lg text-white">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start text-white border-w1-secondary-dark hover:bg-w1-secondary-dark"
                onClick={() => handleActionButtonClick('Enviar documento')}
              >
                <FileText size={16} className="mr-2 text-w1-primary-accent" />
                Enviar documento
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-white border-w1-secondary-dark hover:bg-w1-secondary-dark"
                onClick={() => handleActionButtonClick('Agendar reunião')}
              >
                <Calendar size={16} className="mr-2 text-w1-primary-accent" />
                Agendar reunião
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-white border-w1-secondary-dark hover:bg-w1-secondary-dark"
                onClick={() => handleActionButtonClick('Adicionar ativo')}
              >
                <PlusCircle size={16} className="mr-2 text-w1-primary-accent" />
                Adicionar ativo
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-w1-primary-dark/80 border-w1-secondary-dark">
            <CardHeader>
              <CardTitle className="text-lg text-white">Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div 
                  className="p-2 rounded-md hover:bg-w1-secondary-dark/50 cursor-pointer transition-colors"
                  onClick={() => handleQuickQuestion('Como transferir um imóvel para a holding?')}
                >
                  <p className="text-sm text-gray-300">Como transferir um imóvel para a holding?</p>
                </div>
                <Separator className="bg-w1-secondary-dark" />
                <div 
                  className="p-2 rounded-md hover:bg-w1-secondary-dark/50 cursor-pointer transition-colors"
                  onClick={() => handleQuickQuestion('Quais os benefícios fiscais da holding?')}
                >
                  <p className="text-sm text-gray-300">Quais os benefícios fiscais da holding?</p>
                </div>
                <Separator className="bg-w1-secondary-dark" />
                <div 
                  className="p-2 rounded-md hover:bg-w1-secondary-dark/50 cursor-pointer transition-colors"
                  onClick={() => handleQuickQuestion('Como funciona o planejamento sucessório?')}
                >
                  <p className="text-sm text-gray-300">Como funciona o planejamento sucessório?</p>
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
