import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { useLanguage } from '@/contexts/LanguageContext';
import { Leaf, Shield, QrCode, FileCheck, Globe, ArrowRight, CheckCircle, Package, ClipboardCheck } from 'lucide-react';

export default function Index() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-5" />
        <div className="container relative py-12 sm:py-16 md:py-24 lg:py-32 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-primary mb-4 sm:mb-6">
              <Leaf className="h-3 w-3 sm:h-4 sm:w-4" />
              {t('digitalProductPassport')}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
              Trust Every Shipment with <span className="text-primary">AgriQPort</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground px-4">
              Transform paper certificates into tamper-proof digital credentials. Exporters submit, QA agencies certify, and importers verify — all in one secure platform.
            </p>
            <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  {t('signIn')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/verify" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                  <QrCode className="h-4 w-4" /> {t('verifyCertificate')}
                </Button>
              </Link>
              <a href="https://agriqport-app.netlify.app/" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                  <Globe className="h-4 w-4" /> Open Web App
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">Three simple steps to digital certification</p>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: <Package className="h-6 w-6 sm:h-8 sm:w-8" />, title: `1. ${t('exporter')}`, description: t('submitBatch') },
              { icon: <ClipboardCheck className="h-6 w-6 sm:h-8 sm:w-8" />, title: `2. ${t('qaAgency')}`, description: t('inspect') },
              { icon: <QrCode className="h-6 w-6 sm:h-8 sm:w-8" />, title: `3. ${t('importer')}`, description: t('verify') },
            ].map((step, i) => (
              <div key={i} className="p-6 sm:p-8 rounded-2xl bg-card border border-border shadow-soft">
                <div className="inline-flex h-12 w-12 sm:h-14 sm:w-14 rounded-xl bg-primary/10 text-primary items-center justify-center mb-4 sm:mb-6">{step.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-card-foreground mb-2 sm:mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 md:py-20 bg-primary">
        <div className="container text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground mb-3 sm:mb-4">Ready to Go Digital?</h2>
          <p className="text-sm sm:text-base text-primary-foreground/80 mb-6 sm:mb-8 max-w-xl mx-auto">Join exporters, QA agencies, and importers already using AgriQPort.</p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="gap-2">
              {t('signIn')} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="py-8 sm:py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><Leaf className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-semibold text-foreground">AgriQPort</span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground text-center">© 2024 AgriQPort. Digital certificates for a trustworthy supply chain.</p>
        </div>
      </footer>
    </div>
  );
}
