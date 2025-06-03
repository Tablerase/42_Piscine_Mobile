import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { db, DiaryNote } from "@/utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ThemedButton } from "./ThemedButton";
import { ThemedText } from "./ThemedText";

interface NoteDetailsProps {
  note: DiaryNote;
  onClose: () => void; // Function to close the form/modal
  refreshNotes: () => void; // Fetched the notes
}

export const NoteDetails = ({
  note,
  onClose,
  refreshNotes,
}: NoteDetailsProps) => {
  const { user } = useAuthProvider();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [icon, setIcon] = useState("📝");
  const [isLoading, setIsLoading] = useState(false);

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const placeholderTextColor = useThemeColor({}, "icon"); // Or another subtle color

  const handleDeleteNote = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to delete a note.");
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

      await addDoc(notesCollectionRef, {});
      Alert.alert("Success", "Note deleted successfully!");
      setTitle("");
      setText("");
      setIcon("📝");

      onClose(); // Close the form after saving
      refreshNotes(); // Update the notes after saving new note
    } catch (error) {
      console.error("Error saving note: ", error);
      Alert.alert("Error", "Could not delete the note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Center date - Add text and deletion process
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={30} color={tintColor} />
      </TouchableOpacity>
      <View style={styles.header}>
        {/* Icon on the left */}
        <View style={styles.iconContainer}>
          <Text style={styles.noteIcon}>{note.icon || "📝"}</Text>
        </View>
        <ThemedText type="title">{note.title}</ThemedText>
      </View>
      <ThemedText type="caption">
        {new Date(note.date.seconds * 1000).toLocaleDateString()}
      </ThemedText>
      <ThemedButton
        title={isLoading ? "Deleting..." : "Delete Note"}
        onPress={handleDeleteNote}
        disabled={isLoading}
        style={styles.deleteButton}
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
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  noteIcon: {
    fontSize: 28,
  },
  text: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  contentText: {
    minHeight: 150,
  },
  deleteButton: {
    paddingVertical: 15,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
  },
});
