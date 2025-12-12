import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/layout/Header';
import { Leaf, Mail, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });
      
      // Navigate based on the logged-in user's role
      const userEmail = email.toLowerCase();
      if (userEmail.includes('exporter')) navigate('/exporter');
      else if (userEmail.includes('qa')) navigate('/qa');
      else if (userEmail.includes('importer')) navigate('/importer');
      else if (userEmail.includes('admin')) navigate('/admin');
      else navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    
    setIsLoading(false);
  };

  const demoCredentials = [
    { role: 'Exporter', email: 'exporter@demo.com' },
    { role: 'QA Agency', email: 'qa@demo.com' },
    { role: 'Importer', email: 'importer@demo.com' },
    { role: 'Admin', email: 'admin@demo.com' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container flex items-center justify-center py-16">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-soft">
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold text-card-foreground">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {isLogin ? 'Sign in to your AgriQCert account' : 'Get started with AgriQCert'}
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing in...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                Demo credentials (any password):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoCredentials.map((cred) => (
                  <button
                    key={cred.email}
                    type="button"
                    onClick={() => setEmail(cred.email)}
                    className="text-xs px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground transition-colors"
                  >
                    {cred.role}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
