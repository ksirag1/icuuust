import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'user' | null;

export function useAuthLocal() {
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as UserRole;
    const storedEmail = localStorage.getItem('userEmail');
    
    setRole(storedRole);
    setEmail(storedEmail);
    setIsLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setRole(null);
    setEmail(null);
  };

  const isAdmin = role === 'admin';
  const isUser = role === 'user';
  const isAuthenticated = !!role;

  return {
    role,
    email,
    isLoading,
    isAdmin,
    isUser,
    isAuthenticated,
    logout,
  };
}
