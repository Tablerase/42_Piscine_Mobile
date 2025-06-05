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
  const router = useRouter();

  const attemptAutoSignIn = async () => {
    try {
      const { refreshToken, provider: storedProvider } =
        await getStoredAuthCredentials();

      if (refreshToken && storedProvider) {
        console.log(
          "Found stored credentials, attempting auto sign-in with provider:",
          storedProvider
        );
        setProvider(storedProvider);

        if (storedProvider === Provider.google) {
          const webClientId =
            process.env.EXPO_PUBLIC_GOOGLE_FIREBASE_WEB_CLIENT_ID;
          if (!webClientId) {
            console.error("Google Web Client ID is not configured.");
          } else {
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
                console.log(
                  "Firebase sign-in with Google credential successful (via silent)."
                );
              } else {
                console.log(
                  "Google silent sign-in did not return an ID token."
                );
              }
            } catch (error: any) {
              console.error("Google silent sign-in failed:", error.message);
            }
          }
        } else if (storedProvider === Provider.github) {
          console.log(
            "GitHub provider stored. Relying on Firebase SDK for session restoration."
          );
          // For GitHub, Firebase often handles session restoration automatically if user was previously signed in.
          // Explicitly trying to re-authenticate with a stored GitHub token might be complex
          // and often not needed if Firebase's persistence is working.
          try {
            const cred = GithubAuthProvider.credential(refreshToken); // This might not be the correct way to use a GitHub refresh token directly
            console.log("Github auto sign cred:", cred);

            const res = await signInWithCredential(auth, cred);
            // Storing refreshToken again might be redundant if Firebase handles session
            // await storeAuthCredentials(refreshToken, Provider.github);
            console.log("Github auto sign in successful:", res);
          } catch (error: any) {
            console.error("Github auto sign error: ", error);
          }
        } else {
          console.log("Stored provider is not Google or GitHub.");
        }
      } else {
        console.log("No stored credentials found for auto sign-in.");
      }
    } catch (error: any) {
      console.error("Auto sign-in attempt failed:", error);
      await clearStoredAuthCredentials(); // Clear potentially invalid credentials on error
    } finally {
      setIsLoading(false); // Crucial: set isLoading to false after the attempt
      console.log("AttemptAutoSignIn finished, isLoading set to false.");
    }
  };

  // Check for stored credentials on app launch
  useEffect(() => {
    // This effect runs once on mount to attempt auto sign-in
    attemptAutoSignIn();
  }, []); // Empty dependency array ensures it runs once

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      console.log(
        "User state changed (onAuthStateChanged):",
        firebaseUser ? firebaseUser.uid : null
      );

      // If initial loading is still in progress, defer actions
      if (isLoading) {
        console.log(
          "Auth state changed, but initial loading is in progress. Deferring actions."
        );
        return;
      }

      if (firebaseUser) {
        // Login
        setIsLoggedIn(true);

        let determinedProvider: Provider | null = null;
        if (firebaseUser.providerData && firebaseUser.providerData.length > 0) {
          const firebaseProviderId = firebaseUser.providerData[0]?.providerId;
          if (firebaseProviderId === "google.com") {
            determinedProvider = Provider.google;
          } else if (firebaseProviderId === "github.com") {
            determinedProvider = Provider.github;
          }
        }

        // Update provider state if it's determined and different
        if (determinedProvider && provider !== determinedProvider) {
          setProvider(determinedProvider);
        }
        const providerToStore = determinedProvider || provider;

        // Store refresh token when user successfully signs in
        // Ensure firebaseUser.refreshToken is available and makes sense for the provider
        if (firebaseUser.refreshToken && providerToStore) {
          if (providerToStore === Provider.google) {
            await storeAuthCredentials(
              firebaseUser.refreshToken,
              providerToStore
            );
          } else if (providerToStore === Provider.github) {
            // Maybe change here when async storage and session persistancy issues is fixed by expo/metro/firebase dev
          }
        }

        if (window.location.pathname !== "/profile") {
          console.log(
            "User is logged in (post-initial load), redirecting to /profile."
          );
          router.replace("/profile");
        }
      } else {
        // Logout or user is null after initial check
        setIsLoggedIn(false);
        // Clear stored credentials only when definitively logged out (i.e., not during initial load)
        await clearStoredAuthCredentials();
        console.log("User is null (post-initial load), credentials cleared.");

        if (typeof window !== "undefined" && window.location?.pathname) {
          if (window.location.pathname !== "/login") {
            console.log(
              "User is null (post-initial load), redirecting to /login."
            );
            router.replace("/login");
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router, provider, isLoading]);

  const login = async (token: string) => {
    console.log("Login method called - but auth is handled in oauth component");
  };

  const logout = async () => {
    try {
      await signOut(auth); // This will trigger onAuthStateChanged with null user
      if (provider === Provider.google) {
        await GoogleSignin.signOut();
      }

      // Clear stored credentials on logout
      await clearStoredAuthCredentials();

      setProvider(null);
      // setIsLoggedIn(false); // onAuthStateChanged will handle this
      console.log("User logged out successfully.");
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
