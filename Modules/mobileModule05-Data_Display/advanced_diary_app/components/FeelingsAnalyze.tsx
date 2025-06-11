import { useDiaryNotes } from "@/contexts/DiaryNotesContext";
import { ThemedText } from "./ThemedText";
import { StyleSheet, View, Text } from "react-native";
import { useEffect, useState } from "react";
import { EMOTION_LEVELS } from "./EmotionSelector";
import { useThemeColor } from "@/hooks/useThemeColor";
import { theme } from "@/constants/theme";

interface EmotionAnalysis {
  [key: number]: {
    lvl: number;
    emoji: string;
    label: string;
    count: number;
    percentage: number;
  };
}

export const FeelingsAnalyze = () => {
  const { allNotes } = useDiaryNotes();
  const [emotionAnalysis, setEmotionAnalysis] = useState<EmotionAnalysis>({});

  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "textDisabled");
  const tintColor = useThemeColor({}, "tint");

  const calculateEmotionAnalysis = () => {
    if (!allNotes || allNotes.length === 0) {
      setEmotionAnalysis({});
      return;
    }

    const analysis: EmotionAnalysis = {};
    EMOTION_LEVELS.forEach(
      (emotion) =>
        (analysis[emotion.level] = {
          lvl: emotion.level,
          emoji: emotion.emoji,
          label: emotion.label,
          count: 0,
          percentage: 0,
        })
    );

    allNotes.forEach((notes) => {
      if (notes.emotionLevel && analysis[notes.emotionLevel])
        analysis[notes.emotionLevel].count++;
    });

    Object.keys(analysis).forEach((level) => {
      const lvl = parseInt(level);
      analysis[lvl].percentage = Math.round(
        (analysis[lvl].count * 100) / allNotes.length
      );
    });

    setEmotionAnalysis(analysis);
  };

  useEffect(() => {
    calculateEmotionAnalysis();
  }, [allNotes]);

  return (
    <View style={styles.container}>
      <ThemedText
        type="title"
        style={{ textAlign: "center", color: theme.colors.neutral.light }}
      >
        Your feelings for {allNotes?.length} entries
      </ThemedText>

      {/* Display emotions in grid layout like EmotionSelector */}
      {/* TODO: Add emotion color for border here */}
      <View style={styles.emotionGrid}>
        {Object.values(emotionAnalysis).map((emotion) => (
          <View
            key={emotion.lvl}
            style={[
              styles.emotionCard,
              {
                borderColor: emotion.count > 0 ? tintColor : borderColor,
                backgroundColor: backgroundColor,
              },
            ]}
          >
            <Text style={styles.emoji}>{emotion.emoji}</Text>
            <ThemedText type="caption" style={styles.emotionLabel}>
              {emotion.label}
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.percentage}>
              {emotion.percentage}%
            </ThemedText>
            <ThemedText type="caption" style={styles.count}>
              {emotion.count} entries
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  emotionGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    marginTop: 20,
  },
  emotionCard: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    minHeight: 80,
    justifyContent: "center",
  },
  emoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  emotionLabel: {
    fontSize: 8,
    textAlign: "center",
    lineHeight: 10,
    marginBottom: 4,
  },
  percentage: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 2,
  },
  count: {
    fontSize: 6,
    textAlign: "center",
    opacity: 0.7,
  },
});
