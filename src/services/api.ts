
import axios from 'axios';
import { Session, AssistantResponse, ConversationMessage } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';

// Use API_BASE_URL as http://localhost:8000 since that's where your FastAPI server is running
const API_BASE_URL = 'http://localhost:8000';

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 second timeout
});

export const api = {
  createSession: async (userId: string | null = null): Promise<Session> => {
    try {
      const response = await apiClient.post('/sessions', { user_id: userId });
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      throw new Error('Erro ao criar sessão. Verifique se o servidor API está rodando em http://localhost:8000');
    }
  },
  
  getSession: async (sessionId: string): Promise<Session> => {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw new Error('Erro ao buscar sessão. Verifique se o servidor API está rodando em http://localhost:8000');
    }
  },
  
  sendMessage: async (sessionId: string, message: string): Promise<AssistantResponse> => {
    try {
      const response = await apiClient.post(
        `/sessions/${sessionId}/messages`,
        { content: message }
      );
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Erro ao enviar mensagem. Verifique se o servidor API está rodando em http://localhost:8000');
    }
  },
  
  getMessages: async (sessionId: string): Promise<ConversationMessage[]> => {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('Erro ao buscar mensagens. Verifique se o servidor API está rodando em http://localhost:8000');
    }
  }
};
