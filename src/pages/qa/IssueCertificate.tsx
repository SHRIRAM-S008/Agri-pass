import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { storage, Batch, Certificate } from '@/lib/storage';
import { ArrowLeft, Shield, CheckCircle, Award } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { encodePixelPass } from '@/lib/pixelpass';

export default function IssueCertificate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);

  const [validityDays, setValidityDays] = useState('365');
  const [additionalNotes, setAdditionalNotes] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      const b = await storage.getBatchById(id);
      setBatch(b || null);
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const inspection = batch?.inspectionData;

  if (loading) {
    return <DashboardLayout><div className="p-8 text-center">Loading...</div></DashboardLayout>;
  }

  if (!batch || !inspection) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Inspection data not found</h2>
          <Link to="/qa/requests" className="text-primary hover:underline mt-2 inline-block">
            Back to Requests
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleIssueCertificate = async () => {
    try {
      // Use browser crypto or fallback
      const randomId = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 15);

      const certId = `CERT-${randomId.substring(0, 8).toUpperCase()}`;
      const issueDate = new Date();
      const validUntil = new Date(issueDate);
      validUntil.setDate(validUntil.getDate() + parseInt(validityDays));

      const newCert: Certificate = {
        id: certId,
        batchId: batch.id,
        issuedAt: issueDate.toISOString(),
        validUntil: validUntil.toISOString(),
        status: 'VALID',
        vcData: {
          // Mock VC payload for demo
          "@context": ["https://www.w3.org/2018/credentials/v1"],
          "type": ["VerifiableCredential", "AgriculturalProductCredential"],
          "issuer": "did:web:agriqcert.app",
          "issuanceDate": issueDate.toISOString(),
          "expirationDate": validUntil.toISOString(),
          "credentialSubject": {
            "id": `did:web:exporter.app:${batch.exporterName}`,
            "product": batch.productType,
            "grade": inspection.grade
          }
        },
        metadata: {
          productType: batch.productType, // For search/display
          notes: additionalNotes
        },
        issuer: 'National Agricultural Quality Agency',
        hash: randomId // Mock hash
      };

      await storage.saveCertificate(newCert);
      await storage.updateBatchStatus(batch.id, 'CERTIFIED');

      toast.success(`Digital Product Passport ${certId} issued successfully!`);
      navigate('/qa/certificates');

    } catch (e) {
      console.error(e);
      toast.error('Failed to issue certificate');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/qa/inspect/${id}`}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Issue Digital Certificate</h1>
            <p className="text-muted-foreground">Batch ID: {batch.id}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Certificate Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-4 border-b border-border">
                <Award className="h-12 w-12 text-primary mx-auto mb-2" />
                <h2 className="text-xl font-bold">Digital Product Passport</h2>
                <p className="text-sm text-muted-foreground">Agricultural Quality Certificate</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Product</p>
                    <p className="font-medium">{batch.productType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{batch.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Origin</p>
                    <p className="font-medium">{batch.farmLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Destination</p>
                    <p className="font-medium">{batch.destinationCountry}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold mb-3">Inspection Results</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Grade: {inspection.grade}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Moisture: {inspection.moisture}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Pesticides: {inspection.pesticideLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span className="text-sm">Heavy Metals: {inspection.heavyMetalTest}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-4">
                  <div className="w-32 h-32 bg-white p-2 rounded-lg flex items-center justify-center">
                    <QRCode
                      value={encodePixelPass({
                        id: 'PREVIEW',
                        prod: batch.productType,
                        grade: inspection.grade,
                        stat: 'V',
                        date: new Date().toISOString()
                      })}
                      size={100}
                      level="L" // Lower level is fine since we have robust encoding, but 'M' or 'Q' is safer. 'L' for density.
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Certificate Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="validity">Validity Period (days)</Label>
                  <Input
                    id="validity"
                    type="number"
                    value={validityDays}
                    onChange={(e) => setValidityDays(e.target.value)}
                    min="30"
                    max="730"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Certificate will be valid for {validityDays} days from issue date
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Any additional remarks for this certificate..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Issuer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Issuing Authority</p>
                  <p className="font-medium">National Agricultural Quality Agency</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Inspector</p>
                  <p className="font-medium">QA Inspector</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handleIssueCertificate}>
              <Award className="h-5 w-5 mr-2" />
              Issue Digital Product Passport
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
