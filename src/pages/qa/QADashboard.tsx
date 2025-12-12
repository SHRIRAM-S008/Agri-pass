import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch, QAStats } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardCheck, Clock, CheckCircle, Award, ArrowRight } from 'lucide-react';

export default function QADashboard() {
  const { t } = useLanguage();
  const [stats, setStats] = useState<QAStats>({
    newRequests: 0,
    ongoing: 0,
    completed: 0,
    certificatesIssued: 0
  });
  const [pendingBatches, setPendingBatches] = useState<Batch[]>([]);
  const [recentInspections, setRecentInspections] = useState<Batch[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [dashboardStats, allBatches] = await Promise.all([
        storage.getQAStats(),
        storage.getBatches()
      ]);
      setStats(dashboardStats);

      // Filter pending: Submitted batches
      // Assuming 'INSPECTED' means inspection is done but not yet Certified/Rejected? 
      // Or 'INSPECTED' is "In Progress"?
      // Usually: Submitted -> (Start Inspection) -> Inspected -> (Approve) -> Certified.
      // So Pending = Submitted.
      // Recent Inspections = Inspected, Certified, Rejected.

      setPendingBatches(allBatches.filter(b => b.status === 'SUBMITTED').slice(0, 5));

      // Filter recent inspections
      setRecentInspections(allBatches.filter(b =>
        b.status === 'INSPECTED' || b.status === 'CERTIFIED' || b.status === 'REJECTED'
      ).slice(0, 5));
    };
    loadData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('qaDashboard')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('newRequests')}
            value={stats.newRequests}
            icon={<ClipboardCheck className="h-5 w-5" />}
            description={t('awaitingReview')}
          />
          <StatCard
            title={t('inProgress')}
            value={stats.ongoing}
            icon={<Clock className="h-5 w-5" />}
          />
          <StatCard
            title={t('completed')}
            value={stats.completed}
            icon={<CheckCircle className="h-5 w-5" />}
          />
          <StatCard
            title={t('certificatesIssued')}
            value={stats.certificatesIssued}
            icon={<Award className="h-5 w-5" />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">{t('pendingInspections')}</h2>
              <Link to="/qa/requests" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {pendingBatches.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
              ) : (
                pendingBatches.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-card-foreground">{batch.productType}</p>
                      <p className="text-sm text-muted-foreground">{batch.exporterName} · {batch.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={batch.status} />
                      <Link to={`/qa/inspect/${batch.id}`}>
                        <Button size="sm">{t('inspect')}</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-card-foreground">{t('recentInspections')}</h2>
              <Link to="/qa/certificates" className="text-sm text-primary hover:underline flex items-center gap-1">
                {t('viewAll')} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentInspections.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">{t('noData')}</p>
              ) : (
                recentInspections.map((batch) => (
                  <div key={batch.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium text-card-foreground">{batch.id}</p>
                      <p className="text-sm text-muted-foreground">{t('batch')}: {batch.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={batch.status} />
                      {batch.inspectionData?.grade && (
                        <span className="text-sm font-semibold text-success">{batch.inspectionData.grade}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
