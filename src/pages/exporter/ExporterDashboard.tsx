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
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-foreground">{t('dashboard')}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{t('welcomeBack')}</p>
          </div>
          <Link to="/exporter/submit">
            <Button className="gap-2 w-full sm:w-auto">
              <Plus className="h-4 w-4" /> {t('submitNewBatch')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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

        <div className="rounded-xl border border-border bg-card p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-card-foreground">{t('recentBatches')}</h2>
            <Link to="/exporter/batches" className="text-xs sm:text-sm text-primary hover:underline flex items-center gap-1">
              {t('viewAll')} <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Link>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-3">
            {recentBatches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
            ) : (
              recentBatches.map((batch) => (
                <Link key={batch.id} to={`/exporter/batches/${batch.id}`} className="block">
                  <div className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-primary truncate">{batch.id}</p>
                        <p className="text-sm text-card-foreground">{batch.productType}</p>
                      </div>
                      <StatusBadge status={batch.status} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{batch.quantity}</span>
                      <span>{new Date(batch.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
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
