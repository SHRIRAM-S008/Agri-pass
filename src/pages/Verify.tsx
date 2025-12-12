import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Certificate, Batch } from '@/lib/storage';
import { inji } from '@/lib/inji';
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Building,
  Calendar,
  Award,
  Loader2
} from 'lucide-react';

export default function Verify() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [certificateId, setCertificateId] = useState(id || '');
  const [verificationResult, setVerificationResult] = useState<'idle' | 'valid' | 'invalid'>('idle');
  const [certificateData, setCertificateData] = useState<Certificate | null>(null);
  const [batchData, setBatchData] = useState<Batch | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState('');

  // Handle URL params if present
  useEffect(() => {
    if (id) {
      handleVerify(id);
    }
  }, [id]);

  const handleVerify = async (idToVerify: string = certificateId) => {
    if (!idToVerify) return;

    setIsVerifying(true);
    setVerificationResult('idle');
    setVerifyMessage('Fetching Certificate...');
    setCertificateData(null);
    setBatchData(null);

    try {
      // 1. Fetch from Public Ledger (Storage)
      // In a real system, this might be resolving a DID or fetching from a blockchain
      const cert = await storage.getCertificate(idToVerify);

      if (!cert) {
        setVerificationResult('invalid');
        setVerifyMessage('Certificate not found in registry.');
        setIsVerifying(false);
        return;
      }

      setCertificateData(cert);

      // 1.5 Fetch associated batch data
      const batch = await storage.getBatchById(cert.batchId);
      if (batch) {
        setBatchData(batch);
      }

      setVerifyMessage('Verifying Cryptographic Signature with Inji...');

      // 2. Cryptographic Verification via Inji
      const result = await inji.verifyCredential(cert.vcData);

      if (result.isValid) {
        setVerificationResult('valid');
      } else {
        setVerificationResult('invalid');
        setVerifyMessage(result.message);
      }

    } catch (error) {
      console.error(error);
      setVerificationResult('invalid');
      setVerifyMessage('System Error during verification.');
    } finally {
      setIsVerifying(false);
    }
  };

  const inspection = batchData?.inspectionData;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8 sm:py-12 md:py-16 px-4">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-primary/10 mb-4 sm:mb-6">
              <QrCode className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 sm:mb-3">Verify Certificate</h1>
            <p className="text-sm sm:text-base text-muted-foreground px-4">
              Enter a certificate ID or scan a QR code to verify authenticity
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-soft mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="pl-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>
              <Button onClick={() => handleVerify()} disabled={!certificateId.trim() || isVerifying} className="w-full sm:w-auto">
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult === 'valid' && certificateData && batchData && (
            <>
              <div className="rounded-2xl border border-success/30 bg-success/5 p-6 sm:p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">Certificate Verified</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">Trusted by Inji Verify</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Certificate ID</p>
                        <p className="font-semibold text-card-foreground text-sm truncate">{certificateData.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border">
                      <Award className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="font-semibold text-success">{inspection?.grade || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-xl bg-card border border-border space-y-2 sm:space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Product</span>
                      <span className="font-medium text-card-foreground">{batchData.productType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Exporter</span>
                      <span className="font-medium text-card-foreground truncate ml-2">{batchData.exporterName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium text-card-foreground">{batchData.quantity}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Origin</span>
                      <span className="font-medium text-card-foreground truncate ml-2">{batchData.farmLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Issuer / DID</p>
                      <p className="font-semibold text-card-foreground text-xs break-all">{certificateData.vcData.issuer}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 sm:p-4 rounded-xl bg-card border border-border mt-4">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-semibold text-card-foreground">{new Date(certificateData.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {inspection && (
                <div className="p-3 sm:p-4 rounded-xl bg-card border border-border mt-4">
                  <p className="text-sm font-medium text-card-foreground mb-3">Inspection Results</p>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-muted-foreground">Moisture:</span>
                      <span className="ml-2 font-medium text-card-foreground">{inspection.moisture}%</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Heavy Metal:</span>
                      <span className="ml-2 font-medium text-success">{inspection.heavyMetalTest}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Pesticide:</span>
                      <span className="ml-2 font-medium text-card-foreground">{inspection.pesticideLevel}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4">
                <StatusBadge status={certificateData.status} />
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  Download Full Report
                </Button>
              </div>
            </>
          )}

          {verificationResult === 'invalid' && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 sm:p-8 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0">
                  <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground">Verification Failed</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    No valid certificate found. This may be fake or revoked.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                If you believe this is an error, please contact support or try with certificate ID: <strong>CERT-001</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
