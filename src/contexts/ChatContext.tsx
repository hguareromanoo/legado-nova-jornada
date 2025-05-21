
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { Session, ConversationMessage, ChatContextType } from '@/types/chat';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';

interface ChatProviderProps {
  children: ReactNode;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false); // Novo estado
  const { user, isLoggedIn } = useUser();
  const { toast } = useToast();

  // Initialize session - Only when the user is logged in
  useEffect(() => {
    // Se o usuário não estiver logado, não inicialize a sessão
    if (!isLoggedIn || !user) {
      console.log('Usuário não autenticado. Não inicializando sessão de chat.');
      return;
    }

    const initializeSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obter o ID da sessão específico para o usuário atual
        const storedSessionId = user?.id ? localStorage.getItem(`chatSessionId_${user.id}`) : null;
        
        if (storedSessionId) {
          try {
            const existingSession = await api.getSession(storedSessionId);
            setSession(existingSession);
            setMessages(existingSession.conversation_history || []);
            
            // Verificar se a sessão já está completa
            if (existingSession.is_complete) {
              setIsSessionComplete(true);
            }
          } catch (error) {
            console.error('Error retrieving stored session, creating new one:', error);
            // If there's an error with the stored session, create a new one
            await createNewSession();
          }
        } else {
          await createNewSession();
        }
      } catch (fetchError) {
        console.error('Error initializing session:', fetchError);
        if (fetchError instanceof Error) {
          setError(fetchError.message);
        } else {
          setError('Ocorreu um erro ao inicializar a sessão.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    const createNewSession = async () => {
      // Garantir que temos um user ID válido
      if (!user?.id) {
        console.error('User ID não disponível para criar sessão');
        setError('Erro ao criar sessão: usuário não identificado.');
        return;
      }
      
      console.log('Creating new session with authenticated user:', user.id);
      
      try {
        // Create session with the authenticated user ID
        const newSession = await api.createSession(user.id);
        
        // Armazenar sessionId associado ao usuário atual
        localStorage.setItem(`chatSessionId_${user.id}`, newSession.session_id);
        
        setSession(newSession);
        setMessages(newSession.conversation_history || []);
      } catch (error) {
        console.error('Failed to create new session:', error);
        toast({
          variant: "destructive",
          title: "Erro na conexão",
          description: "Não foi possível conectar ao servidor API."
        });
        throw error; // Re-throw to be caught by the parent function
      }
    };
    
    initializeSession();
  }, [user, isLoggedIn, toast]);
  
  // Function to send message to API
  const sendMessage = async (content: string): Promise<void> => {
    // Verificar se usuário está logado e se sessão existe
    if (!isLoggedIn || !user) {
      setError('Usuário não autenticado. Faça login para continuar.');
      return;
    }
    
    if (!session) {
      setError('Sessão não inicializada. Por favor, recarregue a página.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setIsTyping(true);
      
      // Add user message to the list immediately
      const userMessage: ConversationMessage = {
        message_id: `temp-${Date.now()}`,
        session_id: session.session_id,
        timestamp: new Date().toISOString(),
        role: 'user',
        content,
        extracted_entities: null
      };
      
      setMessages(prevMessages => [...prevMessages, userMessage]);
      
      // Use regular API endpoint to send message and get response
      const response = await api.sendMessage(session.session_id, content);
      
      // Add assistant message to the list
      const assistantMessage: ConversationMessage = {
        message_id: `assist-${Date.now()}`,
        session_id: session.session_id,
        timestamp: new Date().toISOString(),
        role: 'assistant',
        content: response.content,
        extracted_entities: null
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Update session with the new profile data and check if complete
      setSession(prevSession => {
        if (!prevSession) return null;
        return {
          ...prevSession,
          profile: response.profile,
          completion_percentage: response.completion_percentage,
          is_complete: response.is_complete || prevSession.is_complete
        };
      });
      
      // Verificar se a sessão foi marcada como completa
      if (response.is_complete) {
        setIsSessionComplete(true);
      }
      
    } catch (sendError) {
      console.error('Error sending message:', sendError);
      if (sendError instanceof Error) {
        setError(sendError.message);
      } else {
        setError('Ocorreu um erro ao enviar a mensagem.');
      }
    } finally {
      setLoading(false);
      setIsTyping(false);
    }
  };
  
  return (
    <ChatContext.Provider value={{
      session,
      messages,
      loading,
      error,
      isTyping,
      isSessionComplete,
      sendMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
