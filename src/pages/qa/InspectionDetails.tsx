import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch, User } from '@/lib/storage';
import { ArrowLeft, FileText, Download, Package, MapPin, Globe, User as UserIcon } from 'lucide-react';

export default function InspectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [exporter, setExporter] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const batchData = await storage.getBatchById(id);
        setBatch(batchData || null);
        if (batchData && batchData.exporterId) {
          const users = await storage.getUsers();
          const user = users.find(u => u.id === batchData.exporterId);
          setExporter(user || null);
        }
      } catch (e) {
        console.error(e);
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
    );
  }

  if (!batch) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold">Batch not found</h2>
          <Link to="/qa/requests" className="text-primary hover:underline mt-2 inline-block">
            Back to Requests
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/qa/requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inspection Request</h1>
            <p className="text-muted-foreground">Batch ID: {batch.id}</p>
          </div>
          <StatusBadge status={batch.status} className="ml-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5" />
                Exporter Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground">Company Name</p>
                <p className="font-medium">{exporter?.name || batch.exporterName || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{exporter?.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submitted On</p>
                <p className="font-medium">{new Date(batch.submittedAt).toLocaleDateString()}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Product Type</p>
                  <p className="font-medium">{batch.productType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="font-medium">{batch.quantity}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Farm Location
                </p>
                <p className="font-medium">{batch.farmLocation}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Globe className="h-3 w-3" /> Destination Country
                </p>
                <p className="font-medium">{batch.destinationCountry}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Uploaded Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {batch.documents && batch.documents.length > 0 ? (
                  batch.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No documents uploaded</p>
                )}
              </div>
            </CardContent>
          </Card>

          {batch.notes && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Notes from Exporter</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{batch.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={() => navigate(`/qa/inspect/${batch.id}`)}>
            Accept & Start Inspection
          </Button>
          <Button variant="outline">
            Request More Information
          </Button>
          <Button variant="destructive">
            Reject Request
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
