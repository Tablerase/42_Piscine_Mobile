import { DiaryNote } from "@/utils/firebaseConfig";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "read" | "edit" | null;

interface ModalContextType {
  isModalVisible: boolean;
  currentModal: ModalType;
  currentNote?: DiaryNote;
  openEditModal: () => void;
  openReadModal: (note: DiaryNote) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentModal, setCurrentModal] = useState<ModalType>(null);
  const [currentNote, setCurrentNote] = useState<DiaryNote>();

  const openEditModal = () => {
    setCurrentNote(undefined);
    setCurrentModal("edit");
    setIsModalVisible(true);
  };

  const openReadModal = (note: DiaryNote) => {
    setCurrentNote(note);
    setCurrentModal("read");
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setCurrentModal(null);
    setCurrentNote(undefined);
  };

  return (
    <ModalContext
      value={{
        isModalVisible,
        currentModal,
        currentNote,
        openEditModal,
        openReadModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext>
  );
};
