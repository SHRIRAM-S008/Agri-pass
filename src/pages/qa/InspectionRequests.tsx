import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, ClipboardCheck } from 'lucide-react';

export default function InspectionRequests() {
  const { t } = useLanguage();
  const [pendingBatches, setPendingBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const loadBatches = async () => {
      const allBatches = await storage.getBatches();
      setPendingBatches(allBatches.filter(b => b.status === 'SUBMITTED'));
    };
    loadBatches();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t('inspectionRequests')}</h1>
          <p className="text-muted-foreground">{t('welcomeBack')}</p>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('batchId')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('exporter')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('product')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('quantity')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('origin')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('status')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {pendingBatches.map((batch) => (
                  <tr key={batch.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4 font-medium text-card-foreground">{batch.id}</td>
                    <td className="py-4 px-4 text-card-foreground">{batch.exporterName}</td>
                    <td className="py-4 px-4 text-card-foreground">{batch.productType}</td>
                    <td className="py-4 px-4 text-muted-foreground">{batch.quantity}</td>
                    <td className="py-4 px-4 text-muted-foreground">{batch.farmLocation}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Link to={`/qa/inspect/${batch.id}`}>
                          <Button size="sm" className="gap-1">
                            <ClipboardCheck className="h-4 w-4" />
                            {t('inspect')}
                          </Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
