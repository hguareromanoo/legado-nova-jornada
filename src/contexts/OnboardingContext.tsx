
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type OnboardingPathType = 'ai' | 'human' | null;

interface OnboardingStep {
  id: string;
  name: string;
  completed: boolean;
  path: string;
}

interface DocumentStatus {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  uploadDate?: Date;
}

interface OnboardingContextType {
  currentStep: string;
  path: OnboardingPathType;
  documents: DocumentStatus[];
  progress: number;
  steps: OnboardingStep[];
  setPath: (path: OnboardingPathType) => void;
  completeStep: (stepId: string) => void;
  moveToStep: (stepId: string) => void;
  updateDocumentStatus: (documentId: string, status: DocumentStatus['status']) => void;
  uploadDocument: (document: Omit<DocumentStatus, 'status' | 'uploadDate'>) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [currentStep, setCurrentStep] = useState<string>('selection');
  const [path, setPath] = useState<OnboardingPathType>(null);
  const [documents, setDocuments] = useState<DocumentStatus[]>([]);
  const [steps, setSteps] = useState<OnboardingStep[]>([
    { id: 'selection', name: 'Escolha de Onboarding', completed: false, path: '/onboarding' },
    { id: 'chat', name: 'Chat com IA', completed: false, path: '/onboarding/chat' },
    { id: 'documents', name: 'Coleta de Documentos', completed: false, path: '/members' },
    { id: 'review', name: 'Revisão de Documentos', completed: false, path: '/document-review' }
  ]);
  
  // Calculate progress based on completed steps
  const progress = Math.round((steps.filter(step => step.completed).length / steps.length) * 100);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedPath = localStorage.getItem('onboardingPath') as OnboardingPathType;
    const storedStep = localStorage.getItem('onboardingStep');
    const storedDocuments = localStorage.getItem('onboardingDocuments');
    const storedSteps = localStorage.getItem('onboardingSteps');
    
    if (storedPath) {
      setPath(storedPath);
    }
    
    if (storedStep) {
      setCurrentStep(storedStep);
    }
    
    if (storedDocuments) {
      setDocuments(JSON.parse(storedDocuments));
    }
    
    if (storedSteps) {
      setSteps(JSON.parse(storedSteps));
    }
  }, []);
  
  // Update localStorage when state changes
  useEffect(() => {
    if (path) {
      localStorage.setItem('onboardingPath', path);
    }
    localStorage.setItem('onboardingStep', currentStep);
    localStorage.setItem('onboardingDocuments', JSON.stringify(documents));
    localStorage.setItem('onboardingSteps', JSON.stringify(steps));
  }, [path, currentStep, documents, steps]);
  
  // Function to mark a step as completed
  const completeStep = (stepId: string) => {
    setSteps(prevSteps => {
      const updatedSteps = prevSteps.map(step => {
        if (step.id === stepId) {
          return { ...step, completed: true };
        }
        return step;
      });
      
      // Find the next uncompleted step
      const nextStep = updatedSteps.find(step => !step.completed);
      if (nextStep) {
        // Move to the next step
        setCurrentStep(nextStep.id);
        localStorage.setItem('onboardingStep', nextStep.id);
      }
      
      return updatedSteps;
    });
  };
  
  // Function to move to a specific step
  const moveToStep = (stepId: string) => {
    setCurrentStep(stepId);
    localStorage.setItem('onboardingStep', stepId);
  };
  
  // Function to update the status of a document
  const updateDocumentStatus = (documentId: string, status: DocumentStatus['status']) => {
    setDocuments(prevDocs => 
      prevDocs.map(doc => 
        doc.id === documentId ? { ...doc, status } : doc
      )
    );
  };
  
  // Function to add a new document
  const uploadDocument = (document: Omit<DocumentStatus, 'status' | 'uploadDate'>) => {
    const newDocument: DocumentStatus = {
      ...document,
      status: 'uploaded',
      uploadDate: new Date()
    };
    
    setDocuments(prevDocs => [...prevDocs, newDocument]);
  };
  
  return (
    <OnboardingContext.Provider 
      value={{ 
        currentStep,
        path, 
        documents,
        progress,
        steps,
        setPath,
        completeStep,
        moveToStep,
        updateDocumentStatus,
        uploadDocument
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
