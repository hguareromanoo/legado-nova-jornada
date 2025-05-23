
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentRecommendation } from '@/types/chat';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import DocumentUpload from '@/components/holding/DocumentUpload';

// Mock data for document recommendations (replace with actual data fetching in production)
const mockDocuments: DocumentRecommendation[] = [
  {
    name: "RG/CPF dos sócios",
    document_key: "doc_rg_cpf",
    recommendation_id: "rec_123",
    description: "Documentos de identificação",
    priority: 5,
    category: "pessoal",
    is_mandatory: true,
    how_to_obtain: "Cartório de registro civil",
    processing_time: "Imediato",
    estimated_cost: "R$ 50,00",
    reason: "Necessário para identificação dos sócios"
  },
  {
    name: "Certidão de casamento",
    document_key: "doc_certidao",
    recommendation_id: "rec_456",
    description: "Comprovação de estado civil",
    priority: 3,
    category: "pessoal",
    is_mandatory: true,
    how_to_obtain: "Cartório de registro civil",
    processing_time: "5 dias úteis",
    estimated_cost: "R$ 80,00",
    reason: "Necessário para verificação do regime de bens"
  }
];

const HoldingSetup = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | undefined>();
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'>>({});
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());
  const [documents, setDocuments] = useState<DocumentRecommendation[]>(mockDocuments);

  useEffect(() => {
    const getUserId = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id);
      
      // Initialize upload status
      const initialStatus: Record<string, 'pending' | 'uploading' | 'uploaded' | 'error'> = {};
      documents.forEach(doc => {
        initialStatus[doc.document_key] = 'pending';
      });
      setUploadStatus(initialStatus);
    };
    
    getUserId();
  }, [documents]);

  const handleToggleExpand = (documentKey: string) => {
    setExpandedCards(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(documentKey)) {
        newExpanded.delete(documentKey);
      } else {
        newExpanded.add(documentKey);
      }
      return newExpanded;
    });
  };

  const handleStatusChange = (documentKey: string, status: 'pending' | 'uploading' | 'uploaded' | 'error') => {
    setUploadStatus(prev => ({
      ...prev,
      [documentKey]: status
    }));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configuração da Holding</h1>
      <p className="mb-8">
        Para configurar sua holding, precisamos que você envie os documentos abaixo:
      </p>
      
      <div className="space-y-6">
        {documents.map((doc) => (
          <DocumentUpload
            key={doc.document_key}
            document={doc}
            uploadStatus={uploadStatus[doc.document_key] || 'pending'}
            isExpanded={expandedCards.has(doc.document_key)}
            userId={userId}
            onToggleExpand={handleToggleExpand}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
      
      <div className="mt-10 flex justify-end">
        <Button size="lg">Continuar</Button>
      </div>
    </div>
  );
};

export default HoldingSetup;
