import { ThemedButtonIcon } from "@/components/ThemedButtonIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const { logout, user } = useAuthProvider();
  const iconColor = useThemeColor({}, "background");

  return (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
        padding: 20,
      }}
    >
      <ThemedText type="title">Home page</ThemedText>

      <ThemedText>{JSON.stringify(user).slice(0, 150)}</ThemedText>

      {/* Logout button */}
      <ThemedButtonIcon
        title="Logout"
        size="large"
        icon={<Ionicons name="log-out" size={20} color={iconColor} />}
        variant="secondary"
        onPress={logout}
      />
    </ThemedView>
  );
}
