import { useRouter } from "expo-router";
import { onAuthStateChanged, User } from "firebase/auth";
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

      if (user) {
        setIsLoggedIn(true);
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  });

  const login = async (token: string) => {
    // select action according to provider
    if (provider === Provider.github) {
      console.log("logging as github user");
    }
    console.log("Loggin in");
  };

  const logout = async () => {
    // Placeholder for logout logic
    console.log("Logging out");
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
