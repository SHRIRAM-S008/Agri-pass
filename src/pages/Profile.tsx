import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Mail, Shield } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{user?.name}</h2>
              <p className="text-muted-foreground capitalize">{user?.role.replace('_', ' ')}</p>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" defaultValue={user?.name} className="pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" defaultValue={user?.email} className="pl-10" disabled />
              </div>
            </div>

            {user?.company && (
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="company" defaultValue={user.company} className="pl-10" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Role</Label>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-card-foreground capitalize">
                  {user?.role.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button>Save Changes</Button>
            <Button variant="outline">Change Password</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
