import { WifiOff, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';

interface OfflineQRBadgeProps {
  className?: string;
}

export function OfflineQRBadge({ className }: OfflineQRBadgeProps) {
  const { t } = useLanguage();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium',
        'bg-accent/10 text-accent border border-accent/20',
        className
      )}
    >
      <WifiOff className="h-3 w-3" />
      <span>{t('offlineVerification')}</span>
      <Check className="h-3 w-3" />
    </div>
  );
}

// Generate compressed QR data for offline verification
export function generateOfflineQRData(certificate: {
  id: string;
  productType: string;
  grade: string;
  status: string;
  issuedAt: string;
  issuerName: string;
  hash: string;
}): string {
  // Compressed format: ID|Product|Grade|Status|Date|Issuer|Hash
  const compressed = [
    certificate.id,
    certificate.productType.slice(0, 20),
    certificate.grade,
    certificate.status === 'valid' ? 'V' : 'R',
    certificate.issuedAt,
    certificate.issuerName.slice(0, 15),
    certificate.hash.slice(0, 8),
  ].join('|');

  // In production, this would be signed with a private key
  return `AGRI:${btoa(compressed)}`;
}

// Parse offline QR data
export function parseOfflineQRData(data: string): {
  isValid: boolean;
  certificateId?: string;
  productType?: string;
  grade?: string;
  status?: string;
  issuedAt?: string;
  issuer?: string;
  hashPrefix?: string;
} | null {
  try {
    if (!data.startsWith('AGRI:')) {
      return null;
    }

    const decoded = atob(data.slice(5));
    const parts = decoded.split('|');

    if (parts.length !== 7) {
      return null;
    }

    return {
      isValid: true,
      certificateId: parts[0],
      productType: parts[1],
      grade: parts[2],
      status: parts[3] === 'V' ? 'valid' : 'revoked',
      issuedAt: parts[4],
      issuer: parts[5],
      hashPrefix: parts[6],
    };
  } catch {
    return null;
  }
}
