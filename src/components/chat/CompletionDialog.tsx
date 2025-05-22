
import React from 'react';
import { CheckCircle, ArrowRight, FileText, Users, Building, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompletionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProceedToDocuments: () => void;
  clientName?: string | null;
  profileSummary?: {
    personalComplete: boolean;
    familyComplete: boolean;
    assetsComplete: boolean;
    goalsComplete: boolean;
  };
  isLoadingDocuments?: boolean;
}

const CompletionDialog: React.FC<CompletionDialogProps> = ({ 
  open, 
  onOpenChange, 
  onProceedToDocuments,
  clientName,
  profileSummary,
  isLoadingDocuments = false
}) => {
  const handleProceed = () => {
    onProceedToDocuments();
    // Não feche o diálogo aqui - deixe o loading acontecer
  };

  const handleContinueChat = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-bold text-green-800">
            🎉 Onboarding Concluído!
          </DialogTitle>
          <DialogDescription className="text-center">
            {clientName ? `Parabéns, ${clientName}! ` : 'Parabéns! '}
            Coletamos todas as informações necessárias para seu planejamento patrimonial.
          </DialogDescription>
        </DialogHeader>

        {/* Resumo do que foi coletado */}
        <Card className="bg-gray-50 border-gray-200">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-center">Informações Coletadas</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Dados Pessoais</span>
                {profileSummary?.personalComplete && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Família</span>
                {profileSummary?.familyComplete && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-green-600" />
                <span className="text-sm">Patrimônio</span>
                {profileSummary?.assetsComplete && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                <span className="text-sm">Objetivos</span>
                {profileSummary?.goalsComplete && (
                  <Badge variant="secondary" className="text-xs">✓</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to action */}
        <div className="space-y-3">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <FileText className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-blue-800 font-medium">
              Próximo Passo: Envio de Documentos
            </p>
            <p className="text-xs text-blue-600">
              Preparamos uma lista personalizada dos documentos necessários para sua situação específica.
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleContinueChat}
              className="flex-1"
              disabled={isLoadingDocuments}
            >
              Continuar Chat
            </Button>
            <Button 
              onClick={handleProceed}
              className="flex-1 bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark"
              disabled={isLoadingDocuments}
            >
              {isLoadingDocuments ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Preparando...
                </>
              ) : (
                <>
                  Ver Documentos
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompletionDialog;
