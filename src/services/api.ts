
import axios from 'axios';
import { Session, AssistantResponse, ConversationMessage } from '@/types/chat';

// Determine the correct API URL based on environment
const determineApiUrl = () => {
  // In development, use localhost
  if (window.location.hostname === 'localhost') {
    return 'http://localhost:8000';
  }
  
  // When deployed in preview, try to use a deployed backend URL if available
  // You should replace this with your actual deployed API URL when available
  return 'http://localhost:8000'; // Fallback to localhost for now
};

const API_BASE_URL = determineApiUrl();

console.log('Using API base URL:', API_BASE_URL);

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000, // 10 second timeout
  // Important for CORS when credentials might be sent
  withCredentials: false
});

export const api = {
  createSession: async (userId: string | null = null): Promise<Session> => {
    try {
      console.log('Creating session with user_id:', userId);
      
      // Make it explicit that we're creating an anonymous session when userId is null
      const requestBody = userId 
        ? { user_id: userId, is_anonymous: false }
        : { is_anonymous: true };
      
      console.log('Request body for session creation:', requestBody);
      
      const response = await apiClient.post('/sessions', requestBody);
      
      return response.data;
    } catch (error) {
      console.error('Error creating session:', error);
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error(`Erro de conexão com o servidor API (${API_BASE_URL}). Verifique se o servidor está rodando e acessível.`);
      }
      throw new Error('Erro ao criar sessão. Verifique se o servidor API está rodando corretamente.');
    }
  },
  
  getSession: async (sessionId: string): Promise<Session> => {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting session:', error);
      throw new Error('Erro ao buscar sessão. Verifique se o servidor API está rodando corretamente.');
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
      throw new Error('Erro ao enviar mensagem. Verifique se o servidor API está rodando corretamente.');
    }
  },
  
  getMessages: async (sessionId: string): Promise<ConversationMessage[]> => {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/messages`);
      return response.data;
    } catch (error) {
      console.error('Error getting messages:', error);
      throw new Error('Erro ao buscar mensagens. Verifique se o servidor API está rodando corretamente.');
    }
  }
};
