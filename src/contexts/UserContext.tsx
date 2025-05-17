
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  isLoggedIn: boolean;
  user: UserData | null;
  hasCompletedOnboarding: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  completeOnboarding: () => void;
  updateUser: (data: Partial<UserData>) => void;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  
  // Initialize state from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedIsLoggedIn = localStorage.getItem('isLoggedIn');
    const storedHasCompletedOnboarding = localStorage.getItem('holdingSetupCompleted');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoggedIn(storedIsLoggedIn === 'true');
    setHasCompletedOnboarding(storedHasCompletedOnboarding === 'true');
  }, []);
  
  const login = (userData: UserData) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Check if onboarding was already completed
    const completed = localStorage.getItem('holdingSetupCompleted') === 'true';
    setHasCompletedOnboarding(completed);
  };
  
  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('user');
    localStorage.setItem('isLoggedIn', 'false');
  };
  
  const completeOnboarding = () => {
    setHasCompletedOnboarding(true);
    localStorage.setItem('holdingSetupCompleted', 'true');
  };
  
  const updateUser = (data: Partial<UserData>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };
  
  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        user,
        hasCompletedOnboarding,
        login,
        logout,
        completeOnboarding,
        updateUser
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
