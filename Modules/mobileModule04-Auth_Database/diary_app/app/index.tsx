import { ThemedButton } from "@/components/ThemedButton";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { ThemedLoader } from "@/components/ThemedLoader";
import { ThemedText } from "@/components/ThemedText";
import { useAuthProvider } from "@/utils/AuthProvider";
import { useRouter } from "expo-router";
import { View } from "react-native";

export default function Index() {
  const { isLoggedIn, isLoading } = useAuthProvider();
  const router = useRouter();

  let content;
  if (!isLoggedIn) {
    content = (
      <ThemedButton title="Login" onPress={() => router.replace("/login")} />
    );
  } else {
    content = (
      <>
        <ThemedButton
          title="Profile"
          size="large"
          onPress={() => router.replace("/profile")}
        />

        {/* Logout button */}
      </>
    );
  }

  return (
    <ThemedImageBackground
      source={require("../assets/images/greenery_no_background.png")}
      placeholder={"SsMkRro3~Xj[-;j[D%Rj"}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          padding: 20,
        }}
      >
        {isLoading ? (
          <ThemedLoader />
        ) : (
          <>
            <ThemedText type="title">Home page</ThemedText>
            {content}
          </>
        )}
      </View>
    </ThemedImageBackground>
  );
}
