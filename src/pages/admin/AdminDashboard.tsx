import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { storage, AdminStats, Batch, Certificate } from '@/lib/storage';
import { StatusBadge } from '@/components/ui/status-badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { Users, Building, Award, Shield, ArrowRight } from 'lucide-react';

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<AdminStats>({
    totalExporters: 0,
    totalQAAgencies: 0,
    totalCertificates: 0,
    totalRevocations: 0
  });
  const [batches, setBatches] = useState<Batch[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [adminStats, allBatches, allCerts] = await Promise.all([
        storage.getAdminStats(),
        storage.getBatches(),
        storage.getAllCertificates()
      ]);
      setStats(adminStats);
      setBatches(allBatches);
      setRecentCertificates(allCerts.slice(0, 4));
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('adminDashboard')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('totalExporters')}
            value={stats.totalExporters}
            icon={<Users className="h-5 w-5" />}
            trend={{ value: 12, positive: true }}
          />
          <StatCard
            title={t('qaAgencies')}
            value={stats.totalQAAgencies}
            icon={<Building className="h-5 w-5" />}
          />
          <StatCard
            title={t('certificatesIssued')}
            value={stats.totalCertificates}
            icon={<Award className="h-5 w-5" />}
            trend={{ value: 8, positive: true }}
          />
          <StatCard
            title={t('revocations')}
            value={stats.totalRevocations}
            icon={<Shield className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">{t('recentBatches')}</h2>
              <Link to="/admin/batches" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {batches.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
              ) : (
                batches.slice(0, 4).map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-card-foreground">{batch.id}</p>
                      <p className="text-sm text-muted-foreground">{batch.exporterName}</p>
                    </div>
                    <StatusBadge status={batch.status} />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">{t('recentCertificates')}</h2>
              <Link to="/admin/certificates" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-3">
              {recentCertificates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
              ) : (
                recentCertificates.map((cert) => {
                  const batch = batches.find(b => b.id === cert.batchId);
                  return (
                    <div key={cert.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium text-card-foreground">{cert.id}</p>
                        <p className="text-sm text-muted-foreground">{batch?.productType || 'Unknown'} · {batch?.exporterName || 'Unknown'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {batch?.inspectionData?.grade && (
                          <span className="text-sm font-semibold text-success">{batch.inspectionData.grade}</span>
                        )}
                        <StatusBadge status={cert.status === 'VALID' ? 'certified' : 'rejected'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">{t('quickActions')}</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/admin/users">
              <Button variant="outline">{t('manageUsers')}</Button>
            </Link>
            <Link to="/admin/revocations">
              <Button variant="outline">{t('viewRevocations')}</Button>
            </Link>
            <Link to="/admin/settings">
              <Button variant="outline">{t('systemSettings')}</Button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
