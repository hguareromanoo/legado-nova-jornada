
import React from 'react';
import { DocumentRecommendation } from '@/types/chat';

interface DocumentDetailsProps {
  document: DocumentRecommendation;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ document }) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-700/50">
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        {document.how_to_obtain && (
          <div>
            <strong className="text-gray-300">Como obter:</strong>
            <p className="text-gray-400 mt-1 whitespace-pre-wrap">{document.how_to_obtain}</p>
          </div>
        )}
        {document.processing_time && (
          <div>
            <strong className="text-gray-300">Prazo:</strong>
            <p className="text-gray-400 mt-1">{document.processing_time}</p>
          </div>
        )}
        {document.estimated_cost && (
          <div>
            <strong className="text-gray-300">Custo estimado:</strong>
            <p className="text-gray-400 mt-1">{document.estimated_cost}</p>
          </div>
        )}
        <div>
          <strong className="text-gray-300">ID da Recomendação:</strong>
          <p className="text-gray-400 mt-1 font-mono text-xs">{document.recommendation_id}</p>
        </div>
        <div>
          <strong className="text-gray-300">Chave do Documento:</strong>
          <p className="text-gray-400 mt-1 font-mono text-xs">{document.document_key}</p>
        </div>
      </div>
      {document.reason && (
        <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded">
          <strong className="text-blue-400">Por que é necessário:</strong>
          <p className="text-blue-300 mt-1 whitespace-pre-wrap">{document.reason}</p>
        </div>
      )}
    </div>
  );
};

export default DocumentDetails;
