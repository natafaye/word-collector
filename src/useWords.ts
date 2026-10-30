import { useEffect, useState } from "react";
import type { Word } from "./shared/types";
import { collection, deleteDoc, doc, getDocs, updateDoc, writeBatch } from "firebase/firestore";
import { db } from "./shared/firebase";

export const useWords = () => {
  const [words, setWords] = useState<Word[]>([]);

  const fetchWords = async () => {
    const querySnapshot = await getDocs(collection(db, "words"));
    setWords(
      querySnapshot.docs.map((wordDoc) => {
        const data = wordDoc.data()
        return { id: wordDoc.id, ...data } as Word
      }),
    );
  };

  useEffect(() => {
    fetchWords();
  }, []);

  async function addWords(wordsToAdd: Word[]) {
    const batch = writeBatch(db);
    const collectionRef = collection(db, "words");
    wordsToAdd.forEach((word) => {
      const newDocRef = doc(collectionRef);
      const { id: _id, ...data } = word;
      batch.set(newDocRef, data);
    });
    await batch.commit();
    fetchWords();
  }

  async function updateWord(wordId: string, field: keyof Word, value: string) {
    setWords((current) => current.map((word) =>
      word.id === wordId ? { ...word, [field]: value } : word
    ))
    await updateDoc(doc(db, "words", wordId), { [field]: value });
    await fetchWords();
  }

  async function deleteWord(wordId: string) {
    setWords((current) => current.filter((word) => word.id !== wordId))
    await deleteDoc(doc(db, "words", wordId))
  }

  return { words, addWords, updateWord, deleteWord }
};
