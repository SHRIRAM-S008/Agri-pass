import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch, ExporterStats } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Package, Clock, Award, XCircle, Plus, ArrowRight } from 'lucide-react';

export default function ExporterDashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<ExporterStats>({
    totalBatches: 0,
    pending: 0,
    inInspection: 0,
    certified: 0,
    rejected: 0
  });
  const [recentBatches, setRecentBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [dashboardStats, allBatches] = await Promise.all([
        storage.getExporterStats(),
        storage.getBatches()
      ]);
      setStats(dashboardStats);
      setRecentBatches(allBatches.slice(0, 3));
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('dashboard')}</h1>
            <p className="text-muted-foreground">{t('welcomeBack')}</p>
          </div>
          <Link to="/exporter/submit">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> {t('submitNewBatch')}
            </Button>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('totalBatches')}
            value={stats.totalBatches}
            icon={<Package className="h-5 w-5" />}
          />
          <StatCard
            title={t('pending')}
            value={stats.pending}
            icon={<Clock className="h-5 w-5" />}
            description={t('awaitingInspection')}
          />
          <StatCard
            title={t('certified')}
            value={stats.certified}
            icon={<Award className="h-5 w-5" />}
          />
          <StatCard
            title={t('rejected')}
            value={stats.rejected}
            icon={<XCircle className="h-5 w-5" />}
          />
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-card-foreground">{t('recentBatches')}</h2>
            <Link to="/exporter/batches" className="text-sm text-primary hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('batchId')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('product')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('quantity')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('status')}</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">{t('date')}</th>
                </tr>
              </thead>
              <tbody>
                {recentBatches.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-muted-foreground">{t('noData')}</td>
                  </tr>
                ) : (
                  recentBatches.map((batch) => (
                    <tr key={batch.id} className="border-b border-border last:border-0">
                      <td className="py-4 px-4">
                        <Link to={`/exporter/batches/${batch.id}`} className="font-medium text-primary hover:underline">
                          {batch.id}
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-card-foreground">{batch.productType}</td>
                      <td className="py-4 px-4 text-muted-foreground">{batch.quantity}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={batch.status} />
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">{new Date(batch.submittedAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
