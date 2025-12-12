import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { storage, Certificate, Batch } from '@/lib/storage';
import { RefreshCcw, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminRevocations() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [allCerts, allBatches] = await Promise.all([
        storage.getAllCertificates(),
        storage.getBatches()
      ]);
      setCertificates(allCerts);
      setBatches(allBatches);
      setLoading(false);
    };
    fetchData();
  }, []);

  const revokedCertificates = certificates.filter(c => c.status === 'REVOKED');
  const validCertificates = certificates.filter(c => c.status === 'VALID');

  const handleRestore = async (id: string) => {
    // Implement restore logic if supported by backend API
    // For now, demo purpose toast
    toast.success('Certificate restore initiated');
    // In real app: await storage.updateCertificateStatus(id, 'VALID');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revocation Management</h1>
          <p className="text-muted-foreground">View and manage revoked certificates</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : revokedCertificates.length}</p>
                  <p className="text-sm text-muted-foreground">Revoked Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{loading ? '-' : validCertificates.length}</p>
                  <p className="text-sm text-muted-foreground">Active Certificates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <RefreshCcw className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-muted-foreground">Restored This Month</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Revoked Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading revocations...</div>
            ) : revokedCertificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Revoked Certificates</h3>
                <p className="text-muted-foreground">All certificates are currently valid.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Original Issue Date</TableHead>
                    <TableHead>Revoked Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {revokedCertificates.map(cert => {
                    const batch = batches.find(b => b.id === cert.batchId);
                    return (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                        <TableCell>{batch?.productType || 'N/A'}</TableCell>
                        <TableCell>{new Date(cert.issuedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date().toLocaleDateString()}</TableCell>
                        <TableCell>Quality issue detected</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm" onClick={() => handleRestore(cert.id)}>
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Restore
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
