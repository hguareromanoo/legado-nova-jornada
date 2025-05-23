
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { fetchUserProfile, updateUserStateInDb } from '@/utils/userUtils';
import { UserContextType, UserData, UserState } from '@/types/user';

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
  const { login: authLogin, signUp: authSignUp, logout: authLogout } = useAuth();
  
  // Initialize user profile data
  const initUserProfile = async (userId: string) => {
    try {
      setIsRoleLoading(true);
      console.log(`Initializing user profile for ${userId}`);
      const profileData = await fetchUserProfile(userId);
      
      console.log('Profile data loaded:', profileData);
      setUserRole(profileData.role);
      setUserState(profileData.user_state);
      
      // Update hasCompletedOnboarding based on user state
      if (profileData.user_state === 'holding_opened') {
        setHasCompletedOnboarding(true);
      } else {
        setHasCompletedOnboarding(false);
      }
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
          await initUserProfile(currentSession.user.id);
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
        await initUserProfile(currentSession.user.id);
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);
  
  const login = async (email: string, password: string) => {
    return await authLogin(email, password);
  };
  
  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    return await authSignUp(email, password, userData);
  };
  
  const logout = async () => {
    await authLogout();
    setUser(null);
    setSession(null);
    setIsLoggedIn(false);
    setUserRole(null);
    setUserState(null);
    setHasCompletedOnboarding(false);
  };
  
  const updateUserState = async (state: UserState) => {
    if (!user?.id) {
      console.error('Cannot update user state: No user ID');
      return;
    }
    
    console.log(`Attempting to update user state to ${state}`);
    const result = await updateUserStateInDb(user.id, state);
    
    if (result.success) {
      console.log(`User state successfully updated to ${state} in database`);
      setUserState(state);
      
      if (state === 'holding_opened') {
        setHasCompletedOnboarding(true);
      }
    } else {
      console.error(`Failed to update user state: ${result.error}`);
      toast({
        title: "Erro ao atualizar estado",
        description: "Não foi possível atualizar seu progresso no sistema.",
        variant: "destructive",
      });
    }
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
