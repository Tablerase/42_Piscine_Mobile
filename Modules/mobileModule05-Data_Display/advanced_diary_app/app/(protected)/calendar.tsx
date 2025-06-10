import { DiaryList } from "@/components/DiaryList";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { useDiaryNotes } from "@/contexts/DiaryNotesContext";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Calendar() {
  const { allNotes } = useDiaryNotes();

  return (
    <ThemedImageBackground
      source={require("../../assets/images/greenery_no_background.png")}
      placeholder={"SsMkRro3~Xj[-;j[D%Rj"}
    >
      <SafeAreaView style={styles.safeView} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          {/* TODO: Add calendar selector */}
          <DiaryList notes={allNotes ? allNotes : []} />
        </View>
      </SafeAreaView>
    </ThemedImageBackground>
  );
}

const styles = StyleSheet.create({
  safeView: {
    flex: 1,
  },
  container: {
    flex: 1,
    rowGap: 10,
  },
});
