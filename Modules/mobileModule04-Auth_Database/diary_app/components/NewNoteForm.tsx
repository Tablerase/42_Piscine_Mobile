import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { HUMAN_INFO } from "@/constants/humanInfos";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { db } from "@/utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButton } from "./ThemedButton";
import { EmotionSelector } from "./EmotionSelector";

interface NewNoteFormProps {
  onClose: () => void; // Function to close the form/modal
  refreshNotes: () => void; // Fetched the notes
}

export const NewNoteForm = ({ onClose, refreshNotes }: NewNoteFormProps) => {
  const { user } = useAuthProvider();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [icon, setIcon] = useState("😐"); // Default to neutral emoji
  const [emotionLevel, setEmotionLevel] = useState(4); // Default to neutral (4th emotion)
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const placeholderTextColor = useThemeColor({}, "textDisabled"); // Or another subtle color

  // Handle emotion level change
  const handleEmotionChange = (level: number, emoji: string) => {
    setEmotionLevel(level);
    setIcon(emoji);
  };

  const handleSaveNote = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to save a note.");
      return;
    }

    // Check if user email exists
    if (!user.email || user.email.trim().length === 0) {
      Alert.alert("Error", "User email is required to save a note.");
      return;
    }

    if (!title.trim() || !text.trim()) {
      Alert.alert("Missing Info", "Please enter both a title and text.");
      return;
    }

    // Validate icon (should be a single emoji)
    if (!icon.trim()) {
      Alert.alert(
        "Missing Emotion",
        "Please select how you're feeling for your note."
      );
      return;
    }

    // Validate title length (Firestore rule requires <= 100 characters)
    if (title.trim().length > 100) {
      Alert.alert("Title Too Long", "Title must be 100 characters or less.");
      return;
    }

    setIsLoading(true);
    try {
      const notesCollectionRef = collection(
        db,
        "users",
        user.uid,
        "diaryNotes"
      );
      const doc = {
        title: title.trim(),
        text: text.trim(),
        usermail: user.email.trim(),
        date: serverTimestamp(),
        icon: icon.trim(),
        emotionLevel: emotionLevel,
      };
      await addDoc(notesCollectionRef, doc);
      // Alert.alert("Success", "Note saved successfully!");
      setTitle("");
      setText("");
      setIcon("");
      setEmotionLevel(4); // Reset to neutral

      onClose(); // Close the form after saving
      refreshNotes(); // Update the notes after saving new note
    } catch (error) {
      console.error("Error saving note: ", error);
      Alert.alert("Error", "Could not save the note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={30} color={tintColor} />
      </TouchableOpacity>
      <View style={styles.header}>
        <ThemedText type="subtitle">New Diary Note</ThemedText>
      </View>
      <TextInput
        style={[
          styles.input,
          {
            fontFamily: "GloriaHallelujah",
            backgroundColor: backgroundColor,
            color: textColor,
            borderColor: tintColor,
          },
        ]}
        placeholder="Note Title"
        value={title}
        onChangeText={setTitle}
        placeholderTextColor={placeholderTextColor}
        maxLength={100}
      />
      <EmotionSelector
        selectedLevel={emotionLevel}
        onLevelChange={handleEmotionChange}
      />
      <TextInput
        style={[
          styles.input,
          styles.contentInput,
          {
            backgroundColor: backgroundColor,
            color: textColor,
            borderColor: tintColor,
          },
        ]}
        placeholder="What's on your mind?"
        value={text}
        onChangeText={setText}
        multiline
        numberOfLines={10}
        maxLength={HUMAN_INFO.DIARY_INPUTS.PERSONAL}
        textAlignVertical="top"
        placeholderTextColor={placeholderTextColor}
      />
      <ThemedButton
        title={isLoading ? "Saving..." : "Save Note"}
        onPress={handleSaveNote}
        disabled={isLoading}
        style={styles.saveButton}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
    minWidth: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  contentInput: {
    minHeight: 150,
  },
  saveButton: {
    paddingVertical: 15,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
  },
});
