
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserData } from '@/types/user';

export const useAuth = () => {
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('[useAuth] Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('[useAuth] Login error:', error.message);
        
        // Specific error handling for email not confirmed
        if (error.message === 'Email not confirmed') {
          return { 
            error: 'Email não confirmado. Por favor, verifique sua caixa de entrada e confirme seu email antes de fazer login.' 
          };
        }
        
        return { error: error.message };
      }
      
      console.log('[useAuth] Login successful, user:', data.user?.id);
      
      // Store user ID for later use
      if (data.user) {
        localStorage.setItem('currentUserId', data.user.id);
        localStorage.setItem('isLoggedIn', 'true');  // Adicionar flag para rastreamento de estado
      }
      
      // Set default onboarding step if not set
      if (!localStorage.getItem('onboardingStep')) {
        localStorage.setItem('onboardingStep', 'selection');
      }
      
      return { success: true };
    } catch (error) {
      console.error('[useAuth] Error during login:', error);
      return { error: 'Erro ao fazer login' };
    }
  };
  
  // Sign up function
  const signUp = async (email: string, password: string, userData: Partial<UserData>) => {
    try {
      console.log('[useAuth] Attempting signup for:', email, 'with user data:', userData);
      
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
        console.error('[useAuth] Signup error:', error.message, error);
        return { error: error.message };
      }
      
      console.log('[useAuth] Signup successful, user:', data.user?.id);
      console.log('[useAuth] Full signup response:', data);
      
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
      console.error('[useAuth] Error during signup:', error);
      console.error('[useAuth] Error details:', JSON.stringify(error, null, 2));
      return { error: 'Erro ao fazer cadastro: ' + (error.message || JSON.stringify(error)) };
    }
  };
  
  // Logout function
  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userFirstName');
    localStorage.removeItem('onboardingStep');
    localStorage.removeItem('holdingSetupCompleted');
    localStorage.setItem('isLoggedIn', 'false');
  };
  
  return {
    login,
    signUp,
    logout,
    authError
  };
};
