import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage, Certificate as CertificateType, Batch } from '@/lib/storage';
import { ArrowLeft, Download, ExternalLink, Shield, CheckCircle, Leaf, MapPin, Globe, Calendar, Building2 } from 'lucide-react';
import QRCode from 'react-qr-code';
import { BatchTimeline } from '@/components/BatchTimeline';
import { QualityScoreGauge } from '@/components/QualityScoreGauge';
import { CertificateStamp } from '@/components/CertificateStamp';
import { TamperAlert } from '@/components/TamperAlert';
import { InspectionChart } from '@/components/InspectionChart';
import { OfflineQRBadge, generateOfflineQRData } from '@/components/OfflineQRBadge';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { generateProfessionalPDF } from '@/lib/pdfGenerator';
import { encodePixelPass, calculateHash } from '@/lib/pixelpass';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Certificate() {
  const { id } = useParams();
  const { t } = useLanguage();
  const [certificate, setCertificate] = useState<CertificateType | undefined>(undefined);
  const [batch, setBatch] = useState<Batch | undefined>(undefined);

  /* Tamper Detection State - Must be declared before any conditional returns */
  const [loading, setLoading] = useState(true);
  const [isTampered, setIsTampered] = useState(false);
  const [computedHash, setComputedHash] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (id) {
        try {
          const cert = await storage.getCertificate(id);
          if (cert) {
            setCertificate(cert);
            // Only fetch batch if certificate exists and has batchId
            if (cert.batchId) {
              const b = await storage.getBatchById(cert.batchId);
              setBatch(b);
            }
          }
        } catch (error) {
          console.error("Failed to fetch certificate data", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  /* Tamper Detection Logic */
  useEffect(() => {
    const verifyIntegrity = async () => {
      if (!certificate) return;

      // Re-compute hash from current data
      const dataToHash = `${certificate.id}|${certificate.batchId}|${certificate.status}|${certificate.issuedAt}`;
      const hash = await calculateHash(dataToHash);
      setComputedHash(hash);

      if (certificate.hash && hash !== certificate.hash) {
        setIsTampered(true);
      }
    };
    verifyIntegrity();
  }, [certificate]);

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

  if (!certificate || !batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Certificate not found</h2>
          <Link to="/exporter/certificates" className="text-primary hover:underline mt-2 inline-block">
            Back to Certificates
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Generate PixelPass QR
  const offlineQRData = certificate && batch ? encodePixelPass({
    id: certificate.id,
    prod: batch.productType,
    grade: inspection?.grade || 'N/A',
    stat: certificate.status === 'VALID' ? 'V' : 'R',
    date: certificate.issuedAt
  }) : '';

  const handleDownloadPDF = async () => {
    if (!certificate || !batch || !inspection) return;
    try {
      await generateProfessionalPDF({
        id: certificate.id,
        issuedAt: certificate.issuedAt,
        validUntil: certificate.validUntil,
        issuer: certificate.vcData.issuer,
        productType: batch.productType,
        quantity: batch.quantity,
        origin: batch.farmLocation,
        destination: batch.destinationCountry,
        grade: inspection.grade,
        moisture: inspection.moisture.toString(),
        qrData: offlineQRData
      });
      toast.success('Certificate PDF downloaded successfully');
    } catch (e) {
      console.error(e);
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link to="/exporter/certificates">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('digitalProductPassport')}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground break-all">{t('certificateId')}: {certificate.id}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Timeline Section */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5 p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">{t('batchTimeline')}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-4 sm:px-8 overflow-x-auto">
            <div className="min-w-[300px]">
              <BatchTimeline
                status={batch.status.toLowerCase() as any}
                submittedAt={batch.submittedAt}
                inspectedAt={inspection?.inspectedAt}
                certifiedAt={certificate.issuedAt}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content - Left 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verified Certificate Header Card */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 overflow-hidden relative">
              {/* Decorative background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
              </div>

              <CardHeader className="relative p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    {t('verifiedCertificate')}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs sm:text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                      {t('valid')}
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative space-y-6 p-4 sm:p-6 pt-0">
                {/* Product Hero Section */}
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image Placeholder */}
                  <div className="w-full md:w-48 h-40 sm:h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center border border-border">
                    <div className="text-center">
                      <Leaf className="h-12 w-12 sm:h-16 sm:w-16 text-primary mx-auto mb-2" />
                      <span className="text-sm font-medium text-muted-foreground">{batch.productType}</span>
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">{t('productType')}</p>
                      <p className="font-semibold text-base sm:text-lg">{batch.productType}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground">{t('quantity')}</p>
                      <p className="font-semibold text-base sm:text-lg">{batch.quantity}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {t('origin')}
                      </p>
                      <p className="font-medium text-sm sm:text-base">{batch.farmLocation}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                        <Globe className="h-3 w-3" /> {t('destination')}
                      </p>
                      <p className="font-medium text-sm sm:text-base">{batch.destinationCountry}</p>
                    </div>
                  </div>
                </div>

                {/* Inspection Results Section */}
                {inspection && (
                  <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
                    {/* Quality Score Gauge */}
                    <div className="flex justify-center">
                      <QualityScoreGauge
                        grade={inspection.grade}
                        moisture={inspection.moisture}
                      />
                    </div>

                    {/* Inspection Chart */}
                    <div className="min-h-[200px]">
                      <InspectionChart
                        moisture={inspection.moisture}
                        pesticideLevel={inspection.pesticideLevel}
                        heavyMetalTest={inspection.heavyMetalTest}
                      />
                    </div>
                  </div>
                )}

                {/* Detailed Inspection Results */}
                {inspection && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-border">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('moistureLevel')}</p>
                      <p className="font-bold text-primary text-lg sm:text-xl">{inspection.moisture}%</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('pesticideTest')}</p>
                      <p className="font-medium text-xs sm:text-sm">{inspection.pesticideLevel}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('heavyMetals')}</p>
                      <p className="font-medium text-xs sm:text-sm">{inspection.heavyMetalTest}</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">{t('isoStandard')}</p>
                      <p className="font-medium text-xs sm:text-sm">{inspection.isoCode}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Issuer Information */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  {t('issuerInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('issuingAuthority')}</p>
                    <p className="font-medium text-sm sm:text-base">{certificate.vcData.issuer}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {t('issueDate')}
                    </p>
                    <p className="font-medium text-sm sm:text-base">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('validUntil')}</p>
                    <p className="font-medium text-sm sm:text-base">{certificate.vcData.expiration || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('certificateHash')}</p>
                    <p className="font-mono text-[10px] sm:text-xs bg-muted px-2 py-1 rounded truncate">{certificate.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tamper Alert / Security Shield */}
            <TamperAlert
              hash={certificate.hash || 'UNKNOWN'}
              isValid={certificate.status === 'VALID'}
              isTampered={isTampered}
            />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Certificate Stamp */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-center text-lg">{t('certificateStamp')}</CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center pb-6">
                <CertificateStamp
                  issuer={certificate.issuer || 'National Quality Agency'}
                  issuedAt={certificate.issuedAt}
                  validUntil={certificate.vcData.expiration || '2025-12-31'}
                  status={certificate.status.toLowerCase() as 'valid' | 'revoked' | 'expired'}
                />
              </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">QR Code</CardTitle>
                  {certificate.qrBase64 ? (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs text-primary bg-primary/10 px-2 py-1 rounded-full">
                      <Shield className="h-3 w-3" />
                      Inji Certified
                    </div>
                  ) : (
                    <OfflineQRBadge />
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center p-4 sm:p-6 pt-0">
                <div className="w-40 h-40 sm:w-48 sm:h-48 bg-white p-3 sm:p-4 rounded-lg flex items-center justify-center border border-border shadow-inner">
                  {certificate.qrBase64 && !certificate.qrBase64.includes('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==') ? (
                    // Display Inji-generated QR code
                    <img
                      src={certificate.qrBase64}
                      alt="Inji Certificate QR"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    // Fallback to PixelPass QR
                    <QRCode
                      value={offlineQRData}
                      size={160}
                      level="L"
                      bgColor="transparent"
                      className="w-full h-full"
                    />
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mt-4">
                  {t('scanToVerify')}
                </p>
                <p className="text-[10px] sm:text-xs text-accent mt-2 text-center">
                  ✓ {certificate.qrBase64 ? 'Inji Wallet Compatible' : t('offlineVerification')}
                </p>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-lg">{t('actions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 sm:p-6 pt-0">
                <Button className="w-full" onClick={handleDownloadPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  {t('downloadVC')}
                </Button>

                <Button variant="outline" className="w-full">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {t('addToWallet')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
