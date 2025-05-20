
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
  const { user } = useUser(); // Get user from context
  const { toast } = useToast();

  // Initialize session
  useEffect(() => {
    const initializeSession = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get session ID from localStorage or create a new session
        const storedSessionId = localStorage.getItem('chatSessionId');
        
        if (storedSessionId) {
          try {
            const existingSession = await api.getSession(storedSessionId);
            setSession(existingSession);
            setMessages(existingSession.conversation_history || []);
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
      // Ensure we pass a valid user ID to the API
      const userId = user?.id || null;
      console.log('Creating new session with user ID:', userId);
      
      try {
        const newSession = await api.createSession(userId);
        localStorage.setItem('chatSessionId', newSession.session_id);
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
  }, [user, toast]); // Depend on user to reinitialize when user changes
  
  // Function to send message to API
  const sendMessage = async (content: string): Promise<void> => {
    if (!session) {
      setError('Sessão não inicializada. Por favor, recarregue a página.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
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
      
      // Send message to API
      const response = await api.sendMessage(session.session_id, content);
      
      // Add assistant response to the list
      const assistantMessage: ConversationMessage = {
        message_id: `assist-${Date.now()}`,
        session_id: session.session_id,
        timestamp: new Date().toISOString(),
        role: 'assistant',
        content: response.content,
        extracted_entities: null
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMessage]);
      
      // Update session with the new profile data
      setSession(prevSession => {
        if (!prevSession) return null;
        return {
          ...prevSession,
          profile: response.profile,
          completion_percentage: response.completion_percentage
        };
      });
    } catch (sendError) {
      console.error('Error sending message:', sendError);
      if (sendError instanceof Error) {
        setError(sendError.message);
      } else {
        setError('Ocorreu um erro ao enviar a mensagem.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <ChatContext.Provider value={{
      session,
      messages,
      loading,
      error,
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
