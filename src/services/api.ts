
import axios from 'axios';
import { Session, AssistantResponse, ConversationMessage, DocumentRecommendationsResponse } from '@/types/chat';

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
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6cmJhcnV0aWJ6aGd2Z3NvcmtyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc1MjAyNTMsImV4cCI6MjA2MzA5NjI1M30.kikgJq8SgXa81PahsYoTvkPiICqriE9iyz6ksOydVV8';

console.log('Using API base URL:', API_BASE_URL);

// Create axios instance with proper configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'apikey': API_KEY  // Consistent API key header
  },
  timeout: 30000, // Increased timeout for long responses
  // Important for CORS when credentials might be sent
  withCredentials: false
});

export const api = {
  createSession: async (userId: string): Promise<Session> => {
    try {
      console.log('Creating session with user_id:', userId);
      
      // Garantir que userId foi fornecido
      if (!userId) {
        throw new Error('User ID é obrigatório para criar uma sessão');
      }
      
      const requestBody = { user_id: userId, is_anonymous: false };
      
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
      
      // Garantir que temos o campo is_complete na resposta
      if (response.data.is_complete === undefined) {
        console.warn('API response does not include is_complete field, defaulting to false');
        response.data.is_complete = false;
      }
      
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
  },

  // ✨ NOVA: Buscar recomendações de documentos
  getDocumentRecommendations: async (sessionId: string): Promise<DocumentRecommendationsResponse> => {
    try {
      console.log('Fetching document recommendations for session:', sessionId);
      const response = await apiClient.get(`/sessions/${sessionId}/document-recommendations`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document recommendations:', error);
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        throw new Error('Perfil ainda não está completo para gerar recomendações de documentos.');
      }
      if (axios.isAxiosError(error) && !error.response) {
        throw new Error(`Erro de conexão com o servidor API (${API_BASE_URL}). Verifique se o servidor está rodando.`);
      }
      throw new Error('Erro ao buscar recomendações de documentos. Verifique se o servidor API está rodando.');
    }
  },

  // ✨ NOVA: Verificar status de conclusão
  getCompletionStatus: async (sessionId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/sessions/${sessionId}/completion-status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching completion status:', error);
      throw new Error('Erro ao verificar status de conclusão.');
    }
  }
};
