import { cn } from '@/lib/utils';

interface QualityScoreGaugeProps {
  grade: string;
  moisture: number;
  className?: string;
}

export function QualityScoreGauge({ grade, moisture, className }: QualityScoreGaugeProps) {
  // Ensure grade has a value, fallback to 'N/A' if empty
  const displayGrade = grade && grade.trim() !== '' ? grade : 'N/A';

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

  const score = getScoreFromGrade(displayGrade);
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
    <div className={cn('relative flex flex-col items-center gap-4', className)}>
      {/* Circular Gauge */}
      <div className="relative">
        <svg className="w-40 h-40 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            className="text-muted/30"
          />
          {/* Progress circle */}
          <circle
            cx="80"
            cy="80"
            r="60"
            stroke="currentColor"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn('transition-all duration-1000 ease-out', getStrokeColor(score))}
          />
        </svg>

        {/* Score display - centered in the circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
          <span className={cn('text-4xl font-bold', getScoreColor(score))}>
            {score}
          </span>
          <span className="text-xs text-muted-foreground mt-1">Quality Score</span>
        </div>
      </div>

      {/* Grade and Moisture Info */}
      <div className="flex flex-col items-center gap-2 w-full">
        {/* Grade badge */}
        <div className={cn(
          'px-4 py-2 rounded-lg text-base font-semibold',
          score >= 90 ? 'bg-primary/10 text-primary' :
            score >= 75 ? 'bg-success/10 text-success' :
              score >= 60 ? 'bg-warning/10 text-warning' :
                'bg-destructive/10 text-destructive'
        )}>
          Grade: {displayGrade}
        </div>

        {/* Moisture indicator */}
        <div className="text-sm text-muted-foreground">
          Moisture: <span className="font-medium text-foreground">{moisture}%</span>
        </div>
      </div>
    </div>
  );
}
