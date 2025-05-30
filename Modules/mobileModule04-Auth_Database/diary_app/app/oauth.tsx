import { Provider, useAuthProvider } from "@/utils/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import {
  getAuth,
  GithubAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { useEffect, useRef } from "react";
import { Text, View } from "react-native";

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

export default function OAuthCallback() {
  const { provider, setError } = useAuthProvider();
  const processingRef = useRef(false);
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleOAuth = async () => {
      if (processingRef.current) return;
      processingRef.current = true;

      console.log("OAuth callback received:", params);

      // Handle the OAuth response here
      if (params.code) {
        console.log("Authorization code received:", params.code);

        if (provider === Provider.github) {
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
  }, [params, provider, setError]); // More specific dependencies

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Processing OAuth callback...</Text>
    </View>
  );
}
