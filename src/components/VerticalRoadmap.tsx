
import React from 'react';
import { Check, ChevronRight, FileText, Home, Building2, User } from 'lucide-react';
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
    <div className="py-6 px-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-1">Documentos Necessários</h3>
        <p className="text-sm text-gray-400">Complete as etapas para prosseguir</p>
      </div>
      
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-5 top-6 bottom-10 w-0.5 bg-gray-700/50 z-0" />
        
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
                      isCompleted ? "bg-blue-500/30" : 
                      isCurrent ? "bg-blue-500/20 ring-2 ring-blue-400" :
                      "bg-gray-800/70"
                    )}
                  >
                    {isCompleted ? (
                      <Check size={20} className="text-blue-400" />
                    ) : (
                      <div className="text-center">
                        {step.icon || <span className={cn(
                          "text-sm font-medium",
                          isCurrent ? "text-blue-400" : "text-gray-400"
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
                      "font-medium mb-0.5",
                      isCompleted ? "text-blue-400" : 
                      isCurrent ? "text-white font-semibold" : 
                      "text-gray-400"
                    )}>
                      {step.name}
                    </p>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                  
                  {/* Continue button for current step */}
                  {isCurrent && (
                    <div className="flex-shrink-0">
                      <Button 
                        size="sm" 
                        className="h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
                "w-10 h-10 rounded-full flex items-center justify-center bg-blue-600/20 z-10",
                currentStep === steps.length && "ring-2 ring-blue-500"
              )}>
                <User size={18} className="text-blue-400" />
              </div>
              <div>
                <p className="font-medium mb-0.5 text-white">
                  Finalizar com Consultor
                </p>
                <p className="text-sm text-gray-400">
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
