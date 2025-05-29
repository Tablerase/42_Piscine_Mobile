import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthProvider } from "@/utils/AuthProvider";
import { GithubAuth } from "@/utils/GithubAuth";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Login() {
  const { isLoggedIn } = useAuthProvider();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      console.log("Login: User already logged");
      router.replace("/");
    }
  });

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText type="title">Login page</ThemedText>
      <GithubAuth />
    </ThemedView>
  );
}
