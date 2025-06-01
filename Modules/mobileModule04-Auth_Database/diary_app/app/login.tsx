import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { GithubAuth } from "@/utils/GithubAuth";
import { GoogleAuth } from "@/utils/GoogleAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator } from "react-native";

export default function Login() {
  const { isLoggedIn, isLoading } = useAuthProvider();
  const router = useRouter();
  const tintColor = useThemeColor({}, "tint");

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Login: User already logged");
      router.replace("/");
    }
  }, [isLoggedIn, router]);

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      {isLoading ? (
        <ActivityIndicator size={100} color={tintColor} />
      ) : (
        <>
          <ThemedText
            type="title"
            style={{ marginBottom: theme.spacing.xlarge }}
          >
            Login page
          </ThemedText>
          <GithubAuth />
          <GoogleAuth />
        </>
      )}
    </ThemedView>
  );
}
