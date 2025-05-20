
import axios from 'axios';
import { Session, AssistantResponse, ConversationMessage } from '@/types/chat';

const API_BASE_URL = 'http://localhost:8000'; // Update this with your actual API URL

export const api = {
  createSession: async (userId: string | null = null): Promise<Session> => {
    const response = await axios.post(`${API_BASE_URL}/sessions`, { user_id: userId });
    return response.data;
  },
  
  getSession: async (sessionId: string): Promise<Session> => {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}`);
    return response.data;
  },
  
  sendMessage: async (sessionId: string, message: string): Promise<AssistantResponse> => {
    const response = await axios.post(
      `${API_BASE_URL}/sessions/${sessionId}/messages`,
      { content: message }
    );
    return response.data;
  },
  
  getMessages: async (sessionId: string): Promise<ConversationMessage[]> => {
    const response = await axios.get(`${API_BASE_URL}/sessions/${sessionId}/messages`);
    return response.data;
  }
};
