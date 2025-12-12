import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Link as LinkIcon, QrCode } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { QRScanner } from '@/components/QRScanner';

export default function ScanQR() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showScanner, setShowScanner] = useState(false);
  const [manualCode, setManualCode] = useState('');

  const handleQRScan = (data: string) => {
    toast.success('QR Code detected!');
    // Try to extract certificate ID from QR data
    try {
      const parsed = JSON.parse(atob(data));
      navigate(`/importer/result/${parsed.id}`);
    } catch {
      // If not our format, treat as certificate ID
      navigate(`/importer/result/${data}`);
    }
  };

  const handleManualVerify = () => {
    if (manualCode.trim()) {
      navigate(`/importer/result/${manualCode.trim()}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.info('Processing uploaded QR code...');
      setTimeout(() => {
        navigate('/importer/result/CERT-001');
      }, 1000);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t('scanQRCode')}</h1>
          <p className="text-muted-foreground">{t('verifyCertificateDesc')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 justify-center">
              <Camera className="h-5 w-5" />
              {t('cameraScanner')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showScanner ? (
              <QRScanner onScan={handleQRScan} onClose={() => setShowScanner(false)} />
            ) : (
              <div className="aspect-square max-w-sm mx-auto bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <Button onClick={() => setShowScanner(true)}>
                    {t('startCameraScan')}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Upload className="h-4 w-4" />
                {t('uploadQRImage')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <label className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors block">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">{t('dragAndDrop')}</p>
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <LinkIcon className="h-4 w-4" />
                {t('enterCertificateId')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="e.g., CERT-001"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
              />
              <Button className="w-full" variant="outline" onClick={handleManualVerify}>
                {t('verify')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
