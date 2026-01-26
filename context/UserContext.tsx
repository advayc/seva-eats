import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

const USER_STORAGE_KEY = 'user-profile';

export type UserProfile = {
  id: string;
  name: string;
  phone: string;
  homeAddress: {
    address: string;
    latitude: number;
    longitude: number;
  } | null;
  dietaryRestrictions: string[];
  familySize: number;
  notificationsEnabled: boolean;
  role: 'volunteer' | 'recipient' | 'both';
};

type UserContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  setHomeAddress: (address: { address: string; latitude: number; longitude: number }) => Promise<void>;
  clearProfile: () => Promise<void>;
  hasCompletedProfile: boolean;
};

const defaultUser: UserProfile = {
  id: `user-${Date.now()}`,
  name: '',
  phone: '',
  homeAddress: null,
  dietaryRestrictions: [],
  familySize: 1,
  notificationsEnabled: true,
  role: 'both',
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Create default user
        setUser(defaultUser);
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(defaultUser);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updated)).catch(console.error);
      return updated;
    });
  }, []);

  const setHomeAddress = useCallback(async (address: { address: string; latitude: number; longitude: number }) => {
    await updateProfile({ homeAddress: address });
  }, [updateProfile]);

  const clearProfile = useCallback(async () => {
    setUser(defaultUser);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(defaultUser));
  }, []);

  const hasCompletedProfile = useMemo(() => {
    if (!user) return false;
    return !!(user.name && user.phone && user.homeAddress);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      updateProfile,
      setHomeAddress,
      clearProfile,
      hasCompletedProfile,
    }),
    [user, isLoading, updateProfile, setHomeAddress, clearProfile, hasCompletedProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
