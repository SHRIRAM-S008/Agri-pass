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
      <div className="container py-16">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-6">
              <QrCode className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Verify Certificate</h1>
            <p className="text-muted-foreground">
              Enter a certificate ID or scan a QR code to verify authenticity
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft mb-8">
            <div className="flex gap-3">
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
              <Button onClick={() => handleVerify()} disabled={!certificateId.trim() || isVerifying}>
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </div>

          {/* Verification Result */}
          {verificationResult === 'valid' && certificateData && batchData && (
            <>
              <div className="rounded-2xl border border-success/30 bg-success/5 p-8 animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">Certificate Verified</h3>
                    <p className="text-sm text-muted-foreground">Trusted by Inji Verify</p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                      <FileText className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Certificate ID</p>
                        <p className="font-semibold text-card-foreground text-sm">{certificateData.id}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                      <Award className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Grade</p>
                        <p className="font-semibold text-success">{inspection?.grade || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-card border border-border space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Product</span>
                      <span className="text-sm font-medium text-card-foreground">{batchData.productType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Exporter</span>
                      <span className="text-sm font-medium text-card-foreground">{batchData.exporterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Quantity</span>
                      <span className="text-sm font-medium text-card-foreground">{batchData.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Origin</span>
                      <span className="text-sm font-medium text-card-foreground">{batchData.farmLocation}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
                    <Building className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">Issuer / DID</p>
                      <p className="font-semibold text-card-foreground text-xs break-all">{certificateData.vcData.issuer}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border mt-4">
                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-semibold text-card-foreground">{new Date(certificateData.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>

              {inspection && (
                <div className="p-4 rounded-xl bg-card border border-border mt-4">
                  <p className="text-sm font-medium text-card-foreground mb-3">Inspection Results</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
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

              <div className="flex justify-between items-center pt-4">
                <StatusBadge status={certificateData.status} />
                <Button variant="outline" size="sm">
                  Download Full Report
                </Button>
              </div>
            </>
          )}

          {verificationResult === 'invalid' && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">Verification Failed</h3>
                  <p className="text-sm text-muted-foreground">
                    No valid certificate found. This may be fake or revoked.
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                If you believe this is an error, please contact support or try with certificate ID: <strong>CERT-001</strong>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
