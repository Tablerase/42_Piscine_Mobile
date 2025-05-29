import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function OAuthCallback() {
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("OAuth callback received:", params);

    // Handle the OAuth response here
    if (params.code) {
      console.log("Authorization code received:", params.code);
      // You can process the code here or pass it back to your auth component
      router.replace("/"); // Navigate back to main screen
    } else if (params.error) {
      console.error("OAuth error:", params.error);
      router.replace("/"); // Navigate back with error
    }
  }, [params]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Processing OAuth callback...</Text>
    </View>
  );
}
