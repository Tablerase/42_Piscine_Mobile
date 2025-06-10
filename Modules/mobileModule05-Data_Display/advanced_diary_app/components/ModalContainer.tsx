import React from "react";
import { Modal, View, StyleSheet } from "react-native";
import { useModal } from "@/contexts/ModalContext";
import { NewNoteForm } from "./NewNoteForm";
import { NoteDetails } from "./NoteDetails";

export const ModalContainer = () => {
  const { isModalVisible, currentModal, currentNote, closeModal } = useModal();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View style={styles.modalOverlay}>
        {currentModal === "edit" ? (
          <NewNoteForm onClose={closeModal} />
        ) : (
          currentNote && <NoteDetails onClose={closeModal} note={currentNote} />
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
