import { DiaryList } from "@/components/DiaryList";
import { ThemedImageBackground } from "@/components/ThemedImageBackground";
import { useDiaryNotes } from "@/contexts/DiaryNotesContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { useState, useMemo, useEffect } from "react";
import { EMOTION_LEVELS } from "@/components/EmotionSelector";

export default function Agenda() {
  const { allNotes } = useDiaryNotes();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [dataIsLoading, setDataIsLoading] = useState<boolean>(true);

  // Theme colors
  const backgroundColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primary");
  const secondaryColor = useThemeColor({}, "secondary");
  const textDisabledColor = useThemeColor({}, "textDisabled");

  // Handle loading state
  useEffect(() => {
    if (allNotes !== undefined) {
      setDataIsLoading(false);
    }
  }, [allNotes]);

  // Generate marked dates based on notes
  const markedDates = useMemo(() => {
    const marked: any = {};
    console.log("Marked dates building...");

    if (allNotes) {
      allNotes.forEach((note) => {
        try {
          // Ensure consistent date formatting
          if (!note.date || !note.date.seconds) return;
          const noteDate = new Date(note.date.seconds * 1000);
          if (isNaN(noteDate.getTime())) return; // Skip invalid dates

          const dateKey = noteDate.toISOString().split("T")[0];

          const emotion = EMOTION_LEVELS.find(
            (e) => e.level === note.emotionLevel
          );
          const emotionColor = emotion?.color || primaryColor;

          if (marked[dateKey]) {
            marked[dateKey].dots.push({ color: emotionColor });
          } else {
            marked[dateKey] = {
              dots: [{ color: emotionColor }],
              marked: true,
            };
          }
        } catch (error) {
          console.warn("Invalid date in note:", note.date, error);
        }
      });
    }

    // Add selection marking
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: primaryColor,
        selectedTextColor: "#ffffff",
      };
    }

    return marked;
  }, [allNotes, primaryColor, selectedDate]);

  // Filter notes for selected date
  const filteredNotes = useMemo(() => {
    if (!selectedDate || !allNotes) return allNotes || [];

    return allNotes.filter((note) => {
      try {
        if (!note.date || !note.date.seconds) return false;
        const noteDate = new Date(note.date.seconds * 1000);
        if (isNaN(noteDate.getTime())) return false; // Skip invalid dates

        const dateKey = noteDate.toISOString().split("T")[0];
        return dateKey === selectedDate;
      } catch (error) {
        console.warn("Invalid date in note filter:", note.date, error);
        return false;
      }
    });
  }, [allNotes, selectedDate]);

  return (
    <ThemedImageBackground
      source={require("../../assets/images/greenery_no_background.png")}
      placeholder={"SsMkRro3~Xj[-;j[D%Rj"}
    >
      <SafeAreaView style={styles.safeView} edges={["top", "left", "right"]}>
        <View style={styles.container}>
          <Calendar
            style={{
              borderWidth: 1,
              borderColor: backgroundColor,
              height: 350,
            }}
            theme={{
              backgroundColor: backgroundColor,
              calendarBackground: backgroundColor,
              textSectionTitleColor: textDisabledColor,
              textSectionTitleDisabledColor: textDisabledColor,
              selectedDayBackgroundColor: primaryColor,
              selectedDayTextColor: "#ffffff",
              todayTextColor: primaryColor,
              dayTextColor: textColor,
              textDisabledColor: textDisabledColor,
              textDayFontFamily: "PatrickHand",
              textMonthFontFamily: "GloriaHallelujah",
              textDayHeaderFontFamily: "PatrickHand",
              textDayFontSize: 16,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 13,
              arrowColor: primaryColor,
              disabledArrowColor: textDisabledColor,
              monthTextColor: primaryColor,
              indicatorColor: primaryColor,
            }}
            markingType={"multi-dot"}
            markedDates={markedDates}
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
            }}
            displayLoadingIndicator={dataIsLoading}
            enableSwipeMonths={true}
          />
          <DiaryList notes={filteredNotes} showAddButton={false} />
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
