import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Certificate, Batch } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Download, QrCode, Award } from 'lucide-react';

export default function Certificates() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [allCerts, allBatches] = await Promise.all([
          storage.getAllCertificates(),
          storage.getBatches()
        ]);

        // Filter batches for this exporter ?? 
        // In a real app we might rely on RLS, but here we can double check
        // assuming 'user' context has role=exporter
        const userBatches = allBatches.filter(b => b.exporterId === user?.id || b.exporterName === user?.name); // Fallback to name match for simplicity if id inconsistent

        const userCerts = allCerts.filter(c =>
          userBatches.some(b => b.id === c.batchId)
        );

        setBatches(userBatches);
        setCertificates(userCerts);

      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('certificates')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : certificates.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Award className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('noData')}</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                {t('awaitingInspection')}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>{t('issuedCertificates')}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {certificates.map(cert => {
                  const batch = batches.find(b => b.id === cert.batchId);
                  return (
                    <div key={cert.id} className="rounded-lg border border-border p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0">
                          <h4 className="font-semibold truncate">{batch?.productType || 'Unknown'}</h4>
                          <p className="text-xs text-muted-foreground font-mono truncate">{cert.id}</p>
                        </div>
                        <StatusBadge status={cert.status === 'VALID' ? 'certified' : 'rejected'} />
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>
                          <span className="block mb-0.5">{t('issuedDate')}</span>
                          <span className="text-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="block mb-0.5">{t('validUntil')}</span>
                          <span className="text-foreground">{new Date(cert.validUntil).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-border">
                        <Link to={`/exporter/certificate/${cert.id}`} className="flex-1">
                          <Button variant="outline" size="sm" className="w-full h-8">
                            <Eye className="h-3.5 w-3.5 mr-2" /> View
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Desktop View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('certificateId')}</TableHead>
                      <TableHead>{t('product')}</TableHead>
                      <TableHead>{t('issuedDate')}</TableHead>
                      <TableHead>{t('validUntil')}</TableHead>
                      <TableHead>{t('status')}</TableHead>
                      <TableHead>{t('actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {certificates.map(cert => {
                      const batch = batches.find(b => b.id === cert.batchId);
                      return (
                        <TableRow key={cert.id}>
                          <TableCell className="font-mono text-sm">{cert.id}</TableCell>
                          <TableCell>{batch?.productType || 'N/A'}</TableCell>
                          <TableCell>{new Date(cert.issuedAt).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(cert.validUntil).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <StatusBadge status={cert.status === 'VALID' ? 'certified' : 'rejected'} />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Link to={`/exporter/certificate/${cert.id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </Link>
                              <Button variant="ghost" size="sm">
                                <QrCode className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
