
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  hasCompletedOnboarding: boolean;
  login: (email: string, password: string) => Promise<{error?: string}>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<{error?: string}>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  updateUser: (data: Partial<UserData>) => void;
}

interface UserData {
  id: string;
  name?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Configurar listener de autenticação Supabase e verificar sessão existente
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoggedIn(!!currentSession);
        
        // Verificar status de onboarding
        if (currentSession) {
          const completed = localStorage.getItem('holdingSetupCompleted') === 'true';
          setHasCompletedOnboarding(completed);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoggedIn(!!currentSession);
      
      // Verificar status de onboarding
      if (currentSession) {
        const completed = localStorage.getItem('holdingSetupCompleted') === 'true';
        setHasCompletedOnboarding(completed);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Erro de login:', error.message);
        return { error: error.message };
      }
      
      // Supabase Auth já define session e user através do listener
      
      // Verificar status de onboarding
      const completed = localStorage.getItem('holdingSetupCompleted') === 'true';
      setHasCompletedOnboarding(completed);
      
      // Set default onboarding step if not set
      if (!localStorage.getItem('onboardingStep')) {
        localStorage.setItem('onboardingStep', 'selection');
      }
      
      return {};
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { error: 'Erro ao fazer login' };
    }
  };
  
  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            full_name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
          }
        }
      });
      
      if (error) {
        console.error('Erro de cadastro:', error.message);
        return { error: error.message };
      }
      
      // O listener onAuthStateChange já vai configurar o usuário
      
      // Set default onboarding step
      localStorage.setItem('onboardingStep', 'selection');
      
      return {};
    } catch (error) {
      console.error('Erro ao fazer cadastro:', error);
      return { error: 'Erro ao fazer cadastro' };
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingStep');
    localStorage.setItem('isLoggedIn', 'false');
  };
  
  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('holdingSetupCompleted', 'true');
  };
  
  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      // Aqui poderíamos atualizar os metadados do usuário no Supabase
      console.log('Atualizando dados do usuário:', data);
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        session,
        hasCompletedOnboarding,
        login,
        signUp,
        logout,
        completeOnboarding,
        updateUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
