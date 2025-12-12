import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle, XCircle, AlertTriangle, Eye, History as HistoryIcon } from 'lucide-react';
import { storage, AuditLog } from '@/lib/storage';

export default function VerificationHistory() {
  const [history, setHistory] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      const allLogs = await storage.getAuditLogs();
      // Filter for verification actions
      const verifications = allLogs.filter(log =>
        log.action === 'certificate_verified' ||
        log.action === 'certificate_revoked' || // Include relevant cert actions
        log.action === 'Certificate Verified'
      );
      setHistory(verifications);
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
      case 'VALID':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'revoked':
      case 'REVOKED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'valid':
      case 'VALID':
        return <span className="text-primary font-medium">Valid</span>;
      case 'revoked':
      case 'REVOKED':
        return <span className="text-destructive font-medium">Revoked</span>;
      default:
        return <span className="text-warning font-medium">Invalid</span>;
    }
  };

  const getProductFromDetails = (details: any) => {
    // Details might have product info or just be a string.
    // Since this is audit log based, we might not have full product info unless we fetch the cert/batch.
    // For now, we try to extract it if present, or show Generic info.
    if (details && typeof details === 'object' && details.productType) {
      return details.productType;
    }
    return '-';
  };

  const getCertIdFromDetails = (details: any) => {
    if (details && typeof details === 'object' && details.certificateId) {
      return details.certificateId;
    }
    // Try to parse string "Certificate CERT-XXX verified"
    if (typeof details === 'string') {
      const match = details.match(/Certificate ([\w-]+)/);
      if (match) return match[1];
    }
    return 'Unknown';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verification History</h1>
          <p className="text-muted-foreground">View your past certificate verifications</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading history...</div>
        ) : history.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <HistoryIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Verification History</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Your scanned certificates will appear here.
              </p>
              <Link to="/importer/scan" className="mt-4">
                <Button>Scan QR Code</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Recent Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Scanned At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => {
                    const certId = getCertIdFromDetails(item.details);
                    // Determine status from action/details. 
                    const status = item.action.includes('revoked') ? 'REVOKED' : 'VALID';

                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-sm">{certId}</TableCell>
                        <TableCell>{getProductFromDetails(item.details)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(status)}
                            {getStatusLabel(status)}
                          </div>
                        </TableCell>
                        <TableCell>{new Date(item.timestamp).toLocaleString()}</TableCell>
                        <TableCell>
                          <Link to={`/importer/result/${certId}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
