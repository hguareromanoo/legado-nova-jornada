/// src/contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { UserContextType, UserData, UserState } from '@/types/user';

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const fetchUserProfile = async (userId: string) => {
  try {
    console.log(`[UserContext] fetchUserProfile: INICIO para ${userId}`);
    const { data, error } = await supabase
      .from('user_profiles')
      .select('role, user_state')
      .eq('id', userId)
      .single();

    console.log(
      `[UserContext] fetchUserProfile: Query Supabase concluída. Erro:`,
      error,
      `Dados:`,
      data,
    );

    if (error) {
      console.error(
        '[UserContext] fetchUserProfile: Erro ao buscar perfil:',
        error,
      );
      console.error(
        '[UserContext] fetchUserProfile: Detalhes do erro:',
        JSON.stringify(error),
      );
      if (error.code === 'PGRST116') {
        console.warn(
          `[UserContext] fetchUserProfile: Nenhum perfil encontrado para ${userId}. Pode ser um novo usuário.`,
        );
        return { role: 'client', user_state: 'first_access' as UserState };
      }
      // Para outros erros, não lançamos, mas retornamos o padrão para evitar que a UI quebre totalmente
      // e confiamos no `finally` de `initUserProfile` para setar `isRoleLoading = false`.
      // Ou, se preferir que a aplicação mostre um erro mais explícito, pode-se lançar o erro aqui
      // e garantir que `initUserProfile` trate isso de forma a não deixar `isRoleLoading` como true.
      // throw error; // Se optar por lançar, o catch em initUserProfile precisa ser robusto.
      // Por ora, retornando padrão em caso de erro não PGRST116:
      return {
        role: 'client',
        user_state: 'first_access' as UserState,
        error: error.message,
      };
    }

    if (!data) {
      console.warn(
        `[UserContext] fetchUserProfile: Nenhum dado de perfil encontrado para ${userId} (após checagem de erro).`,
      );
      return { role: 'client', user_state: 'first_access' as UserState };
    }

    console.log(
      '[UserContext] fetchUserProfile: Dados do perfil recuperados:',
      JSON.stringify(data),
    );
    return {
      role: data.role || 'client',
      user_state: (data.user_state as UserState) || ('first_access' as UserState),
    };
  } catch (error) {
    // Este catch lida com erros inesperados dentro da própria função fetchUserProfile
    console.error(
      '[UserContext] fetchUserProfile: CAIU NO CATCH GERAL:',
      error,
    );
    return {
      role: 'client',
      user_state: 'first_access' as UserState,
      error: error instanceof Error ? error.message : 'Erro desconhecido em fetchUserProfile',
    };
  }
};

