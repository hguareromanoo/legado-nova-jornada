
import React from 'react';
import { CheckCircle, ArrowRight, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CompletionBannerProps {
  onProceedToDocuments: () => void;
  clientName?: string | null;
  completionPercentage?: number;
  isLoadingDocuments?: boolean;
}

const CompletionBanner: React.FC<CompletionBannerProps> = ({ 
  onProceedToDocuments, 
  clientName,
  completionPercentage = 100,
  isLoadingDocuments = false
}) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-500">
      <Card className="border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 shadow-xl border-2">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-bold text-lg text-green-800">
                    🎉 Parabéns{clientName ? `, ${clientName}` : ''}!
                  </h3>
                  <Badge className="bg-green-600 text-white">
                    {completionPercentage}% Completo
                  </Badge>
                </div>
                
                <p className="text-green-700 mb-3">
                  Suas informações foram coletadas com sucesso! Agora precisamos de alguns documentos para prosseguir com sua estruturação patrimonial.
                </p>
                
                <div className="flex items-center gap-4 text-sm text-green-600">
                  <div className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    <span>Documentos personalizados</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>Processo otimizado</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-2 ml-4">
              <Button 
                onClick={onProceedToDocuments}
                size="lg"
                disabled={isLoadingDocuments}
                className="bg-w1-primary-accent hover:bg-w1-primary-accent-hover text-w1-primary-dark font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
              <p className="text-xs text-green-600 text-center">
                {isLoadingDocuments ? 'Gerando lista personalizada...' : 'Lista personalizada pronta'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionBanner;
