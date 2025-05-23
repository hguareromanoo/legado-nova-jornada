
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { DocumentRecommendation } from '@/types/chat';
import DocumentStatusIcon from './DocumentStatusIcon';

interface DocumentHeaderProps {
  document: DocumentRecommendation;
  uploadStatus: 'pending' | 'uploading' | 'uploaded' | 'error';
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ document, uploadStatus }) => {
  return (
    <div className="flex items-center gap-4 flex-1 min-w-0">
      <DocumentStatusIcon status={uploadStatus} />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-white truncate" title={document.name}>{document.name}</h4>
          <Badge 
            variant={document.priority >= 5 ? "destructive" : document.priority >= 4 ? "default" : "secondary"}
            className="flex-shrink-0"
          >
            {'★'.repeat(document.priority)}{'☆'.repeat(Math.max(0, 5 - document.priority))}
          </Badge>
        </div>
        <p className="text-sm text-gray-300 truncate" title={document.description}>{document.description}</p>
        {document.item_description && (
          <p className="text-sm text-blue-400 mt-1 truncate" title={document.item_description}>
            <strong>Item específico:</strong> {document.item_description}
          </p>
        )}
      </div>
    </div>
  );
};

export default DocumentHeader;