const updateUserStateInDb = async (userId: string, state: UserState) => {
  try {
    console.log(
      `[UserContext] updateUserStateInDb: Atualizando estado no DB para ${state} para usuário ${userId}`,
    );
    const { error } = await supabase
      .from('user_profiles')
      .update({ user_state: state, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error(
        '[UserContext] updateUserStateInDb: Erro ao atualizar estado do usuário:',
        error,
      );
      console.error(
        '[UserContext] updateUserStateInDb: Detalhes do erro:',
        JSON.stringify(error),
      );
      return { success: false, error: error.message };
    }
    console.log(
      `[UserContext] updateUserStateInDb: Estado do usuário atualizado com sucesso no DB para ${state}`,
    );
    return { success: true };
  } catch (error) {
    console.error(
      '[UserContext] updateUserStateInDb: Exceção:',
      error,
    );
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] =
    useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true);
  const { toast } = useToast();
  const {
    login: authLogin,
    signUp: authSignUp,
    logout: authLogout,
  } = useAuth();

  const initUserProfile = async (userId: string) => {
    setIsRoleLoading(true);
    console.log(
      `[UserContext] initUserProfile: INICIO, isRoleLoading = true para ${userId}`,
    );
    try {
      const profileData = await fetchUserProfile(userId);

      // @ts-ignore
      if (profileData.error) {
        // @ts-ignore
        console.error(`[UserContext] initUserProfile: Erro retornado por fetchUserProfile: ${profileData.error}`);
        // Mesmo com erro no fetch, setamos role/state para defaults para não travar
      }
      
      // @ts-ignore
      setUserRole(profileData.role);
      // @ts-ignore
      setUserState(profileData.user_state);
      // @ts-ignore
      setHasCompletedOnboarding(profileData.user_state === 'holding_opened');
      console.log(
        `[UserContext] initUserProfile: Perfil carregado e estados definidos para ${userId}:`,
        // @ts-ignore
        { role: profileData.role, state: profileData.user_state },
      );
    } catch (error) {
      console.error(
        `[UserContext] initUserProfile: CAIU NO CATCH GERAL para ${userId}:`,
        error,
      );
      setUserRole('client');
      setUserState('first_access');
      setHasCompletedOnboarding(false);
    } finally {
      setIsRoleLoading(false);
      console.log(
        `[UserContext] initUserProfile: FINALLY, isRoleLoading = false para ${userId}`,
      );
    }
  };

  useEffect(() => {
    console.log('[UserContext] useEffect: Configurando listener de authStateChange.');
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log(
        `[UserContext] onAuthStateChange: Evento: ${event}, Usuário: ${currentSession?.user?.id}`,
      );
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);

      if (currentUser) {
        await initUserProfile(currentUser.id);
      } else {
        console.log(
          '[UserContext] onAuthStateChange: Nenhum usuário, resetando estados e isRoleLoading = false.',
        );
        setUserRole(null);
        setUserState(null);
        setHasCompletedOnboarding(false);
        setIsRoleLoading(false);
      }

      if (event === 'SIGNED_IN' && currentSession?.user?.email_confirmed_at) {
        toast({
          title: 'Email confirmado com sucesso',
          description: 'Você pode agora acessar sua conta.',
        });
      }
    });

    const checkExistingSession = async () => {
      console.log(
        '[UserContext] checkExistingSession: Verificando sessão existente.',
      );
      setIsRoleLoading(true); // Garantir que está carregando ao verificar sessão
      console.log(
        '[UserContext] checkExistingSession: isRoleLoading = true',
      );
      try {
        const {
          data: { session: currentInitialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error(
            '[UserContext] checkExistingSession: Erro ao buscar sessão:',
            sessionError,
          );
          setIsLoggedIn(false);
          setUser(null);
          setSession(null);
          setIsRoleLoading(false);
          console.log(
            '[UserContext] checkExistingSession: Erro na sessão, isRoleLoading = false',
          );
          return;
        }

        console.log(
          '[UserContext] checkExistingSession: Resultado:',
          currentInitialSession
            ? `Sessão encontrada para ${currentInitialSession.user.id}`
            : 'Nenhuma sessão.',
        );

        setSession(currentInitialSession);
        const currentInitialUser = currentInitialSession?.user ?? null;
        setUser(currentInitialUser);
        setIsLoggedIn(!!currentInitialUser);

        if (currentInitialUser) {
          await initUserProfile(currentInitialUser.id);
        } else {
          setIsRoleLoading(false);
          console.log(
            '[UserContext] checkExistingSession: Nenhum usuário inicial, isRoleLoading = false',
          );
        }
      } catch (error) {
        console.error(
          '[UserContext] checkExistingSession: Exceção ao verificar sessão:',
          error,
        );
        setIsLoggedIn(false);
        setUser(null);
        setSession(null);
        setIsRoleLoading(false);
        console.log(
          '[UserContext] checkExistingSession: Exceção, isRoleLoading = false',
        );
      }
    };

    checkExistingSession();

    return () => {
      console.log(
        '[UserContext] useEffect: Desinscrevendo listener de authStateChange.',
      );
      subscription.unsubscribe();
    };
  }, [toast]); // A dependência `toast` é estável.

  const login = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    console.log(`[UserContext] login: Tentando login para ${email}`);
    const result = await authLogin(email, password);
    if (result.error) {
      console.error(`[UserContext] login: Erro no login: ${result.error}`);
      return { error: result.error };
    }
    // O perfil será inicializado por onAuthStateChange
    console.log(`[UserContext] login: Login bem-sucedido para ${email}`);
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserData>,
  ): Promise<{ error?: string; needsEmailConfirmation?: boolean }> => {
    console.log(`[UserContext] signUp: Tentando cadastro para ${email}`);
    return await authSignUp(email, password, userData);
  };

  const logout = async (): Promise<void> => {
    console.log('[UserContext] logout: Iniciando processo de logout.');
    await authLogout();
    // Estados serão resetados por onAuthStateChange
    console.log('[UserContext] logout: Logout concluído.');
  };

  const updateUserState = async (
    state: UserState,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      console.error(
        '[UserContext] updateUserState: Não pode atualizar estado, ID do usuário ausente.',
      );
      return { success: false, error: 'ID do usuário não disponível' };
    }
    console.log(
      `[UserContext] updateUserState: Tentando atualizar estado para ${state}`,
    );
    const result = await updateUserStateInDb(user.id, state);
    if (result.success) {
      console.log(
        `[UserContext] updateUserState: Estado atualizado para ${state} localmente.`,
      );
      setUserState(state);
      if (state === 'holding_opened') {
        setHasCompletedOnboarding(true);
      }
      return { success: true };
    } else {
      toast({
        title: 'Erro ao atualizar estado',
        description: 'Não foi possível atualizar seu progresso no sistema.',
        variant: 'destructive',
      });
      return { success: false, error: result.error };
    }
  };

  const completeOnboarding = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    console.log(
      '[UserContext] completeOnboarding: Completando onboarding, definindo estado para holding_opened.',
    );
    const result = await updateUserState('holding_opened');
    if (result.success) {
      setHasCompletedOnboarding(true);
      localStorage.setItem('holdingSetupCompleted', 'true');
    }
    return result;
  };

  const updateUser = async (
    data: Partial<UserData>,
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      console.error(
        '[UserContext] updateUser: Não pode atualizar usuário, ID do usuário ausente.',
      );
      return { success: false, error: 'ID do usuário não disponível' };
    }
    try {
      console.log('[UserContext] updateUser: Atualizando dados do usuário:', data);
      const { error } = await supabase
        .from('user_profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) {
        console.error(
          '[UserContext] updateUser: Erro ao atualizar usuário:',
          error,
        );
        return { success: false, error: error.message };
      }
      if (data.first_name && user.user_metadata) {
        setUser((prevUser) =>
          prevUser
            ? {
                ...prevUser,
                user_metadata: {
                  ...prevUser.user_metadata,
                  first_name: data.first_name,
                },
              }
            : null,
        );
      }
      console.log('[UserContext] updateUser: Dados do usuário atualizados com sucesso.');
      return { success: true };
    } catch (error) {
      console.error('[UserContext] updateUser: Exceção:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  };

  // Log para monitorar mudanças de estado importantes
  useEffect(() => {
    console.log('[UserContext] EFETIVO (MUDANÇA DE ESTADO):', {
      isLoggedIn,
      userRole,
      userState,
      hasCompletedOnboarding,
      isRoleLoading,
      userId: user?.id,
      sessionDefined: !!session,
    });
  }, [
    isLoggedIn,
    userRole,
    userState,
    hasCompletedOnboarding,
    isRoleLoading,
    user,
    session,
  ]);

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
        updateUserState,
      }}
    >
      {!isRoleLoading ? (
        children
      ) : (
        <div className="w-full min-h-screen flex items-center justify-center">
          <div className="animate-pulse">Carregando usuário...</div>
        </div>
      )}
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