import { ModalProvider } from "@/contexts/ModalContext";
import { AuthProvider } from "@/utils/AuthProvider";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <>
      <SafeAreaProvider>
        <AuthProvider>
          <ModalProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ animation: "none" }} />
              <Stack.Screen
                name="(protected)"
                options={{ animation: "none" }}
              />
              <Stack.Screen name="login" options={{ animation: "none" }} />
            </Stack>
          </ModalProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </>
  );
}
