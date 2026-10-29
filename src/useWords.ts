import { useEffect, useState } from "react";
import type { Word } from "./shared/types";
import { collection, doc, getDocs, writeBatch } from "firebase/firestore";
import { db } from "./shared/firebase";

export const useWords = () => {
  const [words, setWords] = useState<Word[]>([]);

  const fetchWords = async () => {
    const querySnapshot = await getDocs(collection(db, "words"));
    setWords(
      querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Word),
    );
  };

  useEffect(() => {
    fetchWords();
  }, []);

  async function addWords(wordsToAdd: Word[]) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, "words");
    wordsToAdd.forEach((word) => {
      const newDocRef = doc(collectionRef, word.id);
      const { id, ...data } = word;
      batch.set(newDocRef, data);
    });
    await batch.commit();
    fetchWords();
  }

  return { words, addWords }
};
