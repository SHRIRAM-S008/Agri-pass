import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { storage, User } from '@/lib/storage';

export type UserRole = 'exporter' | 'qa_agency' | 'admin' | 'importer';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const demoUsers: User[] = [
    {
      id: '1',
      email: 'exporter@demo.com',
      name: 'Exporter Demo',
      role: 'exporter',
      company: 'Demo Exporters Ltd.'
    },
    {
      id: '2',
      email: 'qa@demo.com',
      name: 'QA Agency Demo',
      role: 'qa_agency',
      company: 'Demo QA Agency'
    },
    {
      id: '3',
      email: 'importer@demo.com',
      name: 'Importer Demo',
      role: 'importer',
      company: 'Demo Importers Inc.'
    },
    {
      id: '4',
      email: 'admin@demo.com',
      name: 'Admin Demo',
      role: 'admin',
      company: 'AgriQCert'
    }
  ];

  // For demo persistence (optional, can be better)
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    setLoading(true);
    try {
      let users: User[] = [];

      try {
        users = await storage.getUsers();
      } catch (e) {
        console.error('Error fetching users from storage, falling back to demo users:', e);
        users = [];
      }

      if (!users || users.length === 0) {
        users = demoUsers;
      }

      const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('auth_user', JSON.stringify(foundUser));
        return { success: true };
      }

      return { success: false, error: 'Invalid credentials. Try: exporter@demo.com, qa@demo.com, importer@demo.com, or admin@demo.com' };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'Login failed due to system error.' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    // Redirect to sign-in page
    window.location.href = '/auth';
  }, []);

  const switchRole = useCallback(async (role: UserRole) => {
    setLoading(true);
    try {
      const users = await storage.getUsers();
      const userForRole = users.find(u => u.role === role);
      if (userForRole) {
        setUser(userForRole);
        localStorage.setItem('auth_user', JSON.stringify(userForRole));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
