
// src/types/user.ts
import { User, Session } from '@supabase/supabase-js';

// Define user state types
export type UserState = 'first_access' | 'onboarding_ai' | 'onboarding_human' | 'holding_setup' | 'holding_opened';

export interface UserData {
  id: string;
  name?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

export interface UserContextType {
  isLoggedIn: boolean;
  user: User | null;
  session: Session | null;
  hasCompletedOnboarding: boolean;
  userRole: string | null;
  userState: UserState | null;
  login: (email: string, password: string) => Promise<{error?: string}>;
  signUp: (email: string, password: string, userData: Partial<UserData>) => Promise<{error?: string; needsEmailConfirmation?: boolean}>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<{ success: boolean; error?: string }>; // Updated return type
  updateUser: (data: Partial<UserData>) => Promise<{ success: boolean; error?: string }>; // Updated return type
  updateUserState: (state: UserState) => Promise<{ success: boolean; error?: string }>; // Ensure this matches provider
}
