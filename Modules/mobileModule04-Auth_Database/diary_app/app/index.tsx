import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { GithubAuth } from "@/utils/GithubAuth";

export default function Index() {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText type="title">Login page</ThemedText>
      <GithubAuth />
    </ThemedView>
  );
}
