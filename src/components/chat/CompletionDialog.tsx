
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CompletionDialog: React.FC<CompletionDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  const handleProceedToNextStep = () => {
    onOpenChange(false);
    navigate('/onboarding/documents');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            Etapa concluída com sucesso!
          </DialogTitle>
          <DialogDescription>
            Agora temos todas as informações necessárias para iniciar seu planejamento patrimonial.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium mb-2">Próximos passos:</h4>
          <ul className="text-sm space-y-2">
            <li className="flex items-start gap-2">
              <div className="mt-0.5 min-w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">1</div>
              <span>Reunir documentação necessária para formalização</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 min-w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">2</div>
              <span>Agendar consulta com especialista patrimonial</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="mt-0.5 min-w-4 h-4 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">3</div>
              <span>Elaboração da estrutura personalizada</span>
            </li>
          </ul>
        </div>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Continuar conversando
          </Button>
          <Button 
            className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark"
            onClick={handleProceedToNextStep}
          >
            <span>Próxima etapa</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CompletionDialog;
