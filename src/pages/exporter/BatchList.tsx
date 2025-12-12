import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { storage, Batch } from '@/lib/storage';
import { useLanguage } from '@/contexts/LanguageContext';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';

export default function BatchList() {
  const { t } = useLanguage();
  const [batches, setBatches] = useState<Batch[]>([]);

  useEffect(() => {
    const loadBatches = async () => {
      const data = await storage.getBatches();
      setBatches(data);
    };

    loadBatches();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('myBatches')}</h1>
            <p className="text-muted-foreground">{t('welcomeBack')}</p>
          </div>
          <Link to="/exporter/submit">
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> {t('submitNewBatch')}
            </Button>
          </Link>
        </div>

        {/* Mobile View */}
        <div className="md:hidden space-y-4">
          {batches.map((batch) => (
            <div key={batch.id} className="rounded-xl border border-border bg-card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-card-foreground">{batch.productType}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-1">{batch.id}</p>
                </div>
                <StatusBadge status={batch.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground block text-xs">{t('quantity')}</span>
                  <span>{batch.quantity}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">{t('destination')}</span>
                  <span>{batch.destinationCountry}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{new Date(batch.submittedAt).toLocaleDateString()}</span>
                <div className="flex items-center gap-1">
                  <Link to={`/exporter/batches/${batch.id}`}>
                    <Button variant="outline" size="sm" className="h-8">
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('batchId')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('product')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('quantity')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('destination')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('status')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('date')}</th>
                  <th className="text-left py-4 px-4 text-sm font-medium text-muted-foreground">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-4">
                      <span className="font-medium text-card-foreground">{batch.id}</span>
                    </td>
                    <td className="py-4 px-4 text-card-foreground">{batch.productType}</td>
                    <td className="py-4 px-4 text-muted-foreground">{batch.quantity}</td>
                    <td className="py-4 px-4 text-muted-foreground">{batch.destinationCountry}</td>
                    <td className="py-4 px-4">
                      <StatusBadge status={batch.status} />
                    </td>
                    <td className="py-4 px-4 text-muted-foreground">{batch.submittedAt}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Link to={`/exporter/batches/${batch.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        {batch.status === 'SUBMITTED' && (
                          <>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
