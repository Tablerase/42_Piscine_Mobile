import { ModalContainer } from "@/components/ModalContainer";
import { DiaryNotesProvider } from "@/contexts/DiaryNotesContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";

export default function RootLayout() {
  const { isLoggedIn, isLoading } = useAuthProvider();
  const tintColor = useThemeColor({}, "tint");

  if (isLoading) {
    return null;
  }
  if (!isLoggedIn) {
    return <Redirect href={"/login"} />;
  }

  return (
    <DiaryNotesProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: tintColor,
          tabBarLabelPosition: "beside-icon",
          // animation: "shift",
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons size={25} color={color} name="person" />
            ),
          }}
        />
        <Tabs.Screen
          name="agenda"
          options={{
            title: "Agenda",
            tabBarIcon: ({ color }) => (
              <Ionicons size={25} color={color} name="calendar" />
            ),
          }}
        />
      </Tabs>
      <ModalContainer />
    </DiaryNotesProvider>
  );
}
