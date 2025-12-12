import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch, User } from '@/lib/storage';
import { Search, Eye, Package } from 'lucide-react';

export default function AdminBatches() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allBatches = await storage.getBatches();
      setBatches(allBatches);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.productType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.exporterName.toLowerCase().includes(searchQuery.toLowerCase());

    // Normalize status for filtering (DB has uppercase, filter has lowercase/mixed)
    const normalizedBatchStatus = batch.status.toUpperCase();
    const normalizedFilter = statusFilter.toUpperCase();

    const matchesStatus = statusFilter === 'all' || normalizedBatchStatus === normalizedFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">All Batches</h1>
          <p className="text-muted-foreground">Overview of all product batches in the system</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search batches..."
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
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="INSPECTED">In Inspection</SelectItem>
                  <SelectItem value="CERTIFIED">Certified</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading batches...</div>
            ) : filteredBatches.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Batches Found</h3>
                <p className="text-muted-foreground">No batches match your search criteria.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Batch ID</TableHead>
                    <TableHead>Exporter</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBatches.map(batch => {
                    return (
                      <TableRow key={batch.id}>
                        <TableCell className="font-mono text-sm">{batch.id}</TableCell>
                        <TableCell>{batch.exporterName || 'N/A'}</TableCell>
                        <TableCell>{batch.productType}</TableCell>
                        <TableCell>{batch.quantity}</TableCell>
                        <TableCell>{batch.destinationCountry}</TableCell>
                        <TableCell>
                          <StatusBadge status={batch.status} />
                        </TableCell>
                        <TableCell>{new Date(batch.submittedAt).toLocaleDateString()}</TableCell>
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
