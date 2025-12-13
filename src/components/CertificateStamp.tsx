import { Shield, Check, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateStampProps {
  issuer: string;
  issuedAt: string;
  validUntil: string;
  status: 'valid' | 'revoked' | 'expired';
  className?: string;
}

export function CertificateStamp({
  issuer,
  issuedAt,
  validUntil,
  status,
  className,
}: CertificateStampProps) {
  const isValid = status === 'valid';
  const isExpired = status === 'expired' || new Date(validUntil) < new Date();

  return (
    <div className={cn('relative', className)}>
      {/* Outer decorative ring */}
      <div
        className={cn(
          'w-40 h-40 rounded-full border-4 border-dashed flex items-center justify-center',
          isValid ? 'border-primary' : 'border-destructive'
        )}
        style={{
          background: `repeating-conic-gradient(
            from 0deg,
            transparent 0deg 10deg,
            ${isValid ? 'hsl(var(--primary) / 0.05)' : 'hsl(var(--destructive) / 0.05)'} 10deg 20deg
          )`,
        }}
      >
        {/* Inner stamp */}
        <div
          className={cn(
            'w-32 h-32 rounded-full border-2 flex flex-col items-center justify-center p-3',
            isValid ? 'border-primary bg-primary/5' : 'border-destructive bg-destructive/5'
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center mb-1',
              isValid ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
            )}
          >
            {isValid ? <Award className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
          </div>

          {/* Status text */}
          <span
            className={cn(
              'text-xs font-bold uppercase tracking-wider',
              isValid ? 'text-primary' : 'text-destructive'
            )}
          >
            {isValid ? 'Certified' : isExpired ? 'Expired' : 'Revoked'}
          </span>

          {/* Issuer (abbreviated) */}
          <span className="text-[8px] text-muted-foreground text-center mt-1 leading-tight">
            {(issuer || '').split(' ').slice(0, 2).join(' ')}
          </span>

          {/* Date */}
          <span className="text-[8px] text-muted-foreground mt-1">
            {new Date(issuedAt).toLocaleDateString('en-US', {
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Verification badge */}
      {isValid && (
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
          <Check className="h-3 w-3" />
          VERIFIED
        </div>
      )}
    </div>
  );
}
