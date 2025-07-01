import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { db, DiaryNote } from "@/utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButtonIcon } from "./ThemedButtonIcon";
import { ThemedText } from "./ThemedText";

interface NoteDetailsProps {
  note: DiaryNote;
  onClose: () => void; // Function to close the form/modal
  refreshNotes: () => void; // Fetched the notes
}

export const NoteDetails = ({ note, onClose }: NoteDetailsProps) => {
  const { user } = useAuthProvider();
  const [isLoading, setIsLoading] = useState(false);

  const textColor = useThemeColor({}, "text");
  const deleteColor = useThemeColor({}, "error");
  const iconColor = useThemeColor({}, "icon"); // Or another subtle color

  const handleDeleteNote = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to delete a note.");
      return;
    }

    setIsLoading(true);
    try {
      const docRef = doc(db, "users", user.uid, "diaryNotes", note.id);
      await deleteDoc(docRef);

      onClose(); // Close the form after delete
    } catch (error) {
      console.error("Error Deleting note: ", error);
      Alert.alert("Error", "Could not delete the note. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close-circle" size={30} color={deleteColor} />
      </TouchableOpacity>
      <View style={styles.header}>
        {/* Icon on the left */}
        <View style={styles.labelContainer}>
          <View style={styles.iconContainer}>
            <Text style={[styles.noteIcon, { color: textColor }]}>
              {note.icon || "📝"}
            </Text>
          </View>
          <ThemedText type="title" style={{ flexShrink: 1 }}>
            {note.title}
          </ThemedText>
        </View>
        <ThemedText type="caption" style={{ textAlign: "center" }}>
          {new Date(note.date.seconds * 1000).toLocaleDateString()}
        </ThemedText>
      </View>

      {note.text.length > 500 ? (
        <ScrollView>
          <ThemedText>{note.text}</ThemedText>
        </ScrollView>
      ) : (
        <View>
          <ThemedText>{note.text}</ThemedText>
        </View>
      )}
      <ThemedButtonIcon
        icon={<Ionicons name="trash" size={30} color={iconColor} />}
        title={isLoading ? "Deleting..." : "Delete Note"}
        onPress={handleDeleteNote}
        disabled={isLoading}
        style={[styles.deleteButton, { backgroundColor: deleteColor }]}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 10,
    margin: 20,
    gap: 5,
    minWidth: "90%",
  },
  header: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: "90%",
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
    marginTop: 20,
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 5,
  },
});
