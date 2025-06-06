import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Provider, useAuthProvider } from "@/utils/AuthProvider";
import { storeAuthCredentials } from "@/utils/storeManager";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAuth,
  GithubAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { ActivityIndicator } from "react-native";

// ! Token manualy handle here because of firebase / metro / react native compatibility issues
// ! not resolved by expo/rn/firebase at time of commit

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

export default function OAuthCallback() {
  const { provider: contextProvider, setError } = useAuthProvider();
  const processingRef = useRef(false);
  const params = useLocalSearchParams();
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    const handleOAuth = async () => {
      if (processingRef.current) return;
      processingRef.current = true;

      const currentProvider = params.provider || contextProvider;

      // Handle the OAuth response here
      if (params.code) {
        if (
          currentProvider === Provider.github ||
          currentProvider === "github"
        ) {
          try {
            const accessToken = await exchangeCodeForToken(
              params.code.toString()
            );

            await storeAuthCredentials(accessToken, Provider.github);
            const cred = GithubAuthProvider.credential(accessToken);

            const auth = getAuth();
            await signInWithCredential(auth, cred);
          } catch (error: any) {
            console.log("Github error: ", error);
            setError(`Github login error: ${error.message}`);
            router.replace("/login");
          }
        }
      } else if (params.error) {
        console.log("Github error: ", params.error);
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
