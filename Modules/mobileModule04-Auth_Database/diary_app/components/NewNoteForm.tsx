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

interface NewNoteFormProps {
  onClose: () => void; // Function to close the form/modal
  refreshNotes: () => void; // Fetched the notes
}

export const NewNoteForm = ({ onClose, refreshNotes }: NewNoteFormProps) => {
  const { user } = useAuthProvider();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [icon, setIcon] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const placeholderTextColor = useThemeColor({}, "textDisabled"); // Or another subtle color

  // Function to validate and handle emoji input
  const handleEmojiChange = (text: string) => {
    // Regular expression to match emojis
    // Regex 101: https://regex101.com/r/0anB6Z/1
    const emojiRegex =
      /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const emojis = text.match(emojiRegex);

    if (emojis && emojis.length > 0) {
      // Take only the first emoji
      setIcon(emojis[0]);
    } else if (text === "") {
      // Allow clearing the field
      setIcon("");
    }
    // Ignore non-emoji characters
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
      Alert.alert("Missing Icon", "Please select an emoji for your note.");
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
      };
      await addDoc(notesCollectionRef, doc);
      // Alert.alert("Success", "Note saved successfully!");
      setTitle("");
      setText("");
      setIcon("📝");

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
      <TextInput
        style={[
          styles.input,
          styles.emojiInput,
          {
            backgroundColor: backgroundColor,
            color: textColor,
            borderColor: tintColor,
          },
        ]}
        placeholder="📝 Choose an emoji"
        value={icon}
        onChangeText={handleEmojiChange}
        placeholderTextColor={placeholderTextColor}
        maxLength={2} // Allow for complex emojis
        textAlign="center"
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
  emojiInput: {
    fontSize: 16,
    textAlign: "center",
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
