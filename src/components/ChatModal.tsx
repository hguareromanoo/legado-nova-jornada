
import React, { useState } from 'react';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';
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
      <SheetContent side="right" className="sm:max-w-md h-[80vh] mx-auto inset-x-0 flex flex-col overflow-hidden">
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
