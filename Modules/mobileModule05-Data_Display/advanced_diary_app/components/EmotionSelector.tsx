import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface EmotionSelectorProps {
  selectedLevel: number;
  onLevelChange: (level: number, emoji: string) => void;
}

// 7 basic emotions with corresponding emojis and colors
export const EMOTION_LEVELS = [
  { level: 1, emoji: "😢", label: "Sad", color: "#2196F3" }, // blue
  { level: 2, emoji: "😨", label: "Fear", color: "#FF5722" }, // deep orange
  { level: 3, emoji: "😠", label: "Anger", color: "#F44336" }, // red
  { level: 4, emoji: "😐", label: "Neutral", color: "#607D8B" }, // blue grey
  { level: 5, emoji: "😊", label: "Joy", color: "#4CAF50" }, // green
  { level: 6, emoji: "😮", label: "Surprise", color: "#FF9800" }, // orange
  { level: 7, emoji: "🤢", label: "Disgust", color: "#9C27B0" }, // purple
];

export const EmotionSelector = ({
  selectedLevel,
  onLevelChange,
}: EmotionSelectorProps) => {
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const borderColor = useThemeColor({}, "textDisabled");

  return (
    <View style={styles.container}>
      <ThemedText type="caption" style={styles.label}>
        How are you feeling today?
      </ThemedText>
      <View style={styles.levelContainer}>
        {EMOTION_LEVELS.map((item) => (
          <TouchableOpacity
            key={item.level}
            style={[
              styles.levelButton,
              {
                borderColor:
                  selectedLevel === item.level ? tintColor : borderColor,
                backgroundColor:
                  selectedLevel === item.level
                    ? tintColor + "20"
                    : backgroundColor,
              },
            ]}
            onPress={() => onLevelChange(item.level, item.emoji)}
          >
            <Text style={styles.emoji}>{item.emoji}</Text>
            <ThemedText type="caption" style={styles.levelLabel}>
              {item.label}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 10,
    textAlign: "center",
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
  },
  levelButton: {
    flex: 1,
    alignItems: "center",
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    minHeight: 60,
    justifyContent: "center",
  },
  emoji: {
    fontSize: 18,
    marginBottom: 2,
  },
  levelLabel: {
    fontSize: 8,
    textAlign: "center",
    lineHeight: 10,
  },
});
