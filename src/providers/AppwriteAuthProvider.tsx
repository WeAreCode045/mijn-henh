
import React, { createContext, useContext, useEffect, useState } from "react";
import { appwriteAccount } from "@/integrations/appwrite/client";
import { Models } from "appwrite";

interface AppwriteAuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  profile: any | null;
  isAdmin: boolean;
}

const AppwriteAuthContext = createContext<AppwriteAuthContextType>({
  user: null,
  isLoading: true,
  profile: null,
  isAdmin: false,
});

export function AppwriteAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkSession = async () => {
      try {
        const currentUser = await appwriteAccount.get();
        setUser(currentUser);
        await fetchProfile(currentUser.$id);
      } catch (error) {
        // Not logged in
        setUser(null);
        setProfile(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to authentication changes
    const unsubscribe = appwriteClient.subscribe('account', (response) => {
      if (response.events.includes('users.*.sessions.*.create')) {
        checkSession();
      } else if (response.events.includes('users.*.sessions.*.delete')) {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    // This function would need to be implemented to fetch user profile data
    // from your Appwrite database once you've migrated the data
    try {
      // Placeholder for profile fetch
      // const profile = await appwriteDatabases.getDocument(
      //   DATABASE_ID,
      //   COLLECTIONS.PROFILES,
      //   userId
      // );
      // setProfile(profile);

      // For now, we'll use a placeholder
      setProfile({
        id: userId,
        role: 'user',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  return (
    <AppwriteAuthContext.Provider value={{ 
      user, 
      isLoading, 
      profile,
      isAdmin: profile?.role === 'admin'
    }}>
      {children}
    </AppwriteAuthContext.Provider>
  );
}

export const useAppwriteAuth = () => useContext(AppwriteAuthContext);
