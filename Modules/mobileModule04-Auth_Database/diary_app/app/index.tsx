import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { signInWithGithub } from "@/utils/githubAuth";
import { TouchableOpacity } from "react-native";

export default function Index() {
  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
    } catch (error) {
      console.log("Github Sign in failed:", error);
    }
  };

  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText type="title">Login page</ThemedText>
      <TouchableOpacity onPress={handleGithubSignIn}>
        <ThemedText>Github sign in</ThemedText>
      </TouchableOpacity>
    </ThemedView>
  );
}
