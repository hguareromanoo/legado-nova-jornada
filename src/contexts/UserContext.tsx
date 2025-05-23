// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserContextType, UserData, UserState } from '@/types/user'; // Ensure UserState is imported

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

// Improved fetchUserProfile function that directly queries the database
const fetchUserProfile = async (userId: string) => {
  try {
    console.log(`[UserContext] Fetching user profile for ${userId}`);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, user_state') // Ensure 'role' is the correct column name, or 'user_role' if that's what you have
      .eq('id', userId) // Ensure 'id' is the correct column name for user_id in user_profiles, or 'user_id'
      .single();
    
    if (error) {
      console.error('[UserContext] Error fetching user profile:', error);
      console.error('[UserContext] Error details:', JSON.stringify(error));
      // If profile doesn't exist, it might not be an error, could be a new user.
      // Depending on your logic, you might want to create it here or return default/null.
      if (error.code === 'PGRST116') { // PGRST116: "The result contains 0 rows"
        console.warn(`[UserContext] No profile found for user ${userId}. This might be a new user.`);
        return { role: 'client', user_state: 'first_access' as UserState }; // Default for new user
      }
      throw error;
    }
    
    if (!data) {
      console.warn('[UserContext] No profile data found for user (after error check):', userId);
      return { role: 'client', user_state: 'first_access' as UserState };
    }
    
    console.log('[UserContext] Profile data retrieved:', JSON.stringify(data));
    return {
      role: data.role || 'client', // Default to 'client' if role is null
      user_state: (data.user_state as UserState) || ('first_access' as UserState) // Default to 'first_access'
    };
  } catch (error) {
    console.error('[UserContext] Error in fetchUserProfile:', error);
    return {
      role: 'client', // Default role on error
      user_state: 'first_access' as UserState // Default state on error
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
      .eq('id', userId); // Ensure 'id' is the correct column name
    
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Initialize to false
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true); // Start as true
  const { toast } = useToast();
  const { login: authLogin, signUp: authSignUp, logout: authLogout } = useAuth();
  
  const initUserProfile = async (userId: string) => {
    setIsRoleLoading(true); // Set loading true at the start
    try {
      console.log(`[UserContext] Initializing user profile for ${userId}`);
      const profileData = await fetchUserProfile(userId);
      
      console.log('[UserContext] Profile data loaded:', JSON.stringify(profileData));
      
      setUserRole(profileData.role);
      setUserState(profileData.user_state);
      setHasCompletedOnboarding(profileData.user_state === 'holding_opened');
      
    } catch (error) {
      console.error('[UserContext] Error initializing user profile in initUserProfile:', error);
      setUserRole('client'); 
      setUserState('first_access');
      setHasCompletedOnboarding(false);
    } finally {
      setIsRoleLoading(false); // Set loading false at the end
    }
  };
  
  useEffect(() => {
    console.log('[UserContext] Setting up auth state listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('[UserContext] Auth state changed:', event, currentSession?.user?.id);
        setSession(currentSession);
        const currentUser = currentSession?.user ?? null;
        setUser(currentUser);
        setIsLoggedIn(!!currentUser);
        
        if (currentUser) {
          await initUserProfile(currentUser.id);
        } else {
          setUserRole(null);
          setUserState(null);
          setHasCompletedOnboarding(false);
          setIsRoleLoading(false); // Ensure loading is false if logged out
        }
        
        if (event === 'SIGNED_IN' && currentSession?.user?.email_confirmed_at) {
          toast({
            title: "Email confirmado com sucesso",
            description: "Você pode agora acessar sua conta.",
          });
        }
      }
    );

    // Check for existing session on initial load
    const checkExistingSession = async () => {
      console.log('[UserContext] Checking for existing session');
      const { data: { session: currentInitialSession } } = await supabase.auth.getSession();
      console.log('[UserContext] Existing session check result:', currentInitialSession ? `Found session for ${currentInitialSession.user.id}` : 'No session');
      
      setSession(currentInitialSession);
      const currentInitialUser = currentInitialSession?.user ?? null;
      setUser(currentInitialUser);
      setIsLoggedIn(!!currentInitialUser);
      
      if (currentInitialUser) {
        await initUserProfile(currentInitialUser.id);
      } else {
        setIsRoleLoading(false); // No user, so role loading is complete
      }
    };
    
    checkExistingSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);
  
  const login = async (email: string, password: string): Promise<{error?: string}> => {
    const result = await authLogin(email, password);
    if (result.error) return { error: result.error };
    // Profile will be initialized by onAuthStateChange
    return {};
  };
  
  const signUp = async (email: string, password: string, userData: Partial<UserData>): Promise<{error?: string; needsEmailConfirmation?: boolean}> => {
    return await authSignUp(email, password, userData);
  };
  
  const logout = async (): Promise<void> => {
    await authLogout();
    // States (user, session, isLoggedIn, userRole, userState, hasCompletedOnboarding) will be reset by onAuthStateChange
  };
  
  const updateUserState = async (state: UserState): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user state: No user ID');
      return { success: false, error: 'No user ID available' };
    }
    
    console.log(`[UserContext] Attempting to update user state to ${state}`);
    const result = await updateUserStateInDb(user.id, state);
    
    if (result.success) {
      console.log(`[UserContext] User state successfully updated to ${state} in database`);
      setUserState(state); // Update local state
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
  
  const completeOnboarding = async (): Promise<{ success: boolean; error?: string }> => {
    const result = await updateUserState('holding_opened');
    if (result.success) {
      setHasCompletedOnboarding(true); // Ensure local state is also updated
      localStorage.setItem('holdingSetupCompleted', 'true');
    }
    return result;
  };
  
  const updateUser = async (data: Partial<UserData>): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      console.error('[UserContext] Cannot update user: No user ID');
      return { success: false, error: 'No user ID available' };
    }
    
    try {
      console.log('[UserContext] Updating user data:', data);
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id); // Ensure 'id' is the correct column name
      
      if (error) {
        console.error('[UserContext] Error updating user:', error);
        return { success: false, error: error.message };
      }
      // Optionally re-fetch profile or update specific fields if `data` contains `first_name`, `last_name`, etc.
      // For now, we assume that if user_metadata changes, onAuthStateChange might pick it up, or a manual refresh of User object is needed.
      // Or, update relevant parts of the 'user' object in state if UserData maps directly to Supabase User's metadata.
      if(data.first_name && user.user_metadata){
        setUser(prevUser => prevUser ? {...prevUser, user_metadata: {...prevUser.user_metadata, first_name: data.first_name}} : null);
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
  
  useEffect(() => {
    console.log('[UserContext] Current state logged:', { 
      isLoggedIn,
      userRole,
      userState,
      hasCompletedOnboarding,
      isRoleLoading,
      userId: user?.id
    });
  }, [isLoggedIn, userRole, userState, hasCompletedOnboarding, isRoleLoading, user]);
  
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
      {!isRoleLoading ? children : <div className="w-full min-h-screen flex items-center justify-center"><div className="animate-pulse">Carregando usuário...</div></div>}
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