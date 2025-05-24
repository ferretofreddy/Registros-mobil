import { createContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { authService } from '@/services/authService';
import { Platform } from 'react-native';

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  signIn: (username: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  signIn: async () => false,
  signOut: async () => {},
});

// Mock implementation for web platform
const webStorage = new Map<string, string>();

const secureStoreWrapper = {
  getItemAsync: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return webStorage.get(key) || null;
    }
    return await SecureStore.getItemAsync(key);
  },
  setItemAsync: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      webStorage.set(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  deleteItemAsync: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      webStorage.delete(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  // Check if user is authenticated on initial load
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await secureStoreWrapper.getItemAsync('userToken');
        const userData = await secureStoreWrapper.getItemAsync('userData');
        
        if (token) {
          authService.setToken(token);
          setIsAuthenticated(true);
          if (userData) {
            setUser(JSON.parse(userData));
          }
        }
      } catch (error) {
        console.error('Failed to load authentication state', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  const signIn = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login(username, password);
      
      if (response.token) {
        await secureStoreWrapper.setItemAsync('userToken', response.token);
        await secureStoreWrapper.setItemAsync('userData', JSON.stringify(response.user));
        
        authService.setToken(response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error', error);
      return false;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await secureStoreWrapper.deleteItemAsync('userToken');
      await secureStoreWrapper.deleteItemAsync('userData');
      
      authService.clearToken();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}