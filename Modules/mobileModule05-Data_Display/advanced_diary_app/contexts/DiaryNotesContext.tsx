import { useAuthProvider } from "@/utils/AuthProvider";
import { db, DiaryNote } from "@/utils/firebaseConfig";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Unsubscribe,
} from "firebase/firestore";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// Firebase realtime update docs: https://firebase.google.com/docs/firestore/query-data/listen#web_2

interface DiaryNotesContextProps {
  allNotes: DiaryNote[] | null;
  lastNotes: DiaryNote[] | null;
  notesLoading: boolean;
  error: string | null;
}

export const DiaryNotesContext = createContext<
  DiaryNotesContextProps | undefined
>(undefined);

export const DiaryNotesProvider = ({ children }: { children: ReactNode }) => {
  const [notesLoading, setNotesLoading] = useState<boolean>(false);
  const [allNotes, setAllNotes] = useState<DiaryNote[] | null>(null);
  const [lastNotes, setLastNotes] = useState<DiaryNote[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthProvider();
  const unsubscribeRef = useRef<Unsubscribe | null>(null);

  // Set up real-time listener for notes with firebase snapshot listeners
  useEffect(() => {
    // Clean up previous listener
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    if (!user) {
      setAllNotes([]);
      setError(null);
      setNotesLoading(false);
      return;
    }

    setNotesLoading(true);
    setError(null);

    try {
      console.log("Setting up real-time notes listener...");
      const notesCollectionRef = collection(
        db,
        "users",
        user.uid,
        "diaryNotes"
      );
      const q = query(notesCollectionRef, orderBy("date", "desc"));

      // Set up real-time listener
      unsubscribeRef.current = onSnapshot(
        q,
        (querySnapshot) => {
          const fetchedNotes: DiaryNote[] = [];

          querySnapshot.forEach((doc) => {
            fetchedNotes.push({ id: doc.id, ...doc.data() } as DiaryNote);
          });

          setAllNotes(fetchedNotes);
          setNotesLoading(false);
          setError(null);
          console.log(`Updated notes: ${fetchedNotes.length} notes loaded`);
        },
        (err) => {
          console.error("Error listening to notes: ", err);
          setError("Failed to load notes. Please try again.");
          setNotesLoading(false);
        }
      );
    } catch (err) {
      console.error("Error setting up notes listener: ", err);
      setError("Failed to connect to notes. Please try again.");
      setNotesLoading(false);
    }

    // Cleanup function
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [user]);

  // Update lastNotes when allNotes changes
  useEffect(() => {
    setLastNotes(allNotes ? allNotes.slice(0, 2) : null);
  }, [allNotes]);

  return (
    <DiaryNotesContext.Provider
      value={{
        notesLoading,
        allNotes,
        lastNotes,
        error,
        // refreshNotes,
      }}
    >
      {children}
    </DiaryNotesContext.Provider>
  );
};

export const useDiaryNotes = () => {
  const context = useContext(DiaryNotesContext);
  if (context === undefined) {
    throw new Error("useDiaryNotes must be used within a DiaryNotesProvider");
  }
  return context;
};
