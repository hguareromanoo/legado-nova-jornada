
export interface PersonalInfo {
  name: string | null;
  age: number | null;
  marital_status: 'solteiro' | 'casado' | 'divorciado' | 'viúvo' | 'união estável' | 'outro' | null;
  profession: string | null;
}

export interface FamilyMember {
  relation: string;
  name: string | null;
  age: number | null;
  is_dependent: boolean | null;
}

export interface Asset {
  asset_type: 'imóvel' | 'empresa' | 'investimento financeiro' | 'propriedade rural' | 'outro';
  description: string;
  estimated_value: number | null;
  location: string | null;
  ownership: string | null;
  notes: string | null;
}

export interface Goal {
  goal_type: 'sucessão familiar' | 'otimização fiscal' | 'proteção patrimonial' | 'governança familiar' | 'outro';
  description: string;
  priority: number | null;
}

export interface Concern {
  description: string;
  priority: number | null;
}

export interface CompletionScore {
  personal: number;
  family: number;
  assets: number;
  goals: number;
  overall: number;
}

export interface DocumentRecommendation {
  name: string;
  reason: string | null;
  is_mandatory: boolean;
}

export interface ClientProfile {
  profile_id: string;
  created_at: string;
  updated_at: string;
  personal_info: PersonalInfo;
  family_members: FamilyMember[];
  assets: Asset[];
  goals: Goal[];
  concerns: Concern[];
  completion_score: CompletionScore;
  document_recommendations: DocumentRecommendation[];
  notes: string | null;
}

export interface ConversationMessage {
  message_id: string;
  session_id: string;
  timestamp: string;
  role: 'user' | 'assistant';
  content: string;
  extracted_entities: any | null;
}

export interface Session {
  session_id: string;
  user_id?: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  is_complete: boolean;
  completion_percentage: number;
  profile: ClientProfile;
  current_step?: string | null;
  last_page?: string | null;
  conversation_history: ConversationMessage[];
}

export interface AssistantResponse {
  content: string;
  profile: ClientProfile;
  completion_percentage: number;
}

export interface ChatContextType {
  session: Session | null;
  messages: ConversationMessage[];
  loading: boolean;
  error: string | null;
  isTyping: boolean;
  streamingMessage: string;
  sendMessage: (content: string) => Promise<void>;
}
