'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ProgressStep {
  id: number;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: number;
  className?: string;
}

export function ProgressTracker({ steps, currentStep, className }: ProgressTrackerProps) {
  return (
    <div className={cn('w-full', className)}>
      {/* Desktop horizontal view */}
      <div className="hidden md:flex items-start justify-between relative">
        {/* Connection line background */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-10" />
        {/* Active connection line */}
        <div 
          className="absolute top-6 left-0 h-1 bg-gradient-to-r from-ampra-500 to-volt-400 -z-10 transition-all duration-700"
          style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;
          
          return (
            <div 
              key={step.id} 
              className="flex flex-col items-center flex-1"
            >
              {/* Step circle */}
              <div 
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 z-10',
                  isComplete && 'bg-gradient-to-br from-ampra-500 to-volt-400 text-white shadow-lg shadow-ampra-500/30',
                  isCurrent && 'bg-white border-4 border-ampra-500 text-ampra-600 shadow-lg shadow-ampra-500/20 scale-110',
                  isPending && 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                )}
              >
                {isComplete ? (
                  <Check className="w-5 h-5" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step text */}
              <div className="mt-4 text-center px-2">
                <p className={cn(
                  'text-sm font-semibold',
                  (isComplete || isCurrent) ? 'text-slate-900' : 'text-slate-400'
                )}>
                  {step.title}
                </p>
                <p className={cn(
                  'text-xs mt-1',
                  (isComplete || isCurrent) ? 'text-slate-500' : 'text-slate-400'
                )}>
                  {step.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Mobile vertical view */}
      <div className="md:hidden space-y-0">
        {steps.map((step, index) => {
          const isComplete = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isPending = step.id > currentStep;
          const isLast = index === steps.length - 1;
          
          return (
            <div key={step.id} className="relative">
              <div className="flex items-start gap-4">
                {/* Vertical line and circle */}
                <div className="flex flex-col items-center">
                  <div 
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 z-10',
                      isComplete && 'bg-gradient-to-br from-ampra-500 to-volt-400 text-white',
                      isCurrent && 'bg-white border-4 border-ampra-500 text-ampra-600',
                      isPending && 'bg-slate-100 text-slate-400 border-2 border-slate-200'
                    )}
                  >
                    {isComplete ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  {!isLast && (
                    <div 
                      className={cn(
                        'w-0.5 h-16 transition-colors duration-500',
                        isComplete ? 'bg-gradient-to-b from-ampra-500 to-volt-400' : 'bg-slate-200'
                      )}
                    />
                  )}
                </div>
                
                {/* Step text */}
                <div className={cn('pb-8', isLast && 'pb-0')}>
                  <p className={cn(
                    'text-sm font-semibold',
                    (isComplete || isCurrent) ? 'text-slate-900' : 'text-slate-400'
                  )}>
                    {step.title}
                  </p>
                  <p className={cn(
                    'text-xs mt-1',
                    (isComplete || isCurrent) ? 'text-slate-500' : 'text-slate-400'
                  )}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
