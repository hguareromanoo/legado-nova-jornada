
import { supabase } from '@/integrations/supabase/client';
import { UserState } from '@/types/user';

// Fetch user profile information from the database
export const fetchUserProfile = async (userId: string) => {
  try {
    console.log('Fetching user profile for user ID:', userId);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, first_name, last_name, user_state')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return { 
        role: 'client', 
        user_state: 'first_access' as UserState,
        first_name: '',
        last_name: ''
      };
    }
    
    console.log('User profile data:', data);
    
    // Store name in localStorage for easy access
    if (data?.first_name) {
      localStorage.setItem('userFirstName', data.first_name);
    }
    
    // Update local storage based on user state
    if (data?.user_state === 'holding_opened') {
      localStorage.setItem('holdingSetupCompleted', 'true');
    } else {
      localStorage.setItem('holdingSetupCompleted', 'false');
    }
    
    return {
      role: data?.role || 'client',
      user_state: (data?.user_state as UserState) || 'first_access',
      first_name: data?.first_name || '',
      last_name: data?.last_name || '',
    };
  } catch (error) {
    console.error('Error in fetchUserProfile:', error);
    return { 
      role: 'client', 
      user_state: 'first_access' as UserState,
      first_name: '',
      last_name: ''
    };
  }
};

// Update user state in the database
export const updateUserStateInDb = async (userId: string, state: UserState) => {
  try {
    if (!userId) {
      console.error('Cannot update user state: No user ID');
      return { success: false, error: 'No user ID provided' };
    }
    
    console.log(`Updating user state to: ${state} for user: ${userId}`);
    
    // Verificar se o perfil do usuário existe
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', userId)
      .single();
      
    if (!existingProfile) {
      console.log(`User profile does not exist for ID ${userId}, creating new profile`);
      
      // Criar perfil se não existir
      const { error: insertError } = await supabase
        .from('user_profiles')
        .insert([{
          id: userId,
          role: 'client',
          user_state: state,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);
        
      if (insertError) {
        console.error('Error creating user profile:', insertError);
        return { success: false, error: insertError.message };
      }
    } else {
      // Atualizar estado do usuário existente
      const { error } = await supabase
        .from('user_profiles')
        .update({ 
          user_state: state,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating user state:', error);
        return { success: false, error: error.message };
      }
    }
    
    // Update local storage if state is holding_opened
    if (state === 'holding_opened') {
      localStorage.setItem('holdingSetupCompleted', 'true');
    }
    
    console.log(`✅ User state updated to: ${state}`);
    return { success: true };
  } catch (error) {
    console.error('Error in updateUserState:', error);
    return { success: false, error: 'Unknown error updating user state' };
  }
};
