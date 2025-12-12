import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, Certificate, Batch } from '@/lib/storage';
import { ArrowLeft, Shield, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';

export default function QACertificateDetails() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState<Certificate | undefined>(undefined);
  const [batch, setBatch] = useState<Batch | undefined>(undefined);
  const [isRevoked, setIsRevoked] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const cert = await storage.getCertificate(id);
        if (cert) {
          setCertificate(cert);
          const b = await storage.getBatchById(cert.batchId);
          setBatch(b);
          setIsRevoked(cert.status === 'REVOKED');
        }
      }
    };
    fetchData();
  }, [id]);

  const inspection = batch?.inspectionData;
  const exporter = batch ? { name: batch.exporterName } : null; // In real app, fetch exporter details

  if (!certificate || !batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Certificate not found</h2>
          <Link to="/qa/certificates" className="text-primary hover:underline mt-2 inline-block">
            Back to Certificates
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleRevoke = async () => {
    await storage.updateBatchStatus(batch.id, 'REJECTED'); // Or a new status REVOKED
    // In a real app we would update the certificate object too
    certificate.status = 'REVOKED';
    setIsRevoked(true);
    toast.success('Certificate has been revoked locally');
  };

  const handleRestore = () => {
    certificate.status = 'VALID';
    setIsRevoked(false);
    toast.success('Certificate has been restored locally');
  };

  const auditLogs = [
    { action: 'Certificate Issued', user: 'QA Inspector', timestamp: certificate.issuedAt },
    { action: 'Certificate Verified', user: 'System', timestamp: new Date().toISOString() },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/qa/certificates">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Certificate Details</h1>
            <p className="text-muted-foreground">ID: {certificate.id}</p>
          </div>
          <div className={`ml-auto flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${isRevoked ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            {isRevoked ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {isRevoked ? 'Revoked' : 'Valid'}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Certificate Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Product Details</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{batch.productType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Quantity</p>
                        <p className="font-medium">{batch.quantity}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Exporter</p>
                        <p className="font-medium">{exporter?.name || 'N/A'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold">Inspection Results</h3>
                    {inspection && (
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <p className="font-medium text-primary">{inspection.grade}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Moisture</p>
                          <p className="font-medium">{inspection.moisture}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-border grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Issued</p>
                    <p className="font-medium">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valid Until</p>
                    <p className="font-medium">{certificate.vcData.expiration || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hash</p>
                    <p className="font-mono text-xs truncate">{certificate.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Audit Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLogs.map((log, index) => (
                    <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{log.action}</p>
                        <p className="text-sm text-muted-foreground">
                          By {log.user} • {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-48 h-48 bg-white p-4 rounded-lg flex items-center justify-center mb-4">
                  <QRCode
                    value={certificate.id}
                    size={160}
                    level="H"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isRevoked ? (
                  <Button className="w-full" onClick={handleRestore}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Restore Certificate
                  </Button>
                ) : (
                  <Button variant="destructive" className="w-full" onClick={handleRevoke}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Revoke Certificate
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
