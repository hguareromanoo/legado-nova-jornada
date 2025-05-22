
import { DocumentRecommendationsResponse } from '@/types/chat';

interface DocumentSummaryProps {
  documentData: DocumentRecommendationsResponse;
  uploadedCount: number;
}

const DocumentSummary = ({
  documentData,
  uploadedCount
}: DocumentSummaryProps) => {
  return (
    <div className="mt-8 bg-gray-800/30 p-6 rounded-lg backdrop-blur-sm border border-gray-700/30">
      <h3 className="text-lg font-semibold text-white mb-4">Resumo dos Documentos</h3>
      <div className="grid md:grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-w1-primary-accent">{documentData.total_documents}</div>
          <div className="text-sm text-gray-300">Total de documentos</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">{uploadedCount}</div>
          <div className="text-sm text-gray-300">Enviados</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">{documentData.summary.estimated_total_cost}</div>
          <div className="text-sm text-gray-300">Custo estimado</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentSummary;
