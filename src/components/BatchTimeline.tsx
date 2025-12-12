import { Check, Clock, Package, Search, FileCheck, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TimelineStep {
  id: string;
  label: string;
  labelHi: string;
  date?: string;
  completed: boolean;
  current?: boolean;
  icon: React.ReactNode;
}

interface BatchTimelineProps {
  status: 'submitted' | 'in_inspection' | 'certified' | 'rejected' | 'verified';
  submittedAt: string;
  inspectedAt?: string;
  certifiedAt?: string;
  verifiedAt?: string;
  className?: string;
}

export function BatchTimeline({
  status,
  submittedAt,
  inspectedAt,
  certifiedAt,
  verifiedAt,
  className,
}: BatchTimelineProps) {
  const { language } = useLanguage();

  const getSteps = (): TimelineStep[] => {
    const isRejected = status === 'rejected';
    
    return [
      {
        id: 'submitted',
        label: 'Submitted',
        labelHi: 'जमा किया गया',
        date: submittedAt,
        completed: true,
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: 'under_review',
        label: 'Under Review',
        labelHi: 'समीक्षाधीन',
        date: submittedAt,
        completed: status !== 'submitted',
        current: status === 'submitted',
        icon: <Search className="h-4 w-4" />,
      },
      {
        id: 'inspected',
        label: isRejected ? 'Rejected' : 'Inspected',
        labelHi: isRejected ? 'अस्वीकृत' : 'निरीक्षित',
        date: inspectedAt,
        completed: ['in_inspection', 'certified', 'rejected', 'verified'].includes(status),
        current: status === 'in_inspection',
        icon: <FileCheck className="h-4 w-4" />,
      },
      {
        id: 'certified',
        label: 'Certified',
        labelHi: 'प्रमाणित',
        date: certifiedAt,
        completed: ['certified', 'verified'].includes(status),
        current: status === 'certified',
        icon: <ShieldCheck className="h-4 w-4" />,
      },
      {
        id: 'verified',
        label: 'Verified',
        labelHi: 'सत्यापित',
        date: verifiedAt,
        completed: status === 'verified',
        icon: <Check className="h-4 w-4" />,
      },
    ];
  };

  const steps = getSteps();

  return (
    <div className={cn('relative', className)}>
      {/* Progress bar background */}
      <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />
      
      {/* Progress bar fill */}
      <div
        className="absolute top-5 left-0 h-1 bg-primary rounded-full transition-all duration-500"
        style={{
          width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%`,
        }}
      />

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            {/* Icon circle */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                step.completed
                  ? 'bg-primary border-primary text-primary-foreground'
                  : step.current
                  ? 'bg-background border-primary text-primary animate-pulse'
                  : 'bg-muted border-muted-foreground/30 text-muted-foreground'
              )}
            >
              {step.completed ? <Check className="h-4 w-4" /> : step.icon}
            </div>

            {/* Label */}
            <span
              className={cn(
                'mt-2 text-xs font-medium text-center max-w-[80px]',
                step.completed
                  ? 'text-foreground'
                  : step.current
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {language === 'hi' ? step.labelHi : step.label}
            </span>

            {/* Date */}
            {step.date && step.completed && (
              <span className="mt-1 text-[10px] text-muted-foreground">
                {new Date(step.date).toLocaleDateString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
