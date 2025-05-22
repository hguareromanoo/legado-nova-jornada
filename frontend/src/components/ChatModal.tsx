
import React from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import DocumentUploadChat from './DocumentUploadChat';
import { RoadmapStep } from './VerticalRoadmap';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      <SheetContent side="right" className="sm:max-w-md md:max-w-lg h-full inset-y-0 mx-auto right-0 flex flex-col overflow-hidden bg-w1-primary-dark border-w1-secondary-dark shadow-xl">
        <div className="absolute top-4 right-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full text-gray-400 hover:text-white hover:bg-w1-secondary-dark"
          >
            <X size={16} />
          </Button>
        </div>
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
