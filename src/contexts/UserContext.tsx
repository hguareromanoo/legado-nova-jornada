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
const fetchUserProfile = async (userId: string) => {
  try {
    console.log(`[UserContext] Fetching user profile for ${userId}`);
    
    // Query the user_profiles table to get user role and state
    // Logging the query details for debugging
    console.log(`[UserContext] Querying user_profiles table with user_id = ${userId}`);
    
    const { data, error } = await supabase
      .from('user_profiles')  // Changed from 'profiles' to 'user_profiles'
      .select('user_role, user_state')  // Changed from 'role' to 'user_role'
      .eq('user_id', userId)  // Changed from 'id' to 'user_id'
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
      role: data.user_role || 'user', // Changed from data.role to data.user_role
      user_state: data.user_state || 'onboarding_started'
    };
  } catch (error) {
    console.error('[UserContext] Error in fetchUserProfile:', error);
    // Return default values instead of throwing to prevent crashing
    return {
      role: 'user',
      user_state: 'onboarding_started'
    };
  }
};

// Improved updateUserStateInDb function
const updateUserStateInDb = async (userId: string, state: UserState) => {
  try {
    console.log(`[UserContext] Updating user state in DB to ${state} for user ${userId}`);
    
    const { error } = await supabase
      .from('user_profiles')  // Changed from 'profiles' to 'user_profiles'
      .update({ user_state: state, updated_at: new Date().toISOString() })
      .eq('user_id', userId);  // Changed from 'id' to 'user_id'
    
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
      
      // Set user state with fallback
      setUserState(profileData.user_state || 'onboarding_started');
      
      // Update hasCompletedOnboarding based on user state
      setHasCompletedOnboarding(profileData.user_state === 'holding_opened');
      
      return profileData;
    } catch (error) {
      console.error('[UserContext] Error initializing user profile:', error);
      // Set default values on error to avoid null states
      setUserRole('user');
      setUserState('onboarding_started');
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
          setUserState('onboarding_started');
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
  
  const updateUserState = async (state: UserState) => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user state: No user ID');
      return { success: false, error: 'No user ID available' };
    }
    
    console.log(`[UserContext] Attempting to update user state to ${state}`);
    const result = await updateUserStateInDb(user.id, state);
    
    if (result.success) {
      console.log(`[UserContext] User state successfully updated to ${state} in database`);
      setUserState(state);
      
      if (state === 'holding_opened') {
        setHasCompletedOnboarding(true);
      }
      
      return { success: true };
    } else {
      console.error(`[UserContext] Failed to update user state: ${result.error}`);
      toast({
        title: "Erro ao atualizar estado",
        description: "Não foi possível atualizar seu progresso no sistema.",
        variant: "destructive",
      });
      
      return { success: false, error: result.error };
    }
  };
  
  const completeOnboarding = async () => {
    setHasCompletedOnboarding(true);
    
    // Update user state to holding_opened
    const result = await updateUserState('holding_opened');
    
    // Only store in localStorage if the database update was successful
    if (result.success) {
      localStorage.setItem('holdingSetupCompleted', 'true');
    }
    
    return result;
  };
  
  const updateUser = async (data: Partial<UserData>) => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user: No user ID');
      return { success: false, error: 'No user ID available' };
    }
    
    try {
      console.log('[UserContext] Updating user data:', data);
      
      const { error } = await supabase
        .from('user_profiles')  // Changed from 'profiles' to 'user_profiles'
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);  // Changed from 'id' to 'user_id'
      
      if (error) {
        console.error('[UserContext] Error updating user:', error);
        return { success: false, error: error.message };
      }
      
      return { success: true };
    } catch (error) {
      console.error('[UserContext] Exception in updateUser:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error'
      };
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