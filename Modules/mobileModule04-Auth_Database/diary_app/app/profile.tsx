import { DiaryList } from "@/components/DiaryList";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { UserCard } from "@/components/UserCard";
import { StyleSheet, View } from "react-native";

export default function Profile() {
  return (
    <>
      <ThemedImageBackground
        source={require("../assets/images/greenery_no_background.png")}
        placeholder={"SsMkRro3~Xj[-;j[D%Rj"}
      >
        <View style={styles.container}>
          <UserCard />
          <DiaryList />
        </View>
      </ThemedImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 10,
  },
});
