import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from './Header';
import {
  LayoutDashboard,
  Package,
  FileText,
  ClipboardCheck,
  Award,
  Users,
  Settings,
  QrCode,
  History,
  Shield,
  FileSearch,
  MoreHorizontal
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface NavItem {
  label: string;
  path: string;
  icon: ReactNode;
}

const navItems: Record<string, NavItem[]> = {
  exporter: [
    { label: 'Dashboard', path: '/exporter', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Submit Batch', path: '/exporter/submit', icon: <Package className="h-5 w-5" /> },
    { label: 'My Batches', path: '/exporter/batches', icon: <FileText className="h-5 w-5" /> },
    { label: 'Certificates', path: '/exporter/certificates', icon: <Award className="h-5 w-5" /> },
  ],
  qa_agency: [
    { label: 'Dashboard', path: '/qa', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Inspection Requests', path: '/qa/requests', icon: <ClipboardCheck className="h-5 w-5" /> },
    { label: 'Issued Certificates', path: '/qa/certificates', icon: <Award className="h-5 w-5" /> },
  ],
  importer: [
    { label: 'Verify', path: '/importer', icon: <QrCode className="h-5 w-5" /> },
    { label: 'Scan QR', path: '/importer/scan', icon: <FileSearch className="h-5 w-5" /> },
    { label: 'History', path: '/importer/history', icon: <History className="h-5 w-5" /> },
  ],
  admin: [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { label: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    { label: 'All Batches', path: '/admin/batches', icon: <Package className="h-5 w-5" /> },
    { label: 'Certificates', path: '/admin/certificates', icon: <Award className="h-5 w-5" /> },
    { label: 'Revocations', path: '/admin/revocations', icon: <Shield className="h-5 w-5" /> },
    { label: 'Audit Logs', path: '/admin/audit', icon: <FileSearch className="h-5 w-5" /> },
    { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ],
};

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const items = user ? navItems[user.role] || [] : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 space-y-1">
            {items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  location.pathname === item.path
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pb-safe">
        <div className="flex items-center justify-around px-2 py-2">
          {items.slice(0, items.length > 4 ? 3 : 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center gap-1 px-1 py-3 rounded-lg text-[10px] font-medium transition-colors min-w-[60px] flex-1',
                location.pathname === item.path
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {item.icon}
              <span className="text-center leading-3 w-full break-words">{item.label}</span>
            </Link>
          ))}

          {items.length > 4 && (
            <Sheet>
              <SheetTrigger asChild>
                <button
                  className={cn(
                    'flex flex-col items-center gap-1 px-1 py-3 rounded-lg text-[10px] font-medium transition-colors min-w-[60px] flex-1',
                    items.slice(3).some(item => location.pathname === item.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <MoreHorizontal className="h-5 w-5" />
                  <span>More</span>
                </button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader className="text-left mb-4">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-3 gap-4">
                  {items.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        'flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-colors',
                        location.pathname === item.path
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border bg-card text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full",
                        location.pathname === item.path ? "bg-primary/10" : "bg-muted"
                      )}>
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium text-center">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </nav>
    </div>
  );
}
