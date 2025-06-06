import { theme } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthProvider } from "@/utils/AuthProvider";
import { db, DiaryNote } from "@/utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NewNoteForm } from "./NewNoteForm";
import { NoteDetails } from "./NoteDetails";
import { ThemedButtonIcon } from "./ThemedButtonIcon";
import { ThemedText } from "./ThemedText";

const renderNoteItem = ({
  item,
  setCurrentModal,
  setCurrentNote,
  setIsModalVisible,
}: {
  item: DiaryNote;
  setCurrentModal: (modal: "read" | "edit") => void;
  setIsModalVisible: (visible: boolean) => void;
  setCurrentNote: (note: DiaryNote) => void;
}) => {
  const borderBottomColor = theme.colors.neutral.light;
  return (
    <TouchableOpacity
      style={[styles.noteItem, { borderBottomColor: borderBottomColor }]}
      onPress={() => {
        setCurrentNote(item);
        setCurrentModal("read");
        setIsModalVisible(true);
      }}
    >
      {/* Icon on the left */}
      <View style={styles.iconContainer}>
        <Text style={styles.noteIcon}>{item.icon || "📝"}</Text>
      </View>

      {/* Content in the middle */}
      <View style={styles.contentContainer}>
        <ThemedText
          type="subtitle"
          style={[
            styles.noteTitle,
            { color: theme.colors.primary.contrastText },
          ]}
        >
          {item.title}
        </ThemedText>
        <ThemedText style={styles.noteText}>
          {item.text.substring(0, 80)}
          {item.text.length > 80 ? "..." : ""}
        </ThemedText>
      </View>

      {/* Date on the right */}
      <View style={styles.dateContainer}>
        {item.date && (
          <ThemedText type="caption" style={styles.noteDate}>
            {new Date(item.date.seconds * 1000).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </ThemedText>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const DiaryList = () => {
  const { user } = useAuthProvider();
  const iconColor = useThemeColor({}, "background");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<"read" | "edit">("read");
  const [currentNote, setCurrentNote] = useState<DiaryNote>();
  const [notes, setNotes] = useState<DiaryNote[]>([]); // State to hold fetched notes
  const [isLoading, setIsLoading] = useState(false);

  const recoverNotes = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const notesCollectionRef = collection(
        db,
        "users",
        user.uid,
        "diaryNotes"
      );
      const q = query(notesCollectionRef, orderBy("date", "desc")); // Order by creation date
      const querySnapshot = await getDocs(q);
      const fetchedNotes: DiaryNote[] = [];
      querySnapshot.forEach((doc) => {
        fetchedNotes.push({ id: doc.id, ...doc.data() } as DiaryNote);
      });
      setNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      recoverNotes();
    }
  }, [user, recoverNotes]); // Re-fetch notes if user changes or on initial load if user is present

  // Refresh notes when modal is closed (assuming a note might have been added)
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setCurrentModal("read");
  };

  return (
    <>
      {isLoading && (
        <ThemedText style={styles.loadingText}>Loading notes...</ThemedText>
      )}
      {!isLoading && notes.length === 0 && user && (
        <ThemedText style={styles.emptyText}>
          No diary entries yet. Tap the button below to create one!
        </ThemedText>
      )}
      <FlatList
        data={notes}
        renderItem={({ item }) =>
          renderNoteItem({
            item,
            setCurrentNote,
            setCurrentModal,
            setIsModalVisible,
          })
        }
        keyExtractor={(item) => item.id}
        style={styles.diaryContainer}
        contentContainerStyle={{ paddingBottom: 180 }} // Ensure space for the button
      />
      <ThemedButtonIcon
        icon={<Ionicons name="pencil" size={25} color={iconColor} />}
        title="New Diary Entry"
        onPress={() => {
          setCurrentModal("edit");
          setIsModalVisible(true);
        }}
        style={styles.newNote}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          {currentModal === "edit" ? (
            <NewNoteForm
              onClose={handleCloseModal}
              refreshNotes={recoverNotes}
            />
          ) : (
            currentNote && (
              <NoteDetails
                onClose={handleCloseModal}
                refreshNotes={recoverNotes}
                note={currentNote}
              />
            )
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  diaryContainer: {
    flex: 1,
  },
  newNote: {
    position: "absolute",
    alignSelf: "center",
    bottom: 40,
    zIndex: 2,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  noteItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    marginHorizontal: 10,
    minHeight: 80,
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
  contentContainer: {
    flex: 1,
    paddingRight: 8,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  noteText: {
    fontSize: 13,
    opacity: 0.7,
    lineHeight: 18,
  },
  dateContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    minWidth: 60,
  },
  noteDate: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: "right",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    paddingHorizontal: 20,
  },
});
