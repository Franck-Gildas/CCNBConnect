import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import { IContextType, IUser } from "@/types";
import { getCurrentUser, signOutAccount } from "@/lib/appwrite/api";

export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State variable for user's authentification status
  const [authStatus, setAuthStatus] = useState(false);

  const signOut = async () => {
    const result = await signOutAccount();

    if (result) {
      setIsAuthenticated(false);
      setAuthStatus(false);
    }
  };

  const checkAuthUser = async () => {
    setIsLoading(true);

    try {
      const currentAccount = await getCurrentUser();

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });

        setIsAuthenticated(true);
        setAuthStatus(true); // Update the authStatus variable when the user logs in

        return true;
      }

      return false;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    //cookieFallback === null || cookieFallback === undefined;
    const cookieFallback = localStorage.getItem("cookieFallback");
    if (cookieFallback === "[]" || cookieFallback === null) {
      navigate("/sign-in");
    }

    checkAuthUser();
  }, [authStatus]); // Added auth status as a dependency to the useEffect hook

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    signOut, // Adding signOut to the context value
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
