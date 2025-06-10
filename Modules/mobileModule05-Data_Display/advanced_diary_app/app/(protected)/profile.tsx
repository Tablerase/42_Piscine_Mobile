import { DiaryList } from "@/components/DiaryList";
import { FeelingsAnalyze } from "@/components/FeelingsAnalyze";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { UserCard } from "@/components/UserCard";
import { useDiaryNotes } from "@/contexts/DiaryNotesContext";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { lastNotes, notesLoading } = useDiaryNotes();

  return (
    <ThemedImageBackground
      source={require("../../assets/images/greenery_no_background.png")}
      placeholder={"SsMkRro3~Xj[-;j[D%Rj"}
    >
      <SafeAreaView style={styles.safeView} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <UserCard />
          <DiaryList
            notes={lastNotes ? lastNotes : []}
            isLoading={notesLoading}
          />
          <FeelingsAnalyze />
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
