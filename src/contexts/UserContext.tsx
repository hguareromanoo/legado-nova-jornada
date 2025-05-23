import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Definindo os tipos de estado do usuário
export type UserState = 'first_access' | 'onboarding_ai' | 'onboarding_human' | 'holding_setup' | 'holding_opened';

interface UserContextType {
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  hasCompletedOnboarding: boolean;
  userRole: string | null;
  userState: UserState | null;
  login: (email: string, password: string) => Promise<{error?: string}>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<{error?: string; needsEmailConfirmation?: boolean}>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  updateUser: (data: Partial<UserData>) => void;
  updateUserState: (state: UserState) => Promise<void>;
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

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  // Fetch user role and state from database
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching user profile for user ID:', userId);
      setIsRoleLoading(true);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, first_name, last_name, user_state')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        setUserRole('client'); // Default to client on error
        setUserState('first_access'); // Default state on error
        setIsRoleLoading(false);
        return;
      }
      
      if (data) {
        console.log('User profile fetched:', data);
        setUserRole(data.role);
        setUserState(data.user_state as UserState || 'first_access');
        
        // Store name in localStorage for easy access
        if (data.first_name) {
          localStorage.setItem('userFirstName', data.first_name);
        }
        
        // Update hasCompletedOnboarding based on user state
        if (data.user_state === 'holding_opened') {
          setHasCompletedOnboarding(true);
          localStorage.setItem('holdingSetupCompleted', 'true');
        } else {
          setHasCompletedOnboarding(false);
          localStorage.setItem('holdingSetupCompleted', 'false');
        }
        
      } else {
        console.log('No user profile found, defaulting to client role and first_access state');
        setUserRole('client'); // Default role if not found
        setUserState('first_access'); // Default state if not found
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      setUserRole('client'); // Default to client on error
      setUserState('first_access'); // Default to first_access on error
    } finally {
      setIsRoleLoading(false);
    }
  };
  
  // Configure Supabase auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state changed:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoggedIn(!!currentSession);
        
        // Fetch user profile (role and state) if logged in
        if (currentSession?.user) {
          await fetchUserProfile(currentSession.user.id);
        } else {
          // Reset role and state when logged out
          setUserRole(null);
          setUserState(null);
          setHasCompletedOnboarding(false);
        }
        
        // Show toast for successful email confirmation
        if (event === 'SIGNED_IN' && currentSession?.user?.email_confirmed_at) {
          toast({
            title: "Email confirmado com sucesso",
            description: "Você pode agora acessar sua conta.",
          });
        }
      }
    );

    // THEN check for existing session
    const checkExistingSession = async () => {
      console.log('Checking for existing session');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoggedIn(!!currentSession);
      
      // Fetch user profile if logged in
      if (currentSession?.user) {
        await fetchUserProfile(currentSession.user.id);
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);
  
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        
        // Specific error handling for email not confirmed
        if (error.message === 'Email not confirmed') {
          return { 
            error: 'Email não confirmado. Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.' 
          };
        }
        
        return { error: error.message };
      }
      
      console.log('Login successful, user:', data.user?.id);
      
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
      console.log('Attempting signup for:', email, 'with user data:', userData);
      
      // Configure redirect URL to the login page
      const redirectTo = `${window.location.origin}/login`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
          },
          emailRedirectTo: redirectTo
        }
      });
      
      if (error) {
        console.error('Signup error:', error.message, error);
        return { error: error.message };
      }
      
      console.log('Signup successful, user:', data.user?.id);
      console.log('Full signup response:', data);
      
      // Set default onboarding step
      localStorage.setItem('onboardingStep', 'selection');
      
      // Check if confirmation email was sent
      if (data?.user && !data.user.email_confirmed_at) {
        return { 
          needsEmailConfirmation: true,
        };
      }
      
      return {};
    } catch (error: any) {
      console.error('Error during signup:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return { error: 'Erro ao fazer cadastro: ' + (error.message || JSON.stringify(error)) };
    }
  };
  
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setUserState(null);
    setHasCompletedOnboarding(false);
    localStorage.removeItem('user');
    localStorage.removeItem('onboardingStep');
    localStorage.removeItem('holdingSetupCompleted');
    localStorage.setItem('isLoggedIn', 'false');
  };
  
  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('holdingSetupCompleted', 'true');
    
    // Update user state to holding_opened
    await updateUserState('holding_opened');
  };
  
  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      // Here we could update user metadata in Supabase
      console.log('Updating user data:', data);
    }
  };
  
  // Novo método para atualizar o estado do usuário
  const updateUserState = async (state: UserState) => {
    try {
      if (!user?.id) {
        console.error('Cannot update user state: No user ID');
        return;
      }
      
      console.log(`Updating user state to: ${state} for user: ${user.id}`);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ user_state: state })
        .eq('id', user.id);
        
      if (error) {
        console.error('Error updating user state:', error);
        toast({
          title: "Erro ao atualizar estado",
          description: "Não foi possível atualizar seu progresso no sistema.",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setUserState(state);
      
      // Update onboarding completion flag if state is holding_opened
      if (state === 'holding_opened') {
        setHasCompletedOnboarding(true);
        localStorage.setItem('holdingSetupCompleted', 'true');
      }
      
      console.log(`✅ User state updated to: ${state}`);
    } catch (error) {
      console.error('Error in updateUserState:', error);
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        session,
        hasCompletedOnboarding,
        userRole,
        userState,
        login,
        signUp,
        logout,
        completeOnboarding,
        updateUser,
        updateUserState
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
