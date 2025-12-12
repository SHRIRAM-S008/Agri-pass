import { cn } from '@/lib/utils';

interface QualityScoreGaugeProps {
  grade: string;
  moisture: number;
  className?: string;
}

export function QualityScoreGauge({ grade, moisture, className }: QualityScoreGaugeProps) {
  // Calculate score based on grade
  const getScoreFromGrade = (grade: string): number => {
    const gradeScores: Record<string, number> = {
      'A+': 98,
      'A': 90,
      'B+': 85,
      'B': 80,
      'C+': 75,
      'C': 70,
      'D': 60,
      'F': 40,
    };
    return gradeScores[grade] || 75;
  };

  const score = getScoreFromGrade(grade);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-primary';
    if (score >= 75) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getStrokeColor = (score: number) => {
    if (score >= 90) return 'stroke-primary';
    if (score >= 75) return 'stroke-success';
    if (score >= 60) return 'stroke-warning';
    return 'stroke-destructive';
  };

  return (
    <div className={cn('relative flex flex-col items-center', className)}>
      <svg className="w-32 h-32 transform -rotate-90">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn('transition-all duration-1000 ease-out', getStrokeColor(score))}
        />
      </svg>
      
      {/* Score display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('text-3xl font-bold', getScoreColor(score))}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">Quality Score</span>
      </div>

      {/* Grade badge */}
      <div className="mt-3 flex items-center gap-2">
        <div className={cn(
          'px-3 py-1 rounded-full text-sm font-bold',
          score >= 90 ? 'bg-primary/10 text-primary' :
          score >= 75 ? 'bg-success/10 text-success' :
          score >= 60 ? 'bg-warning/10 text-warning' :
          'bg-destructive/10 text-destructive'
        )}>
          Grade: {grade}
        </div>
      </div>

      {/* Moisture indicator */}
      <div className="mt-2 text-xs text-muted-foreground">
        Moisture: {moisture}%
      </div>
    </div>
  );
}
