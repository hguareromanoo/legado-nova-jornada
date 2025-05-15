
import React from 'react';
import { Check, ChevronRight, FileText, Home, Building, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RoadmapStep {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  status: 'completed' | 'current' | 'locked';
}

interface VerticalRoadmapProps {
  steps: RoadmapStep[];
  currentStep: number;
  onStepSelect: (stepId: string) => void;
}

const VerticalRoadmap = ({ steps, currentStep, onStepSelect }: VerticalRoadmapProps) => {
  return (
    <div className="h-full py-6 px-4 border-r bg-gray-50">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-medium text-w1-primary-dark mb-1">Documentos Necessários</h3>
        <p className="text-sm text-gray-500">Complete as etapas para prosseguir</p>
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-6 bottom-10 w-0.5 bg-gray-200 z-0" />
        
        {/* Steps */}
        <div className="space-y-8 relative z-10">
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed';
            const isCurrent = step.status === 'current';
            
            return (
              <div key={step.id} className="relative">
                <div 
                  className={cn(
                    "flex items-center gap-4 cursor-pointer group transition-all duration-200",
                    isCurrent && "scale-105"
                  )}
                  onClick={() => step.status !== 'locked' && onStepSelect(step.id)}
                >
                  {/* Step indicator */}
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center z-10",
                      isCompleted ? "bg-blue-100" : 
                      isCurrent ? "bg-w1-primary-accent/20 ring-2 ring-w1-primary-accent" :
                      "bg-gray-100"
                    )}
                  >
                    {isCompleted ? (
                      <Check size={20} className="text-blue-600" />
                    ) : (
                      <div className="text-center">
                        {step.icon || <span className={cn(
                          "text-sm font-medium",
                          isCurrent ? "text-w1-primary-dark" : "text-gray-500"
                        )}>{index + 1}</span>}
                      </div>
                    )}
                  </div>
                  
                  {/* Step content */}
                  <div className={cn(
                    "flex-1",
                    step.status === 'locked' ? "opacity-60" : ""
                  )}>
                    <p className={cn(
                      "font-medium mb-0.5 text-sm",
                      isCompleted ? "text-blue-600" : 
                      isCurrent ? "text-w1-primary-dark font-semibold" : 
                      "text-gray-500"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                  
                  {/* Continue button for current step */}
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <Button 
                        size="sm" 
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStepSelect(step.id);
                        }}
                      >
                        Continuar
                        <ChevronRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Final step - Meeting with consultant */}
          <div className="relative">
            <div className={cn(
              "flex items-center gap-4",
              currentStep === steps.length ? "opacity-100" : "opacity-60"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center bg-w1-primary-dark z-10",
                currentStep === steps.length && "ring-2 ring-w1-primary-dark"
              )}>
                <User size={18} className="text-white" />
              </div>
              <div>
                <p className="font-medium mb-0.5 text-sm text-w1-primary-dark">
                  Finalizar com Consultor
                </p>
                <p className="text-xs text-gray-500">
                  Agende sua consultoria personalizada
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalRoadmap;
