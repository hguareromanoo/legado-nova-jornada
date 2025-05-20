
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
  
  // Configure Supabase auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoggedIn(!!currentSession);
        
        // Check onboarding status
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
      
      // Check onboarding status
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
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return { error: error.message };
      }
      
      console.log('Login successful, user:', data.user?.id);
      
      // Check onboarding status
      const completed = localStorage.getItem('holdingSetupCompleted') === 'true';
      setHasCompletedOnboarding(completed);
      
      // Set default onboarding step if not set
      if (!localStorage.getItem('onboardingStep')) {
        localStorage.setItem('onboardingStep', 'selection');
      }
      
      return {};
    } catch (error) {
      console.error('Error during login:', error);
      return { error: 'Erro ao fazer login' };
    }
  };
  
  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      console.log('Attempting signup for:', email);
      
      // Simplified signup with minimal metadata
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || ''
            // No additional fields that might conflict with database expectations
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error.message);
        return { error: error.message };
      }
      
      console.log('Signup successful, user:', data.user?.id);
      console.log('User data:', data.user);
      
      // Set default onboarding step
      localStorage.setItem('onboardingStep', 'selection');
      
      return {};
    } catch (error) {
      console.error('Error during signup:', error);
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
      // Here we could update user metadata in Supabase
      console.log('Updating user data:', data);
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
