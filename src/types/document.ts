
import { DocumentRecommendation } from './chat';

export interface DocumentRoadmap {
  id: string;
  recommendation_id: string;
  user_id: string;
  document_key: string;
  name: string;
  description: string | null;
  category: string;
  priority: number;
  is_mandatory: boolean;
  item_description: string | null;
  item_type: string | null;
  item_index: number | null;
  group_id: string | null;
  how_to_obtain: string | null;
  processing_time: string | null;
  estimated_cost: string | null;
  reason: string | null;
  related_to: string | null;
  sent: boolean;
  created_at: string;
  updated_at: string;
}

export interface DocumentUploadStatus {
  documentKey: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
}
