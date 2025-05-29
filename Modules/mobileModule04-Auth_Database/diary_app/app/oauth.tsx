import { useAuthProvider } from "@/utils/AuthProvider";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function OAuthCallback() {
  const { provider, login, setError } = useAuthProvider();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("OAuth callback received:", params);

    // Handle the OAuth response here
    if (params.code) {
      console.log("Authorization code received:", params.code);
      // You can process the code here or pass it back to your auth component
      // TODO: Handle login logic with firebase and app auth provider context
      login(params.code.toString());
      router.replace("/"); // Navigate back to main screen
    } else if (params.error) {
      setError(`Oauth error: ${params.error}`);
      router.replace("/login"); // Navigate back with error
    }
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Processing OAuth callback...</Text>
    </View>
  );
}
