import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch, Certificate } from '@/lib/storage';
import { ArrowLeft, FileText, Download, QrCode, Package, MapPin, Globe, Leaf } from 'lucide-react';
import { BatchTimeline } from '@/components/BatchTimeline';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AdminBatchDetails() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const batchData = await storage.getBatchById(id);
        setBatch(batchData || null);

        if (batchData) {
          // Find certificate for this batch
          // Since we don't have getCertificateByBatchId, we fetch all and find
          // This is efficient enough for demo scale
          const allCerts = await storage.getAllCertificates();
          const cert = allCerts.find(c => c.batchId === id);
          setCertificate(cert || null);
        }
      } catch (error) {
        console.error("Failed to fetch details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <Link to="/admin/batches" className="text-primary hover:underline mt-2 inline-block">
            Back to Batches
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Use inspection data from batch or default if missing
  const inspection = batch.inspectionData;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin/batches">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Batch Details</h1>
              <p className="text-muted-foreground">Batch ID: {batch.id}</p>
            </div>
            <StatusBadge status={batch.status} className="ml-4" />
          </div>
          <LanguageSwitcher />
        </div>

        {/* Timeline Card - Full Width */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="text-lg">{t('batchTimeline')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-8">
            <BatchTimeline
              status={batch.status.toLowerCase() as any}
              submittedAt={batch.submittedAt}
              inspectedAt={inspection?.inspectedAt}
              certifiedAt={certificate?.issuedAt}
            />
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Information Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                {t('productDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {/* Product Visual */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-muted/50 rounded-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
                  <Leaf className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{batch.productType}</h3>
                  <p className="text-sm text-muted-foreground">{batch.quantity}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {t('origin')}
                  </p>
                  <p className="font-medium">{batch.farmLocation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Globe className="h-3 w-3" /> {t('destination')}
                  </p>
                  <p className="font-medium">{batch.destinationCountry}</p>
                </div>
              </div>

              {batch.notes && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">Notes</p>
                  <p className="text-sm mt-1">{batch.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {batch.documents && batch.documents.length > 0 ? (
                  batch.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No documents uploaded</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Inspection Results Card */}
          {inspection && (
            <Card className="md:col-span-2">
              <CardHeader className="bg-gradient-to-r from-success/5 to-transparent">
                <CardTitle>{t('inspectionResults')}</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('grade')}</p>
                    <p className="font-bold text-2xl text-primary">{inspection.grade}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('moistureLevel')}</p>
                    <p className="font-bold text-xl">{inspection.moisture}%</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('pesticideTest')}</p>
                    <p className="font-medium text-sm">{inspection.pesticideLevel}</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">{t('heavyMetals')}</p>
                    <p className="font-medium text-sm">{inspection.heavyMetalTest}</p>
                  </div>
                </div>
                {inspection.comments && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">Comments</p>
                    <p className="text-sm mt-1">{inspection.comments}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Certificate Actions */}
        {certificate && (
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle>{t('digitalProductPassport')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Link to={`/admin/certificate/${certificate.id}`}>
                  <Button size="lg" className="shadow-lg">
                    <QrCode className="h-5 w-5 mr-2" />
                    {t('view')} {t('digitalProductPassport')}
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  <Download className="h-5 w-5 mr-2" />
                  {t('downloadVC')}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
