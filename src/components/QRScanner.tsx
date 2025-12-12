import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';
import { Camera, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanning = async () => {
    if (!containerRef.current) return;
    
    try {
      setError(null);
      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;
      
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          onScan(decodedText);
          stopScanning();
        },
        () => {
          // Ignore scan failures
        }
      );
      
      setIsScanning(true);
    } catch (err) {
      setError('Camera access denied or not available');
      console.error('QR Scanner error:', err);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="relative">
      <div 
        id="qr-reader" 
        ref={containerRef}
        className="w-full max-w-sm mx-auto aspect-square bg-muted rounded-lg overflow-hidden"
      />
      
      {!isScanning && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <Camera className="h-16 w-16 text-muted-foreground" />
          <Button onClick={startScanning} className="gap-2">
            <Camera className="h-4 w-4" />
            {t('startCameraScan')}
          </Button>
        </div>
      )}
      
      {isScanning && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={stopScanning} className="gap-2">
            <X className="h-4 w-4" />
            {t('cancel')}
          </Button>
        </div>
      )}
      
      {error && (
        <p className="text-center text-destructive text-sm mt-4">{error}</p>
      )}
    </div>
  );
}
