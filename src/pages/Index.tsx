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
        <div className="container relative py-24 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Leaf className="h-4 w-4" />
              {t('digitalProductPassport')}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Trust Every Shipment with <span className="text-primary">AgriQCert</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Transform paper certificates into tamper-proof digital credentials. Exporters submit, QA agencies certify, and importers verify — all in one secure platform.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/auth"><Button size="lg" className="gap-2">{t('signIn')} <ArrowRight className="h-4 w-4" /></Button></Link>
              <Link to="/verify"><Button size="lg" variant="outline" className="gap-2"><QrCode className="h-4 w-4" /> {t('verifyCertificate')}</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
            <p className="mt-4 text-muted-foreground">Three simple steps to digital certification</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Package className="h-8 w-8" />, title: `1. ${t('exporter')}`, description: t('submitBatch') },
              { icon: <ClipboardCheck className="h-8 w-8" />, title: `2. ${t('qaAgency')}`, description: t('inspect') },
              { icon: <QrCode className="h-8 w-8" />, title: `3. ${t('importer')}`, description: t('verify') },
            ].map((step, i) => (
              <div key={i} className="p-8 rounded-2xl bg-card border border-border shadow-soft">
                <div className="inline-flex h-14 w-14 rounded-xl bg-primary/10 text-primary items-center justify-center mb-6">{step.icon}</div>
                <h3 className="text-xl font-semibold text-card-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary">
        <div className="container text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Go Digital?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">Join exporters, QA agencies, and importers already using AgriQCert.</p>
          <Link to="/auth"><Button size="lg" variant="secondary" className="gap-2">{t('signIn')} <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      <footer className="py-12 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center"><Leaf className="h-4 w-4 text-primary-foreground" /></div>
            <span className="font-semibold text-foreground">AgriQCert</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 AgriQCert. Digital certificates for a trustworthy supply chain.</p>
        </div>
      </footer>
    </div>
  );
}
