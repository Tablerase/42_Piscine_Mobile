import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuthProvider } from "@/utils/AuthProvider";
import { Button } from "react-native";

export default function Index() {
  const { logout } = useAuthProvider();
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText type="title">Home page</ThemedText>
      <Button title="Logout" onPress={logout} />
    </ThemedView>
  );
}
