import { theme } from "@/constants/theme";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DiaryNote } from "@/utils/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ThemedButtonIcon } from "./ThemedButtonIcon";
import { ThemedText } from "./ThemedText";
import { useModal } from "@/contexts/ModalContext";

const renderNoteItem = ({
  item,
  openReadModal,
}: {
  item: DiaryNote;
  openReadModal: (note: DiaryNote) => void;
}) => {
  const borderBottomColor = theme.colors.neutral.light;
  return (
    <TouchableOpacity
      style={[styles.noteItem, { borderBottomColor: borderBottomColor }]}
      onPress={() => openReadModal(item)}
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
        <ThemedText
          style={styles.noteText}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.text}
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

export const DiaryList = ({
  notes,
  isLoading = false,
  showAddButton = true,
  contentContainerStyle,
}: {
  notes: DiaryNote[];
  isLoading?: boolean;
  showAddButton?: boolean;
  contentContainerStyle?: any;
}) => {
  const iconColor = useThemeColor({}, "background");
  const { openEditModal, openReadModal } = useModal();

  return (
    <>
      {isLoading && (
        <ThemedText style={styles.loadingText}>Loading notes...</ThemedText>
      )}
      {!isLoading && notes.length === 0 && (
        <ThemedText style={styles.emptyText}>
          No diary entries yet.{" "}
          {showAddButton && "Tap the button below to create one!"}
        </ThemedText>
      )}
      {notes.length > 2 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) =>
            renderNoteItem({
              item,
              openReadModal,
            })
          }
          keyExtractor={(item) => item.id}
          style={styles.diaryContainer}
          contentContainerStyle={contentContainerStyle}
        />
      ) : (
        <View style={styles.diaryContainer}>
          {notes.map((item) => (
            <View key={item.id}>{renderNoteItem({ item, openReadModal })}</View>
          ))}
        </View>
      )}
      {showAddButton && (
        <ThemedButtonIcon
          icon={<Ionicons name="pencil" size={25} color={iconColor} />}
          title="New Diary Entry"
          onPress={() => openEditModal()}
          style={styles.newNote}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  diaryContainer: {
    // flex: 1,
    // backgroundColor: "red",
  },
  newNote: {
    position: "absolute",
    alignSelf: "center",
    bottom: 40,
    zIndex: 2,
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
