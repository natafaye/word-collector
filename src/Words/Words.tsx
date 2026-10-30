import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FilterSettings, Word } from "../shared/types";
import { EMOTION_COLORS, EMOTIONS, TYPE_ICONS } from "../shared/constants";

type Props = {
  words: Word[]
  filters: FilterSettings
  setSelectedWord: (word: string) => void
}

export default function Words({ words, filters, setSelectedWord }: Props) {
  const filteredWords = words.filter(word =>
    (filters.emotion === "All" || word.emotion === filters.emotion) &&
    (filters.type === "All" || word.type === filters.type)
  ).toSorted((a, b) => EMOTIONS.indexOf(a.emotion) - EMOTIONS.indexOf(b.emotion))

  return (
    <div className="flex flex-wrap gap-2 pt-3">
      {filteredWords.map(word => (
        <button
          key={word.id}
          style={{ backgroundColor: EMOTION_COLORS[word.emotion] }}
          className="text-white font-semibold rounded-lg p-3 py-2"
          onClick={() => setSelectedWord(word.id)}
        >
          <FontAwesomeIcon icon={TYPE_ICONS[word.type]} size="xs" />&nbsp;
          {word.word}
        </button>
      ))}
    </div>
  )
}


//   const handleUpdate = async () => {
//     const userRef = doc(db, "users", id);
//     await updateDoc(userRef, { name });
//     fetchUsers();
//   };

//   const handleDelete = async (id) => {
//     await deleteDoc(doc(db, "users", id));
//     fetchUsers();
//   };
