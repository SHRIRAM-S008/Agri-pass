import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, Certificate, Batch, User } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { BatchTimeline } from '@/components/BatchTimeline';
import { QualityScoreGauge } from '@/components/QualityScoreGauge';
import { TamperAlert } from '@/components/TamperAlert';
import { InspectionChart } from '@/components/InspectionChart';
import { ArrowLeft, CheckCircle, XCircle, AlertTriangle, Shield, Package, User as UserIcon, Clock } from 'lucide-react';

export default function VerificationResult() {
  const { id } = useParams();
  const { t } = useLanguage();

  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [exporter, setExporter] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const cert = await storage.getCertificate(id);
        if (!cert) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        setCertificate(cert);

        if (cert.batchId) {
          const batchData = await storage.getBatchById(cert.batchId);
          setBatch(batchData || null);

          if (batchData && batchData.exporterId) {
            // Try to find exporter user full details
            const users = await storage.getUsers();
            const user = users.find(u => u.id === batchData.exporterId);
            setExporter(user || null);
          }
        }

        // Log verification attempt (optional, but good for history)
        if (cert) {
          // We won't block UI for this logging
          storage.createAuditLog({
            action: 'certificate_verified',
            userId: 'importer-user', // Simplified
            userName: 'Importer',
            details: { certificateId: cert.id, productType: cert.metadata?.productType || 'Unknown', status: cert.status }
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const isValid = certificate?.status === 'VALID';
  const isRevoked = certificate?.status === 'REVOKED';
  const isExpired = certificate ? new Date(certificate.validUntil) < new Date() : false;

  const getStatusInfo = () => {
    if (loading) return { icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted', title: t('loading'), message: t('loading') };

    if (notFound || !certificate) {
      return {
        icon: XCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        title: t('verificationFailed'),
        message: t('invalid')
      };
    }
    if (isRevoked) {
      return {
        icon: XCircle,
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        title: t('revoked'),
        message: t('invalid')
      };
    }
    if (isExpired) {
      return {
        icon: AlertTriangle,
        color: 'text-warning',
        bg: 'bg-warning/10',
        title: t('expired'),
        message: t('invalid')
      };
    }
    return {
      icon: CheckCircle,
      color: 'text-primary',
      bg: 'bg-primary/10',
      title: t('verificationSuccess'),
      message: t('certificateValid')
    };
  };

  const status = getStatusInfo();
  const StatusIcon = status.icon;
  const inspection = batch?.inspectionData;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/importer/scan">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('verifyCertificate')}</h1>
            <p className="text-muted-foreground">{t('certificateId')}: {id}</p>
          </div>
        </div>

        <Card className={`border-2 ${isValid ? 'border-primary/30' : 'border-destructive/30'}`}>
          <CardContent className="pt-6">
            <div className={`flex flex-col items-center text-center p-6 rounded-lg ${status.bg}`}>
              <StatusIcon className={`h-16 w-16 ${status.color} mb-4`} />
              <h2 className={`text-2xl font-bold ${status.color}`}>{status.title}</h2>
              <p className="text-muted-foreground mt-2">{status.message}</p>
            </div>
          </CardContent>
        </Card>

        {certificate && batch && (
          <>
            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>{t('batchTimeline')}</CardTitle>
              </CardHeader>
              <CardContent>
                <BatchTimeline
                  status="verified"
                  submittedAt={batch.submittedAt}
                  inspectedAt={inspection?.inspectedAt}
                  certifiedAt={certificate.issuedAt}
                  verifiedAt={new Date().toISOString().split('T')[0]}
                />
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    {t('productDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('productType')}</p>
                    <p className="font-medium">{batch.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('quantity')}</p>
                    <p className="font-medium">{batch.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('origin')}</p>
                    <p className="font-medium">{batch.farmLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('destination')}</p>
                    <p className="font-medium">{batch.destinationCountry}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5" />
                    {t('issuerInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('exporter')}</p>
                    <p className="font-medium">{exporter?.name || batch.exporterName || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('issuingAuthority')}</p>
                    <p className="font-medium">{certificate.issuer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('issueDate')}</p>
                    <p className="font-medium">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('validUntil')}</p>
                    <p className="font-medium">{new Date(certificate.validUntil).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {inspection && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      {t('inspectionResults')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div className="flex justify-center">
                        <QualityScoreGauge grade={inspection.grade} moisture={inspection.moisture} />
                      </div>
                      <div>
                        <InspectionChart
                          moisture={inspection.moisture}
                          pesticideLevel={inspection.pesticideLevel}
                          heavyMetalTest={inspection.heavyMetalTest}
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold text-primary">{inspection.grade}</p>
                        <p className="text-sm text-muted-foreground">{t('grade')}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-2xl font-bold">{inspection.moisture}%</p>
                        <p className="text-sm text-muted-foreground">{t('moistureLevel')}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-primary">{inspection.pesticideLevel}</p>
                        <p className="text-sm text-muted-foreground">{t('pesticideTest')}</p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg font-bold text-primary">{inspection.heavyMetalTest}</p>
                        <p className="text-sm text-muted-foreground">{t('heavyMetals')}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <TamperAlert
                  hash={certificate.hash}
                  isValid={certificate.status === 'VALID'}
                  isTampered={false}
                />
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('integrityHash')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{t('integrityVerified')}</p>
                    <p className="text-sm text-muted-foreground font-mono">{certificate.hash}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <div className="flex gap-4">
          <Link to="/importer/scan" className="flex-1">
            <Button variant="outline" className="w-full">{t('scanAnother')}</Button>
          </Link>
          <Link to="/importer/history" className="flex-1">
            <Button className="w-full">{t('viewHistory')}</Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
