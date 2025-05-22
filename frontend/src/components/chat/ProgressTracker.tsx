
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressTrackerProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressTracker = ({ currentStep, totalSteps }: ProgressTrackerProps) => {
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <motion.div 
      className="bg-white border rounded-full p-2 shadow-md flex items-center gap-2"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="w-6 h-6 rounded-full bg-w1-primary-accent flex items-center justify-center text-xs font-semibold text-w1-primary-dark">
        {currentStep}
      </div>
      <div className="text-xs text-gray-600 pr-1">
        de <span className="font-semibold">{totalSteps}</span> perguntas
      </div>
    </motion.div>
  );
};

export default ProgressTracker;
