
import { AlertCircle, Clock, Home, MessageSquare, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PlaceholderContentProps {
  activeTab: string;
  onSetActiveTab: (tab: string) => void;
}

const PlaceholderContent = ({ activeTab, onSetActiveTab }: PlaceholderContentProps) => {
  return (
    <div className="text-center p-12">
      <div className="bg-gray-800/30 p-8 rounded-lg border border-gray-700/30 inline-block">
        {activeTab === 'assistant' && <MessageSquare size={48} className="mx-auto mb-4 text-gray-300" />}
        {activeTab === 'profile' && <User size={48} className="mx-auto mb-4 text-gray-300" />}
        {activeTab === 'settings' && <Settings size={48} className="mx-auto mb-4 text-gray-300" />}
        
        <h2 className="text-xl font-medium mb-2 text-white">
          {activeTab} em desenvolvimento
        </h2>
        <p className="text-gray-300 mb-4">
          Esta seção será implementada em breve.
        </p>
        
        <Button 
          variant="w1Primary" 
          onClick={() => onSetActiveTab('documents')}
        >
          Voltar para Documentos
        </Button>
      </div>
    </div>
  );
};

export interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "Carregando documentos necessários..." }: LoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center text-white">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>{message}</p>
      </div>
    </div>
  );
};

export interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

export const ErrorDisplay = ({ error, onRetry }: ErrorDisplayProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center text-white">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={onRetry} variant="w1Primary">
          Voltar ao Chat
        </Button>
      </div>
    </div>
  );
};

export default PlaceholderContent;
