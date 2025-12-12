import { useState } from 'react';
import { decodePixelPass } from '@/lib/pixelpass';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, XCircle, ShieldCheck, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function OfflineVerification() {
    const [inputData, setInputData] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleVerify = () => {
        setError('');
        setResult(null);

        if (!inputData.trim()) {
            setError('Please enter QR code data');
            return;
        }

        try {
            const decoded = decodePixelPass(inputData);
            if (decoded) {
                setResult(decoded);
            } else {
                setError('Invalid QR Code Format');
            }
        } catch (e) {
            setError('Failed to decode certificate');
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                        <WifiOff className="h-8 w-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold">Offline Verification</h1>
                    <p className="text-muted-foreground">
                        Verify Agri-Pass certificates without an internet connection using PixelPass technology.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Scan or Input QR Data</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            placeholder="Paste QR Code content here (HC1:...)"
                            value={inputData}
                            onChange={(e) => setInputData(e.target.value)}
                            className="min-h-[100px] font-mono text-xs"
                        />
                        <Button className="w-full" onClick={handleVerify}>
                            Verify Certificate
                        </Button>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 rounded-lg bg-destructive/10 text-destructive flex items-center gap-2">
                        <XCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </div>
                )}

                {result && (
                    <Card className="border-primary/50 animate-in fade-in slide-in-from-bottom-4">
                        <CardHeader className="bg-primary/5 border-b border-primary/10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Certificate Valid
                                </CardTitle>
                                <span className={cn(
                                    "px-2 py-1 rounded text-xs font-bold",
                                    result.stat === 'V' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                )}>
                                    {result.stat === 'V' ? 'VALID' : 'REVOKED'}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Product</p>
                                    <p className="font-semibold">{result.prod}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Grade</p>
                                    <p className="font-semibold">{result.grade}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Issue Date</p>
                                    <p className="font-semibold">{new Date(result.date).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Certificate ID</p>
                                    <p className="font-mono text-xs truncate" title={result.id}>{result.id}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-dashed">
                                <p className="text-center text-xs text-muted-foreground">
                                    Verified locally using cryptographic signature (Simulated)
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
