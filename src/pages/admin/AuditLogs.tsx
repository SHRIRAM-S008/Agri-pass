import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, FileText, LogIn, LogOut, Award, XCircle, CheckCircle } from 'lucide-react';
import { storage, AuditLog } from '@/lib/storage';

export default function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const data = await storage.getAuditLogs();
      setLogs(data);
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    // Handle missing userName or details gracefully
    const userName = log.userName || 'Unknown User';
    const detailsStr = JSON.stringify(log.details || {});

    const matchesSearch = userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      detailsStr.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAction = actionFilter === 'all' || log.action === actionFilter;
    return matchesSearch && matchesAction;
  });

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'certificate_issued':
      case 'Certificate Issued':
        return <Award className="h-4 w-4 text-primary" />;
      case 'certificate_verified':
      case 'Certificate Verified':
        return <CheckCircle className="h-4 w-4 text-primary" />;
      case 'certificate_revoked':
      case 'Certificate Revoked':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'user_login':
        return <LogIn className="h-4 w-4 text-blue-500" />;
      case 'user_logout':
        return <LogOut className="h-4 w-4 text-muted-foreground" />;
      default:
        // Generic check for batch updates
        if (action.includes('Batch Status Updated')) return <FileText className="h-4 w-4 text-orange-500" />;
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionLabel = (action: string) => {
    // If it's already readable (like "Certificate Issued"), return it.
    // Otherwise map it.
    if (action.includes(' ')) return action;

    const labels: Record<string, string> = {
      certificate_issued: 'Certificate Issued',
      certificate_verified: 'Certificate Verified',
      certificate_revoked: 'Certificate Revoked',
      user_login: 'User Login',
      user_logout: 'User Logout',
      batch_submitted: 'Batch Submitted',
      inspection_completed: 'Inspection Completed',
    };
    return labels[action] || action;
  };

  const formatDetails = (details: any) => {
    if (!details) return '-';
    if (typeof details === 'string') return details;
    // Format simple object like { batchId: "...", status: "..." }
    return Object.entries(details).map(([k, v]) => `${k}: ${v}`).join(', ');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Track all system activities and events</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Filter by action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="Certificate Issued">Certificate Issued</SelectItem>
                  <SelectItem value="Batch Status Updated">Batch Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading audit logs...</div>
            ) : filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No logs found.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map(log => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-medium">{getActionLabel(log.action)}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.userName || log.userId}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{formatDetails(log.details)}</TableCell>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
