
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';
import { Session, ConversationMessage, ChatContextType } from '@/types/chat';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from './UserContext';
import { useToast } from '@/hooks/use-toast';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    const initSession = async () => {
      try {
        // Try to get stored session ID
        const storedSessionId = localStorage.getItem('chatSessionId');
        
        if (storedSessionId) {
          try {
            const existingSession = await api.getSession(storedSessionId);
            setSession(existingSession);
            setMessages(existingSession.conversation_history);
          } catch (error) {
            // If session not found, create new one
            localStorage.removeItem('chatSessionId');
            createNewSession();
          }
        } else {
          createNewSession();
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        toast({
          title: "Erro ao iniciar sessão",
          description: "Não foi possível conectar ao serviço. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    };
    
    const createNewSession = async () => {
      try {
        const userId = user?.id || null;
        const newSession = await api.createSession(userId);
        setSession(newSession);
        setMessages(newSession.conversation_history);
        localStorage.setItem('chatSessionId', newSession.session_id);
      } catch (error) {
        console.error('Error creating new session:', error);
        toast({
          title: "Erro ao criar nova sessão",
          description: "Não foi possível iniciar uma nova conversa. Por favor, tente novamente.",
          variant: "destructive",
        });
      }
    };

    if (user) {
      initSession();
    }
    
    // Setup Supabase realtime subscription for messages
    const setupRealtimeSubscription = () => {
      if (!session?.session_id) return;
      
      const channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'conversation_messages',
            filter: `session_id=eq.${session.session_id}`
          },
          (payload) => {
            // Only add the message if it's not from the current user
            const newMessage = payload.new as ConversationMessage;
            if (newMessage.role === 'assistant') {
              setMessages(prev => [...prev, newMessage]);
              
              // Update session with new profile data if available
              if (session) {
                api.getSession(session.session_id)
                  .then(updatedSession => {
                    setSession(updatedSession);
                  })
                  .catch(console.error);
              }
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const unsubscribe = setupRealtimeSubscription();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user, session?.session_id, toast]);

  const sendMessage = async (content: string) => {
    if (!content.trim() || !session) return;
    
    // Add user message to UI immediately
    const tempUserMessage: ConversationMessage = {
      message_id: `temp-${Date.now()}`,
      session_id: session.session_id,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      extracted_entities: null
    };
    
    setMessages(prev => [...prev, tempUserMessage]);
    setLoading(true);
    
    try {
      // Send to backend
      const response = await api.sendMessage(session.session_id, content);
      
      // Add assistant response if not already added by the subscription
      const existingAssistantMessage = messages.find(
        m => m.role === 'assistant' && m.content === response.content
      );
      
      if (!existingAssistantMessage) {
        const assistantMessage: ConversationMessage = {
          message_id: `temp-assistant-${Date.now()}`,
          session_id: session.session_id,
          role: 'assistant',
          content: response.content,
          timestamp: new Date().toISOString(),
          extracted_entities: null
        };
        
        setMessages(prev => [...prev, assistantMessage]);
      }
      
      // Update session with new profile data
      setSession(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          profile: response.profile,
          completion_percentage: response.completion_percentage
        };
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Falha ao enviar mensagem",
        description: "Não foi possível enviar sua mensagem. Por favor, tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const value: ChatContextType = {
    session,
    messages,
    loading,
    sendMessage
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
