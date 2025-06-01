import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Provider, useAuthProvider } from "@/utils/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";

const exchangeCodeForToken = async (code: string) => {
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.EXPO_PUBLIC_GITHUB_CLIENT_FIREBASE_ID,
          client_secret: process.env.EXPO_PUBLIC_GITHUB_CLIENT_FIREBASE_SECRET,
          code: code,
        }),
      }
    );

    const data = await response.json();
    console.log("Token exchange response:", data);

    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error(
        `Token exchange failed: ${data.error_description || data.error}`
      );
    }
  } catch (error) {
    console.error("Token exchange error:", error);
    throw error;
  }
};

const exchangeGoogleCodeForToken = async (code: string) => {
  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
        client_secret: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET!,
        code: code,
        grant_type: "authorization_code",
        redirect_uri: "diaryapp://oauth",
      }).toString(),
    });

    const data = await response.json();
    console.log("Google token exchange response:", data);

    if (data.access_token) {
      return data.access_token;
    } else {
      throw new Error(
        `Google token exchange failed: ${data.error_description || data.error}`
      );
    }
  } catch (error) {
    console.error("Google token exchange error:", error);
    throw error;
  }
};

export default function OAuthCallback() {
  const { provider: contextProvider, setError } = useAuthProvider();
  const processingRef = useRef(false);
  const params = useLocalSearchParams();
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    const handleOAuth = async () => {
      if (processingRef.current) return;
      processingRef.current = true;

      console.log("OAuth callback received:", params);

      // Get provider from URL params or context
      const currentProvider = params.provider || contextProvider;

      // Handle the OAuth response here
      if (params.code) {
        console.log("Authorization code received:", params.code);

        if (
          currentProvider === Provider.github ||
          currentProvider === "github"
        ) {
          try {
            // Exchange code for access token
            const accessToken = await exchangeCodeForToken(
              params.code.toString()
            );
            console.log("Access token received:", accessToken);

            // Create credential with access token
            const cred = GithubAuthProvider.credential(accessToken);
            console.log("Github cred:", cred);

            const auth = getAuth();
            const res = await signInWithCredential(auth, cred);
            console.log("Sign in successful:", res);
            // Don't manually navigate - let AuthProvider handle it
          } catch (error: any) {
            console.log("Github error: ", error);
            setError(`Github login error: ${error.message}`);
            router.replace("/login");
          }
        } else if (
          currentProvider === Provider.google ||
          currentProvider === "google"
        ) {
          try {
            // Exchange code for access token
            const accessToken = await exchangeGoogleCodeForToken(
              params.code.toString()
            );
            console.log("Google access token received:", accessToken);

            // Create credential with access token
            const cred = GoogleAuthProvider.credential(null, accessToken);
            console.log("Google cred:", cred);

            const auth = getAuth();
            const res = await signInWithCredential(auth, cred);
            console.log("Google sign in successful:", res);
            // Don't manually navigate - let AuthProvider handle it
          } catch (error: any) {
            console.log("Google error: ", error);
            setError(`Google login error: ${error.message}`);
            router.replace("/login");
          }
        }
      } else if (params.error) {
        setError(`Oauth error: ${params.error}`);
        router.replace("/login");
      }
    };

    // Only run if we have params and haven't processed them yet
    if (params.code || params.error) {
      handleOAuth();
    }
  }, [params.code, params.error, params.provider, contextProvider, setError]);

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 50,
      }}
    >
      <ThemedText>Processing OAuth callback...</ThemedText>
      <ActivityIndicator size={100} color={tintColor} />
    </ThemedView>
  );
}
