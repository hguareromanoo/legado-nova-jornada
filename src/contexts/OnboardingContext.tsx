
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
    { id: 'schedule', name: 'Agendamento Consultor', completed: false, path: '/onboarding/schedule' },
    { id: 'documents', name: 'Coleta de Documentos', completed: false, path: '/document-collection' },
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
  
  const setOnboardingPath = (newPath: OnboardingPathType) => {
    setPath(newPath);
    
    // Update steps based on path
    if (newPath === 'ai') {
      // AI path: selection -> chat -> documents -> review
      setSteps(prevSteps => {
        return prevSteps.map(step => ({
          ...step,
          completed: step.id === 'selection' ? true : step.completed
        }));
      });
      setCurrentStep('chat');
    } else if (newPath === 'human') {
      // Human path: selection -> schedule -> documents -> review
      setSteps(prevSteps => {
        return prevSteps.map(step => ({
          ...step,
          completed: step.id === 'selection' ? true : step.completed
        }));
      });
      setCurrentStep('schedule');
    }
  };
  
  const completeStep = (stepId: string) => {
    // Mark the current step as completed
    setSteps(prevSteps => {
      return prevSteps.map(step => ({
        ...step,
        completed: step.id === stepId ? true : step.completed
      }));
    });
    
    // Determine next step based on path
    if (stepId === 'chat' || stepId === 'schedule') {
      setCurrentStep('documents');
    } else if (stepId === 'documents') {
      setCurrentStep('review');
    }
  };
  
  const moveToStep = (stepId: string) => {
    // Only allow moving to a step if previous steps are completed
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const previousStepsCompleted = steps
      .slice(0, stepIndex)
      .every(step => step.completed || (path === 'ai' && step.id === 'schedule') || (path === 'human' && step.id === 'chat'));
    
    if (previousStepsCompleted) {
      setCurrentStep(stepId);
    }
  };
  
  const updateDocumentStatus = (documentId: string, status: DocumentStatus['status']) => {
    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (doc.id === documentId) {
          return { ...doc, status };
        }
        return doc;
      });
    });
  };
  
  const uploadDocument = (document: Omit<DocumentStatus, 'status' | 'uploadDate'>) => {
    const newDocument: DocumentStatus = {
      ...document,
      status: 'uploaded',
      uploadDate: new Date()
    };
    
    setDocuments(prevDocs => {
      // Check if document already exists
      const exists = prevDocs.some(doc => doc.id === document.id);
      
      if (exists) {
        return prevDocs.map(doc => {
          if (doc.id === document.id) {
            return newDocument;
          }
          return doc;
        });
      } else {
        return [...prevDocs, newDocument];
      }
    });
  };
  
  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        path,
        documents,
        progress,
        steps,
        setPath: setOnboardingPath,
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

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
