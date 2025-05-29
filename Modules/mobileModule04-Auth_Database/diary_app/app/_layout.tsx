import { AuthProvider } from "@/utils/AuthProvider";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <>
      <AuthProvider>
        <Stack />
      </AuthProvider>
    </>
  );
}
