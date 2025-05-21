
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CompletionBanner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-20 inset-x-0 mx-auto w-[90%] max-w-md bg-white border border-green-200 rounded-lg shadow-lg p-4 flex items-center justify-between z-50 animate-fade-in">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
        <span className="text-sm font-medium">Coleta de informações concluída!</span>
      </div>
      <Button 
        size="sm" 
        className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark"
        onClick={() => navigate('/onboarding/documents')}
      >
        <span>Próxima etapa</span>
        <ArrowRight className="ml-1 h-4 w-4" />
      </Button>
    </div>
  );
};

export default CompletionBanner;
