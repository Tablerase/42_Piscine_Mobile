import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { ThemedLoader } from "@/components/ThemedLoader";
import { View } from "react-native";

export default function Index() {
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
        <ThemedLoader />
      </View>
    </ThemedImageBackground>
  );
}
