import { ThemedButton } from "@/components/ThemedButton";
import { ThemedButtonIcon } from "@/components/ThemedButtonIcon";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { Ionicons } from "@expo/vector-icons";

export default function Index() {
  const iconColor = useThemeColor({}, "background");
  const { logout } = useAuthProvider();

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

      {/* Basic themed buttons */}
      <ThemedButton
        title="Primary Button"
        onPress={() => console.log("Primary pressed")}
      />

      <ThemedButton
        title="Secondary Button"
        variant="secondary"
        onPress={() => console.log("Secondary pressed")}
      />

      <ThemedButton
        title="Outline Button"
        variant="outline"
        onPress={() => console.log("Outline pressed")}
      />

      {/* Buttons with icons */}
      <ThemedButtonIcon
        title="Settings"
        icon={<Ionicons name="settings" size={20} color={iconColor} />}
        onPress={() => console.log("Settings pressed")}
      />

      <ThemedButtonIcon
        title="Profile"
        icon={<Ionicons name="person" size={20} color="#007AFF" />}
        variant="outline"
        iconPosition="right"
        onPress={() => console.log("Profile pressed")}
      />

      {/* Different sizes */}
      <ThemedButton
        title="Small Button"
        size="small"
        onPress={() => console.log("Small pressed")}
      />
      <ThemedButton
        title="Large Button"
        size="large"
        onPress={() => console.log("Large pressed")}
      />

      {/* Logout button */}
      <ThemedButtonIcon
        title="Logout"
        size="large"
        icon={<Ionicons name="log-out" size={20} color={iconColor} />}
        variant="secondary"
        onPress={() => {
          console.log("Log out pressed");
          logout();
        }}
      />
    </ThemedView>
  );
}
