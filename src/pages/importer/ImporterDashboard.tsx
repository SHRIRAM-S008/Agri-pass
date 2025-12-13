import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storage, Certificate, Batch } from '@/lib/storage';
import { StatusBadge } from '@/components/ui/status-badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { QrCode, Search, Upload, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ImporterDashboard() {
  const { t } = useLanguage();
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);

  const handleVerify = async () => {
    try {
      const cert = await storage.getCertificate(certificateId);

      if (cert && cert.status === 'VALID') {
        setVerificationResult('valid');
        setCertificateData(cert);
        const b = await storage.getBatchById(cert.batchId);
        setBatch(b || null);
      } else {
        setVerificationResult('invalid');
        setCertificateData(null);
        setBatch(null);
      }
    } catch (e) {
      setVerificationResult('invalid');
      setCertificateData(null);
      setBatch(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">{t('verifyCertificate')}</h1>
          <p className="text-muted-foreground">{t('verifyCertificateDesc')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`${t('enterCertificateId')} (e.g., CERT-001)`}
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                className="pl-10"
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              />
            </div>
            <Button onClick={handleVerify} disabled={!certificateId.trim()}>
              {t('verify')}
            </Button>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <Link to="/importer/scan">
              <Button variant="outline" className="gap-2 h-auto py-8 flex-col w-full">
                <QrCode className="h-6 w-6" />
                <span className="text-base font-medium">{t('scanQRCode')}</span>
              </Button>
            </Link>
            <Button variant="outline" className="gap-2 h-auto py-8 flex-col">
              <Upload className="h-6 w-6" />
              <span className="text-base font-medium">{t('uploadVCFile')}</span>
            </Button>
          </div>
        </div>

        {verificationResult === 'valid' && certificateData && batch && (
          <div className="rounded-xl border border-success/30 bg-success/5 p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-success" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('certificateValid')}</h3>
                <p className="text-sm text-muted-foreground">{certificateData.id}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t('product')}</span>
                <span className="font-medium text-foreground">{batch.productType}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t('grade')}</span>
                <span className="font-medium text-success">{batch.inspectionData?.grade || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t('exporter')}</span>
                <span className="font-medium text-foreground">{batch.exporterName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t('quantity')}</span>
                <span className="font-medium text-foreground">{batch.quantity}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">{t('issuingAuthority')}</span>
                <span className="font-medium text-foreground">Inji Certify</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">{t('issuedDate')}</span>
                <span className="font-medium text-foreground">{new Date(certificateData.issuedAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <StatusBadge status={certificateData.status === 'VALID' ? 'certified' : 'rejected'} />
              <Button variant="outline" size="sm">{t('downloadReport')}</Button>
            </div>
          </div>
        )}

        {verificationResult === 'invalid' && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{t('verificationFailed')}</h3>
                <p className="text-sm text-muted-foreground">{t('invalid')}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
