import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { storage, Batch, InspectionData } from '@/lib/storage';
import { inji } from '@/lib/inji';
import { useToast } from '@/hooks/use-toast';
import { FileText, FlaskConical, Award } from 'lucide-react';

export default function InspectionForm() {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [batch, setBatch] = useState<Batch | undefined>(undefined);

  // Form State
  const [moisture, setMoisture] = useState('');
  const [foreignMatter, setForeignMatter] = useState('');
  const [pesticideLevel, setPesticideLevel] = useState<InspectionData['pesticideLevel']>('Safe');
  const [heavyMetal, setHeavyMetal] = useState<InspectionData['heavyMetalTest']>('Pass');
  const [isoCode, setIsoCode] = useState('');
  const [grade, setGrade] = useState('');
  const [notes, setNotes] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [sampleId, setSampleId] = useState('');
  const [inspectionLocation, setInspectionLocation] = useState('');

  useEffect(() => {
    const fetchBatch = async () => {
      if (batchId) {
        const b = await storage.getBatchById(batchId);
        setBatch(b);
      }
    };
    fetchBatch();
  }, [batchId]);

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading Batch...</p>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const inspectionData: InspectionData = {
        grade: grade,
        moisture: parseFloat(moisture),
        foreignMatter: foreignMatter ? parseFloat(foreignMatter) : undefined,
        pesticideLevel: pesticideLevel,
        heavyMetalTest: heavyMetal,
        inspectorId: 'QA-AGENT-001',
        inspectorName: inspectorName,
        sampleId: sampleId,
        inspectionLocation: inspectionLocation,
        inspectedAt: new Date().toISOString(),
        notes: notes,
        isoCode: isoCode
      };

      // 1. Update Batch Status
      await storage.updateBatchStatus(batch.id, 'INSPECTED', inspectionData);

      // 2. Request VC from Inji
      toast({ title: 'Connecting to Inji Certify...', description: 'Requesting Verifiable Credential...' });

      const certId = crypto.randomUUID();
      const vcPayload = {
        id: certId,
        ...batch,
        ...inspectionData
      };

      const certifyResponse = await inji.issueCredential(vcPayload);

      // 3. Save VC & QR
      // Upload to Bucket first
      toast({ title: 'Uploading...', description: 'Saving certificate to storage...' });
      const publicUrl = await storage.uploadCertificate(certId, certifyResponse.vc);

      await storage.saveCertificate({
        id: certId,
        batchId: batch.id,
        vcData: certifyResponse.vc,
        qrBase64: certifyResponse.qr,
        issuedAt: new Date().toISOString(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year validity
        status: 'VALID',
        metadata: {
          ...batch.inspectionData, // Keep existing inspection data if any
          storageUrl: publicUrl
        }
      });

      // 4. Update Batch Status to CERTIFIED
      await storage.updateBatchStatus(batch.id, 'CERTIFIED');

      toast({
        title: 'Certificate Issued!',
        description: `VC ID: ${certifyResponse.vc.id} has been cryptographically signed.`,
      });

      navigate('/qa/certificates');

    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to issue certificate',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Inspection Form</h1>
          <p className="text-muted-foreground">Batch: {batchId} · {batch.productType}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 mb-6">
          <h2 className="font-semibold text-card-foreground flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary" />
            Batch Information
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Exporter:</span>
              <span className="ml-2 text-card-foreground">{batch.exporterName}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Quantity:</span>
              <span className="ml-2 text-card-foreground">{batch.quantity}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Origin:</span>
              <span className="ml-2 text-card-foreground">{batch.farmLocation}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Destination:</span>
              <span className="ml-2 text-card-foreground">{batch.destinationCountry}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Inspection Details
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inspectorName">Inspector Name</Label>
                <Input
                  id="inspectorName"
                  placeholder="e.g. John Doe"
                  required
                  value={inspectorName}
                  onChange={(e) => setInspectorName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleId">Sample ID</Label>
                <Input
                  id="sampleId"
                  placeholder="e.g. SMP-2023-001"
                  required
                  value={sampleId}
                  onChange={(e) => setSampleId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Inspection Location</Label>
                <Input
                  id="location"
                  placeholder="e.g. Warehouse A, Zone 3"
                  required
                  value={inspectionLocation}
                  onChange={(e) => setInspectionLocation(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-primary" />
              Test Results
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="moisture">Moisture Content (%)</Label>
                <Input
                  id="moisture"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 12.5"
                  required
                  value={moisture}
                  onChange={(e) => setMoisture(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="foreignMatter">Foreign Matter (%)</Label>
                <Input
                  id="foreignMatter"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 0.5"
                  value={foreignMatter}
                  onChange={(e) => setForeignMatter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="pesticide">Pesticide Level</Label>
                <Select required value={pesticideLevel} onValueChange={(v: any) => setPesticideLevel(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safe">Within Safe Limits</SelectItem>
                    <SelectItem value="Warning">Warning Limit</SelectItem>
                    <SelectItem value="High">Exceeded Safe Limits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="heavyMetal">Heavy Metal Test</Label>
                <Select required value={heavyMetal} onValueChange={(v: any) => setHeavyMetal(v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select result" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pass">Pass</SelectItem>
                    <SelectItem value="Fail">Fail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isoCode">ISO/Standard Code</Label>
                <Input
                  id="isoCode"
                  placeholder="e.g., ISO 6322-1:1996"
                  required
                  value={isoCode}
                  onChange={(e) => setIsoCode(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <h2 className="font-semibold text-card-foreground flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Certification
            </h2>

            <div className="space-y-2">
              <Label htmlFor="grade">Quality Grade</Label>
              <Select required value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+ (Premium)</SelectItem>
                  <SelectItem value="A">A (Excellent)</SelectItem>
                  <SelectItem value="B">B (Good)</SelectItem>
                  <SelectItem value="C">C (Acceptable)</SelectItem>
                  <SelectItem value="Rejected">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comments">Inspector Comments</Label>
              <Textarea
                id="comments"
                placeholder="Add detailed observations and recommendations..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="button" variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="button" variant="secondary">
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit & Issue Certificate'}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
