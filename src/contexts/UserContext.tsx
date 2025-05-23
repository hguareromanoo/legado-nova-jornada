// src/contexts/UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
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

// Tipo para o retorno de fetchUserProfile, incluindo um campo opcional de erro para melhor tratamento
type UserProfileResponse = {
  role: string;
  user_state: UserState;
  error?: string;
};

const fetchUserProfile = async (userId: string): Promise<UserProfileResponse> => {
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
      JSON.stringify(data),
    );

    if (error) {
      console.error(
        '[UserContext] fetchUserProfile: Erro ao buscar perfil:',
        error.message,
      );
      if (error.code === 'PGRST116') {
        console.warn(
          `[UserContext] fetchUserProfile: Nenhum perfil encontrado para ${userId}. Pode ser um novo usuário. Retornando defaults.`,
        );
        return { role: 'client', user_state: 'first_access' as UserState };
      }
      // Retorna um objeto de erro explícito para outros tipos de erro
      return {
        role: 'client', // Default role
        user_state: 'first_access' as UserState, // Default state
        error: error.message || 'Erro desconhecido ao buscar perfil do usuário.',
      };
    }

    if (!data) {
      console.warn(
        `[UserContext] fetchUserProfile: Nenhum dado de perfil encontrado para ${userId}. Retornando defaults.`,
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
  } catch (error: any) {
    console.error(
      '[UserContext] fetchUserProfile: CAIU NO CATCH GERAL:',
      error.message,
    );
    return {
      role: 'client',
      user_state: 'first_access' as UserState,
      error: error.message || 'Erro desconhecido em fetchUserProfile',
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
      return { success: false, error: error.message };
    }
    console.log(
      `[UserContext] updateUserStateInDb: Estado do usuário atualizado com sucesso no DB para ${state}`,
    );
    return { success: true };
  } catch (error: any) {
    console.error(
      '[UserContext] updateUserStateInDb: Exceção:',
      error,
    );
    return {
      success: false,
      error: error.message || 'Erro desconhecido',
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
  const [isRoleLoading, setIsRoleLoading] = useState<boolean>(true); // Mantém true inicialmente
  const { toast } = useToast();
  const {
    login: authLogin,
    signUp: authSignUp,
    logout: authLogout,
  } = useAuth();

  const initUserProfile = useCallback(async (userId: string) => {
    // Não definimos setIsRoleLoading(true) aqui, pois ele já é definido antes da chamada
    console.log(
      `[UserContext] initUserProfile: INICIO para ${userId}`,
    );
    try {
      const profileData = await fetchUserProfile(userId);

      if (profileData.error) {
        console.error(
          `[UserContext] initUserProfile: Erro retornado por fetchUserProfile para ${userId}: ${profileData.error}`,
        );
        // Define defaults mesmo em caso de erro no fetch, para não travar a UI.
        // O erro já foi logado em fetchUserProfile.
      }
      
      setUserRole(profileData.role);
      setUserState(profileData.user_state);
      setHasCompletedOnboarding(profileData.user_state === 'holding_opened');
      console.log(
        `[UserContext] initUserProfile: Perfil carregado e estados definidos para ${userId}:`,
        { role: profileData.role, state: profileData.user_state },
      );
    } catch (error) { // Este catch lida com erros inesperados na própria initUserProfile
      console.error(
        `[UserContext] initUserProfile: CAIU NO CATCH GERAL para ${userId}:`,
        error,
      );
      setUserRole('client');
      setUserState('first_access');
      setHasCompletedOnboarding(false);
    } finally {
      //setIsRoleLoading(false) é chamado no useEffect após a cadeia de promessas
    }
  }, []); // Adicionado useCallback e dependências vazias pois toast não muda. Se usar outras deps, adicionar.

  useEffect(() => {
    console.log('[UserContext] useEffect principal: Configurando listener de authStateChange e verificando sessão.');
    
    let isMounted = true; // Flag para evitar atualizações de estado em componente desmontado

    const handleAuthChange = async (event: string, currentSession: Session | null) => {
      if (!isMounted) return;
      console.log(
        `[UserContext] onAuthStateChange: Evento: ${event}, Usuário: ${currentSession?.user?.id ?? 'null'}`,
      );
      
      setSession(currentSession);
      const currentUser = currentSession?.user ?? null;
      setUser(currentUser);
      setIsLoggedIn(!!currentUser);

      if (currentUser) {
        await initUserProfile(currentUser.id);
      } else {
        console.log(
          '[UserContext] onAuthStateChange: Nenhum usuário, resetando estados.',
        );
        setUserRole(null);
        setUserState(null);
        setHasCompletedOnboarding(false);
      }
      setIsRoleLoading(false); // Definir como false após processar o evento de autenticação
      console.log(
        `[UserContext] onAuthStateChange: FINALIZADO, isRoleLoading = ${false}`,
      );

      if (event === 'SIGNED_IN' && currentSession?.user?.email_confirmed_at) {
        toast({
          title: 'Email confirmado com sucesso',
          description: 'Você pode agora acessar sua conta.',
        });
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(handleAuthChange);

    const checkExistingSession = async () => {
      if (!isMounted) return;
      console.log(
        '[UserContext] checkExistingSession: Verificando sessão existente. isRoleLoading = true',
      );
      setIsRoleLoading(true);
      try {
        const {
          data: { session: currentInitialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (sessionError) {
          console.error(
            '[UserContext] checkExistingSession: Erro ao buscar sessão:',
            sessionError.message,
          );
          setIsLoggedIn(false);
          setUser(null);
          setSession(null);
          setUserRole(null);
          setUserState(null);
          setHasCompletedOnboarding(false);
          setIsRoleLoading(false);
          console.log(
            '[UserContext] checkExistingSession: Erro na sessão, isRoleLoading = false',
          );
          return;
        }

        console.log(
          '[UserContext] checkExistingSession: Sessão da API:',
          currentInitialSession ? `Sessão para ${currentInitialSession.user.id}` : 'Nenhuma sessão.',
        );

        // Se não houver sessão, o onAuthStateChange já terá sido chamado com INITIAL_SESSION (ou equivalente)
        // e currentUser será null, então handleAuthChange já terá definido isRoleLoading = false.
        // Se houver sessão, o handleAuthChange será chamado com SIGNED_IN (ou equivalente),
        // e o initUserProfile será chamado, e isRoleLoading será tratado lá.
        // A lógica aqui é simplificada porque onAuthStateChange lida com a configuração inicial.
        // No entanto, para garantir, se não houver usuário na sessão inicial, explicitamente setamos loading false.
        if (!currentInitialSession?.user) {
            setSession(null);
            setUser(null);
            setIsLoggedIn(false);
            setUserRole(null);
            setUserState(null);
            setHasCompletedOnboarding(false);
            setIsRoleLoading(false);
            console.log(
                '[UserContext] checkExistingSession: Nenhuma sessão inicial ou usuário, isRoleLoading = false',
            );
        } else {
            // Se existe sessão, o onAuthStateChange vai lidar com initUserProfile e isRoleLoading.
            // Apenas para garantir que o listener seja configurado antes de qualquer coisa:
            // setSession(currentInitialSession);
            // setUser(currentInitialSession.user);
            // setIsLoggedIn(true);
            // await initUserProfile(currentInitialSession.user.id); // initUserProfile definirá isRoleLoading = false
        }

      } catch (error: any) {
        if (!isMounted) return;
        console.error(
          '[UserContext] checkExistingSession: Exceção ao verificar sessão:',
          error.message,
        );
        setIsLoggedIn(false);
        setUser(null);
        setSession(null);
        setUserRole(null);
        setUserState(null);
        setHasCompletedOnboarding(false);
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
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [toast, initUserProfile]); // Adicionado initUserProfile como dependência de useCallback

  const login = async (
    email: string,
    password: string,
  ): Promise<{ error?: string }> => {
    console.log(`[UserContext] login: Tentando login para ${email}`);
    setIsRoleLoading(true); // Define loading ao iniciar o login
    const result = await authLogin(email, password);
    if (result.error) {
      console.error(`[UserContext] login: Erro no login: ${result.error}`);
      setIsRoleLoading(false); // Define false se o login falhar
      return { error: result.error };
    }
    // O perfil será inicializado por onAuthStateChange, que também setará isRoleLoading = false
    console.log(`[UserContext] login: Login bem-sucedido para ${email}. Aguardando onAuthStateChange.`);
    return {};
  };

  const signUp = async (
    email: string,
    password: string,
    userData: Partial<UserData>,
  ): Promise<{ error?: string; needsEmailConfirmation?: boolean }> => {
    console.log(`[UserContext] signUp: Tentando cadastro para ${email}`);
    setIsRoleLoading(true); // Define loading ao iniciar signup
    const result = await authSignUp(email, password, userData);
    // Se o signup precisar de confirmação, o usuário não estará logado imediatamente.
    // onAuthStateChange cuidará do estado de loading quando a confirmação acontecer ou se não for necessária.
    if(result.error || result.needsEmailConfirmation) {
        setIsRoleLoading(false);
    }
    return result;
  };

  const logout = async (): Promise<void> => {
    console.log('[UserContext] logout: Iniciando processo de logout.');
    await authLogout();
    // Estados serão resetados por onAuthStateChange, que também setará isRoleLoading = false
    console.log('[UserContext] logout: Logout concluído.');
  };

  const updateUserState = useCallback(async (
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
      setUserState(state); // Atualiza o estado local
      if (state === 'holding_opened') {
        setHasCompletedOnboarding(true);
      }
      return { success: true };
    } else {
      toast({
        title: 'Erro ao atualizar estado',
        description: result.error || 'Não foi possível atualizar seu progresso no sistema.',
        variant: 'destructive',
      });
      return { success: false, error: result.error };
    }
  }, [user, toast]); // Adicionado toast como dependência

  const completeOnboarding = useCallback(async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    console.log(
      '[UserContext] completeOnboarding: Completando onboarding, definindo estado para holding_opened.',
    );
    const result = await updateUserState('holding_opened');
    if (result.success) {
      setHasCompletedOnboarding(true); // Garante que o estado local também seja atualizado
      localStorage.setItem('holdingSetupCompleted', 'true');
    }
    return result;
  }, [updateUserState]);

  const updateUser = useCallback(async (
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
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (updateError) {
        console.error(
          '[UserContext] updateUser: Erro ao atualizar usuário:',
          updateError,
        );
        return { success: false, error: updateError.message };
      }
      
      // Atualizar o estado local do usuário se campos relevantes mudarem
      // Isso é um pouco simplista; o ideal seria refetchar o user.user_metadata ou o perfil completo
      setUser(prevUser => {
        if (!prevUser) return null;
        const newUserMetadata = { ...prevUser.user_metadata };
        if (data.first_name) newUserMetadata.first_name = data.first_name;
        if (data.last_name) newUserMetadata.last_name = data.last_name;
        // Adicione outros campos de metadata se necessário
        return { ...prevUser, user_metadata: newUserMetadata };
      });

      // Se o role ou user_state foram alterados em 'data', atualize os estados locais
      if (data.role && typeof data.role === 'string') setUserRole(data.role);
      if (data.user_state) setUserState(data.user_state as UserState);


      console.log('[UserContext] updateUser: Dados do usuário atualizados com sucesso.');
      return { success: true };
    } catch (error: any) {
      console.error('[UserContext] updateUser: Exceção:', error);
      return {
        success: false,
        error: error.message || 'Erro desconhecido',
      };
    }
  }, [user]); // Adicionado user como dependência

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
        <div className="w-full min-h-screen flex items-center justify-center bg-white">
          {/* Mantido o fundo branco para a tela de loading */}
          <div className="animate-pulse text-gray-700">Carregando usuário...</div>
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