import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";

export enum Provider {
  google = "Google",
  github = "Github",
}

// export interface User {
//   id: string;
//   email: string;
//   name: string;
//   avatar?: string;
// }

export interface AuthState {
  // Provider used
  provider: Provider.github | Provider.google | null;
  setProvider: (provider: Provider) => void;

  // Log status
  isLoggedIn: boolean;
  setIsLoggedIn: (logged: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loaded: boolean) => void;

  // User
  user: User | null;
  setUser: (user: User) => void;

  // Auth methods
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;

  // Error
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);

      console.log("User state changed", user);
      if (user) {
        setIsLoggedIn(true);
        // Only navigate if we're not already on the home page
        if (router.canGoBack() || window.location?.pathname !== "/") {
          router.replace("/");
        }
      } else {
        setIsLoggedIn(false);
        // Only navigate to login if we're not already there
        if (window.location?.pathname !== "/login") {
          router.replace("/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router]); // Add router as dependency

  const login = async (token: string) => {
    console.log("Login method called - but auth is handled in oauth component");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (provider === Provider.google) {
        GoogleSignin.signOut();
      }
      setProvider(null);
      setIsLoggedIn(false);
      console.log("User logged out");
    } catch (error: any) {
      console.error("Logout error:", error);
      setError(`Logout error: ${error.message}`);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext
      value={{
        provider,
        setProvider,
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        user,
        setUser,
        login,
        logout,
        error,
        setError,
        clearError,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuthProvider = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    throw new Error("useAuthProvider must be used withn AuthProvider");
  }
  return auth;
};
