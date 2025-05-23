import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserContextType, UserData, UserState } from '@/types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Improved fetchUserProfile function that directly queries the database
const fetchUserProfile = async (userId: string): Promise<{ role: string, user_state: UserState }> => {
  try {
    console.log(`[UserContext] Fetching user profile for ${userId}`);
    
    // Ensure we're querying the right table and column
    // Debug log for easy identification of the exact query being executed
    console.log(`[UserContext] QUERY: SELECT role, user_state FROM user_profiles WHERE user_id = '${userId}'`);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, user_state')
      .eq('user_id', userId)
      .single();
    
    if (error) {
      console.error('[UserContext] Error fetching user profile:', error);
      console.error('[UserContext] Error details:', JSON.stringify(error));
      throw error;
    }
    
    if (!data) {
      console.error('[UserContext] No profile data found for user:', userId);
      throw new Error('No profile data found');
    }
    
    console.log('[UserContext] Profile data retrieved:', JSON.stringify(data));
    
    return {
      role: data.role || 'user',
      // Using type assertion for the user_state
      user_state: (data.user_state as UserState) || ('onboarding_started' as UserState)
    };
  } catch (error) {
    console.error('[UserContext] Error in fetchUserProfile:', error);
    // Return default values instead of throwing to prevent crashing
    return {
      role: 'user',
      user_state: 'onboarding_started' as UserState
    };
  }
};

// Improved updateUserStateInDb function
const updateUserStateInDb = async (userId: string, state: UserState) => {
  try {
    console.log(`[UserContext] Updating user state in DB to ${state} for user ${userId}`);
    
    const { error } = await supabase
      .from('user_profiles')
      .update({ user_state: state, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    
    if (error) {
      console.error('[UserContext] Error updating user state:', error);
      console.error('[UserContext] Error details:', JSON.stringify(error));
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (error) {
    console.error('[UserContext] Exception in updateUserStateInDb:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const { login: authLogin, signUp: authSignUp, logout: authLogout } = useAuth();
  
  // Improved user profile initialization
  const initUserProfile = async (userId: string) => {
    try {
      setIsRoleLoading(true);
      console.log(`[UserContext] Initializing user profile for ${userId}`);
      
      // Use the local fetchUserProfile function instead of imported one
      const profileData = await fetchUserProfile(userId);
      
      console.log('[UserContext] Profile data loaded:', JSON.stringify(profileData));
      
      // Set role with fallback
      setUserRole(profileData.role || 'user');
      
      // Use the correctly typed state setter for UserState
      setUserState(() => profileData.user_state);
      
      // Update hasCompletedOnboarding based on user state
      setHasCompletedOnboarding(profileData.user_state === 'holding_opened');
      
      return profileData;
    } catch (error) {
      console.error('[UserContext] Error initializing user profile:', error);
      // Set default values on error to avoid null states
      setUserRole('user');
      
      // Use a functional update to fix type compatibility
      setUserState(() => 'onboarding_started' as UserState);
      
      setHasCompletedOnboarding(false);
      return null;
    } finally {
      // Ensure isRoleLoading is set to false even if there's an error
      setIsRoleLoading(false);
    }
  };
  
  // Configure Supabase auth state listener and check for existing session
  useEffect(() => {
    console.log('[UserContext] Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('[UserContext] Auth state changed:', event);
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
      console.log('[UserContext] Checking for existing session');
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      console.log('[UserContext] Existing session check result:', currentSession ? 'Found session' : 'No session');
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoggedIn(!!currentSession);
      
      // Fetch user profile if logged in
      if (currentSession?.user) {
        try {
          // Set a timeout to ensure the initialization doesn't hang indefinitely
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Profile initialization timed out')), 10000);
          });
          
          // Try to initialize profile with timeout
          const profilePromise = initUserProfile(currentSession.user.id);
          
          await Promise.race([profilePromise, timeoutPromise]);
        } catch (error) {
          console.error('[UserContext] Error during profile initialization:', error);
          // Set default values if initialization fails
          setUserRole('user');
          
          // Use a functional update to fix type compatibility
          setUserState(() => 'onboarding_started' as UserState);
          
          setHasCompletedOnboarding(false);
          setIsRoleLoading(false);
        }
      } else {
        setIsRoleLoading(false);
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);
  
  const login = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    return result;
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
  
  const updateUserState = async (state: UserState): Promise<void> => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user state: No user ID');
      toast({
        title: "Erro ao atualizar estado",
        description: "Não foi possível identificar seu usuário.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log(`[UserContext] Attempting to update user state to ${state}`);
      const result = await updateUserStateInDb(user.id, state);
      
      if (result.success) {
        console.log(`[UserContext] User state successfully updated to ${state} in database`);
        
        // Use a functional update to fix type compatibility
        setUserState(() => state);
        
        if (state === 'holding_opened') {
          setHasCompletedOnboarding(true);
        }
      } else {
        console.error(`[UserContext] Failed to update user state: ${result.error}`);
        toast({
          title: "Erro ao atualizar estado",
          description: "Não foi possível atualizar seu progresso no sistema.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[UserContext] Exception in updateUserState:', error);
      toast({
        title: "Erro ao atualizar estado",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };
  
  const completeOnboarding = async (): Promise<void> => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('holdingSetupCompleted', 'true');
    
    // Update user state to holding_opened
    await updateUserState('holding_opened' as UserState);
  };
  
  const updateUser = async (data: Partial<UserData>): Promise<void> => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user: No user ID');
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível identificar seu usuário.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log('[UserContext] Updating user data:', data);
      
      // Map from UserData to database columns
      const dbData = { ...data };
      
      // Convert role property if it exists (important for type safety)
      if ('role' in data) {
        dbData.role = data.role; // Using 'role' as the correct column name
      }
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
      
      if (error) {
        console.error('[UserContext] Error updating user:', error);
        toast({
          title: "Erro ao atualizar perfil",
          description: "Não foi possível atualizar suas informações.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('[UserContext] Exception in updateUser:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    }
  };
  
  // Log the current state for debugging
  useEffect(() => {
    console.log('[UserContext] Current state:', { 
      isLoggedIn,
      userRole,
      userState,
      hasCompletedOnboarding,
      isRoleLoading
    });
  }, [isLoggedIn, userRole, userState, hasCompletedOnboarding, isRoleLoading]);
  
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