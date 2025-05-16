
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import DocumentUploadChat from './DocumentUploadChat';
import { RoadmapStep } from './VerticalRoadmap';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDocument: RoadmapStep | null;
  onDocumentComplete: (documentId: string) => void;
  onNextDocument: () => void;
  onPreviousDocument: () => void;
}

const ChatModal = ({
  isOpen,
  onClose,
  selectedDocument,
  onDocumentComplete,
  onNextDocument,
  onPreviousDocument
}: ChatModalProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-md md:max-w-lg h-full inset-y-0 mx-auto right-0 flex flex-col overflow-hidden bg-gray-900 border-gray-800">
        <DocumentUploadChat
          document={selectedDocument}
          onBack={onPreviousDocument}
          onClose={onClose}
          onComplete={onDocumentComplete}
          onNext={onNextDocument}
        />
      </SheetContent>
    </Sheet>
  );
};

export default ChatModal;
