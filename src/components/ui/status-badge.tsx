import { cn } from '@/lib/utils';

type Status = 'submitted' | 'in_inspection' | 'certified' | 'rejected' | 'pending' | 'in_progress' | 'completed' | 'valid' | 'revoked' | 'expired' | 'inspected';

const statusStyles: Record<string, string> = {
  submitted: 'bg-secondary text-secondary-foreground',
  pending: 'bg-secondary text-secondary-foreground',
  in_inspection: 'bg-warning/15 text-warning',
  inspected: 'bg-warning/15 text-warning',
  in_progress: 'bg-warning/15 text-warning',
  certified: 'bg-success/15 text-success',
  completed: 'bg-success/15 text-success',
  valid: 'bg-success/15 text-success',
  rejected: 'bg-destructive/15 text-destructive',
  revoked: 'bg-destructive/15 text-destructive',
  expired: 'bg-destructive/15 text-destructive',
};

const statusLabels: Record<string, string> = {
  submitted: 'Submitted',
  pending: 'Pending',
  in_inspection: 'In Inspection',
  inspected: 'Inspected',
  in_progress: 'In Progress',
  certified: 'Certified',
  completed: 'Completed',
  valid: 'Valid',
  rejected: 'Rejected',
  revoked: 'Revoked',
  expired: 'Expired',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();
  // Handle some specific mappings if DB status != valid keys above
  const key = normalizedStatus === 'inspected' ? 'inspected' : normalizedStatus;

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      statusStyles[key] || 'bg-muted text-muted-foreground',
      className
    )}>
      {statusLabels[key] || status}
    </span>
  );
}
