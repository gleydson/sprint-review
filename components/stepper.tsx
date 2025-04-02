'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IconCheck, IconChevronRight } from '@tabler/icons-react';
import * as React from 'react';

interface Step {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  onComplete?: () => void;
  className?: string;
}

export function Stepper({ steps, onComplete, className }: StepperProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    // Only allow clicking on completed steps or the next available step
    if (
      completedSteps.includes(index) ||
      index === 0 ||
      completedSteps.includes(index - 1)
    ) {
      setCurrentStep(index);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={cn('flex flex-col md:flex-row gap-8', className)}>
      <div className="md:w-64 flex-shrink-0">
        <div className="space-y-1">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isClickable =
              isCompleted || index === 0 || completedSteps.includes(index - 1);

            return (
              <button
                key={step.id}
                type="button"
                className={cn(
                  'flex items-center w-full text-left p-3 rounded-md transition-colors',
                  isClickable
                    ? 'cursor-pointer'
                    : 'cursor-not-allowed opacity-60',
                  isCurrent && 'bg-muted',
                  isCompleted && !isCurrent && 'text-muted-foreground',
                )}
                onClick={() => handleStepClick(index)}
                disabled={!isClickable}
              >
                <div className="flex items-center justify-center mr-3">
                  <div
                    className={cn(
                      'flex size-8 items-center justify-center rounded-full border text-xs font-medium',
                      isCurrent &&
                        'border-primary bg-primary text-primary-foreground',
                      isCompleted &&
                        'bg-primary border-primary text-primary-foreground',
                      !(isCurrent || isCompleted) && 'border-muted-foreground',
                    )}
                  >
                    {isCompleted ? <IconCheck className="size-4" /> : index + 1}
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{step.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {step.description}
                  </span>
                </div>
                {isClickable && !isCurrent && (
                  <IconChevronRight className="ml-auto size-4 text-muted-foreground" />
                )}
              </button>
            );
          })}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep].title}</CardTitle>
          <CardDescription>{steps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>{steps[currentStep].component}</CardContent>
        <CardFooter className="flex justify-between">
          {currentStep !== 0 ? (
            <Button variant="outline" onClick={handlePrevious}>
              Previous
            </Button>
          ) : null}
          <Button onClick={handleNext} className="ml-auto">
            {isLastStep ? 'Complete' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
