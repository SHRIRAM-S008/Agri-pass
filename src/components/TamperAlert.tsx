import { ShieldAlert, ShieldCheck, AlertTriangle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface TamperAlertProps {
  hash: string;
  isValid: boolean;
  isTampered?: boolean;
  className?: string;
}

export function TamperAlert({ hash, isValid, isTampered = false, className }: TamperAlertProps) {
  const { t } = useLanguage();

  if (isTampered) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-lg border-2 border-destructive bg-destructive/5 p-4',
          className
        )}
      >
        {/* Animated warning stripes */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                hsl(var(--destructive)),
                hsl(var(--destructive)) 10px,
                transparent 10px,
                transparent 20px
              )`,
              animation: 'slide 1s linear infinite',
            }}
          />
        </div>

        <div className="relative flex items-start gap-4">
          <div className="shrink-0">
            <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center animate-pulse">
              <ShieldAlert className="h-6 w-6 text-destructive-foreground" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <h4 className="font-bold text-destructive text-lg">
                {t('tamperDetected')}
              </h4>
            </div>
            <p className="mt-1 text-sm text-destructive/80">
              {t('dataMismatch')}
            </p>
            <div className="mt-3 p-2 bg-destructive/10 rounded font-mono text-xs text-destructive break-all">
              Hash mismatch: {hash.slice(0, 16)}...
            </div>
          </div>
        </div>

        <style>{`
          @keyframes slide {
            from { transform: translateX(-20px); }
            to { transform: translateX(0px); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-lg border border-primary/30 bg-primary/5 p-4',
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h4 className="font-semibold text-foreground">
              {t('securityShield')}
            </h4>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('integrityVerified')}
          </p>
          <div className="mt-3 p-2 bg-primary/10 rounded font-mono text-xs text-primary/80 break-all">
            SHA-256: {hash}
          </div>
        </div>
      </div>
    </div>
  );
}
