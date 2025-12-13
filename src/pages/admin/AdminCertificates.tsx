import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Certificate, Batch } from '@/lib/storage';
import { Search, Eye, XCircle, Award } from 'lucide-react';

export default function AdminCertificates() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  const filteredCertificates = certificates.filter(cert => {
    const batch = batches.find(b => b.id === cert.batchId);
    const matchesSearch = cert.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch?.productType.toLowerCase().includes(searchQuery.toLowerCase());

    const normalizedCertStatus = cert.status.toUpperCase();
    const normalizedFilter = statusFilter.toUpperCase();

    const matchesStatus = statusFilter === 'all' || normalizedCertStatus === normalizedFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Certificates</h1>
          <p className="text-muted-foreground">Manage all digital product passports</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search certificates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="VALID">Valid</SelectItem>
                  <SelectItem value="REVOKED">Revoked</SelectItem>
                  <SelectItem value="EXPIRED">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading certificates...</div>
            ) : filteredCertificates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Certificates Found</h3>
                <p className="text-muted-foreground">No certificates match your search criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Certificate ID</TableHead>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Issued Date</TableHead>
                    <TableHead>Valid Until</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertificates.map(cert => {
                    const batch = batches.find(b => b.id === cert.batchId);
                    return (
                      <TableRow key={cert.id}>
                        <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                        <TableCell className="font-mono text-sm">{cert.batchId}</TableCell>
                        <TableCell>{batch?.productType || 'N/A'}</TableCell>
                        <TableCell>{new Date(cert.issuedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(cert.validUntil).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <StatusBadge status={cert.status === 'VALID' ? 'certified' : 'rejected'} />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link to={`/admin/certificate/${cert.id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button variant="ghost" size="sm">
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
