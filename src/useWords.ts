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
        return { ...data, id: wordDoc.id, word: data.word ?? wordDoc.id } as Word
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

  async function importWords(importedWords: Array<{ word: string, type: string, emotion: string }>) {
    const batch = writeBatch(db)
    const collectionRef = collection(db, "words")
    const latestByWord = new Map<string, { word: string, type: string, emotion: string }>()

    importedWords.forEach((importedWord) => {
      const normalizedWord = importedWord.word.trim().toLowerCase()
      if (normalizedWord) {
        latestByWord.set(normalizedWord, {
          word: importedWord.word.trim().toLowerCase(),
          type: importedWord.type.trim(),
          emotion: importedWord.emotion.trim(),
        })
      }
    })

    const existingByWord = new Map(
      words.map((word) => [word.word, word])
    )

    latestByWord.forEach((importedWord, normalizedWord) => {
      const existingWord = existingByWord.get(normalizedWord)
      if (existingWord) {
        if (existingWord.word !== importedWord.word || existingWord.type !== importedWord.type || existingWord.emotion !== importedWord.emotion) {
          batch.update(doc(collectionRef, existingWord.id), {
            word: importedWord.word,
            type: importedWord.type,
            emotion: importedWord.emotion,
          })
        }
      } else {
        batch.set(doc(collectionRef), {
          word: importedWord.word,
          type: importedWord.type,
          emotion: importedWord.emotion,
        })
      }
    })

    await batch.commit()
    await fetchWords()
  }

  return { words, addWords, updateWord, deleteWord, importWords }
};
