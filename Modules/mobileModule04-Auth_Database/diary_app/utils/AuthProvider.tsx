import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useRouter } from "expo-router";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  User,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./firebaseConfig";
import {
  clearStoredAuthCredentials,
  getStoredAuthCredentials,
  storeAuthCredentials,
} from "./storeManager";

// ! Token manualy handle here because of firebase / metro / react native compatibility issues
// ! not resolved by expo/rn/firebase at time of commit

export enum Provider {
  google = "Google",
  github = "Github",
}

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
  const [initialAuthCheck, setInitialAuthCheck] = useState<boolean>(false);
  const router = useRouter();

  // Attempt auto-sign in with stored credentials
  const attemptAutoSignIn = async () => {
    try {
      setIsLoading(true);
      const { refreshToken, provider: storedProvider } =
        await getStoredAuthCredentials();

      if (refreshToken && storedProvider) {
        console.log(
          "Found stored credentials, attempting auto sign-in with provider:",
          storedProvider
        );
        setProvider(storedProvider); // Set provider state early

        if (storedProvider === Provider.google) {
          const webClientId =
            process.env.EXPO_PUBLIC_GOOGLE_FIREBASE_WEB_CLIENT_ID;
          if (!webClientId) {
            console.error("Google Web Client ID is not configured.");
            setIsLoading(false);
            return;
          }
          GoogleSignin.configure({ webClientId });

          try {
            console.log("Attempting Google silent sign-in...");
            await GoogleSignin.hasPlayServices({
              showPlayServicesUpdateDialog: true,
            });
            const userInfo = await GoogleSignin.signInSilently();
            const idToken = userInfo.data?.idToken;

            if (idToken) {
              console.log("Google silent sign-in successful, got ID token.");
              const googleCredential = GoogleAuthProvider.credential(idToken);
              await signInWithCredential(auth, googleCredential);
              // onAuthStateChanged will handle setting user, isLoggedIn, and setIsLoading(false)
              console.log(
                "Firebase sign-in with Google credential successful (via silent)."
              );
            } else {
              console.log("Google silent sign-in did not return an ID token.");
              // Potentially clear stored credentials if silent sign-in fails consistently
              // await clearStoredAuthCredentials();
              setIsLoading(false);
            }
          } catch (error: any) {
            console.error("Google silent sign-in failed:", error.message);
            // If error code is SIGN_IN_REQUIRED, it's expected if user needs to sign in manually.
            // Maybe clear stored credentials if they are clearly invalid.
            // await clearStoredAuthCredentials();
            setIsLoading(false);
          }
        } else if (storedProvider === Provider.github) {
          console.log(
            "GitHub provider stored. Relying on Firebase SDK for session restoration."
          );
          try {
            const cred = GithubAuthProvider.credential(refreshToken);
            console.log("Github auto sign cred:", cred);

            const res = await signInWithCredential(auth, cred);
            await storeAuthCredentials(refreshToken, Provider.github);
            console.log("Github auto sign in successful:", res);

            setIsLoading(false);
          } catch (error: any) {
            console.error("Github auto sign error: ", error);
          }
        } else {
          console.log("Stored provider is not Google or GitHub.");
          setIsLoading(false);
        }
      } else {
        console.log("No stored credentials found for auto sign-in.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Auto sign-in attempt failed:", error);
      // Clear potentially invalid credentials
      await clearStoredAuthCredentials();
      setIsLoading(false);
    }
  };

  // Check for stored credentials on app launch
  useEffect(() => {
    if (!initialAuthCheck) {
      attemptAutoSignIn();
      setInitialAuthCheck(true);
    }
  }, [initialAuthCheck]);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      console.log(
        "User state changed (onAuthStateChanged):",
        user ? user : null
      );
      if (user) {
        // Login
        setIsLoggedIn(true);

        let determinedProvider: Provider | null = null;
        if (user.providerData && user.providerData.length > 0) {
          const firebaseProviderId = user.providerData[0]?.providerId;
          if (firebaseProviderId === "google.com") {
            determinedProvider = Provider.google;
          } else if (firebaseProviderId === "github.com") {
            determinedProvider = Provider.github;
          }
        }

        if (determinedProvider && provider !== determinedProvider) {
          setProvider(determinedProvider);
        }
        const providerToStore = determinedProvider || provider;

        // Store refresh token when user successfully signs in
        if (user.refreshToken && providerToStore) {
          if (providerToStore === Provider.google)
            await storeAuthCredentials(user.refreshToken, providerToStore);
          else if (providerToStore === Provider.github) {
            console.log("github credentials already saved");
          }
        }

        // Only navigate if we're not already on the home page
        if (router.canGoBack() || window.location?.pathname !== "/profile") {
          if (typeof window !== "undefined" && window.location?.pathname) {
            if (window.location.pathname !== "/profile") {
              router.replace("/profile");
            }
          } else if (router.canGoBack()) {
            // Fallback for native if path check is not robust
            router.replace("/profile");
          }
        }
      } else {
        // Logout

        setIsLoggedIn(false);
        // Clear stored credentials when user signs out or session expires
        await clearStoredAuthCredentials();

        if (typeof window !== "undefined" && window.location?.pathname) {
          if (window.location.pathname !== "/login") {
            router.replace("/login");
          }
        }
      }

      // Set loading to false after initial auth check logic has run
      // and onAuthStateChanged has provided the current user state.
      if (initialAuthCheck) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router, provider, initialAuthCheck]);

  const login = async (token: string) => {
    console.log("Login method called - but auth is handled in oauth component");
  };

  const logout = async () => {
    try {
      await signOut(auth);
      if (provider === Provider.google) {
        GoogleSignin.signOut();
      }

      // Clear stored credentials on logout
      await clearStoredAuthCredentials();

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
