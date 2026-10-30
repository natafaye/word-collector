import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { FilterSettings, Word } from "../shared/types";
import { EMOTION_COLORS, EMOTIONS, TYPE_ICONS, TYPES } from "../shared/constants";
import { normalizeWord } from "../shared/utilities";

type Props = {
  words: Word[]
  filters: FilterSettings
  setSelectedWord: (word: string) => void
}

export default function Words({ words, filters, setSelectedWord }: Props) {
  const filteredWords = words.filter(word =>
    (filters.emotion === "All" || filters.emotion === "Group" || word.emotion === filters.emotion) &&
    (filters.type === "All" || filters.type === "Group" || word.type === filters.type) &&
    (filters.query === "" || word.word.includes(normalizeWord(filters.query)))
  ).toSorted((a, b) => EMOTIONS.indexOf(a.emotion) - EMOTIONS.indexOf(b.emotion))

  const groupBy: keyof Word = filters.emotion === "Group" ? "emotion" : filters.type === "Group" ? "type" : "word"
  const groupNames = groupBy === "emotion" ? EMOTIONS : groupBy === "type" ? TYPES : [""]
  const groupedWords = groupNames.map(name => ({ 
    name, 
    words: filteredWords.filter(word => name === "" || word[groupBy] === name)
  })).filter(group => group.words.length)

  return (
    <div>
      {groupedWords.map(group => (
        <div className="not-last:border-b border-neutral-200 mb-5 pb-5">
          <div className="flex items-center mb-2 -mt-1">
            {group.name !== "" && <h3 className="text-xl text-neutral-600 mb-1.5">{group.name}</h3>}
            <div className="ms-auto text-xs text-neutral-400">{group.words.length} WORDS</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {group.words.map(word => (
              <button
                key={word.id}
                style={{ borderColor: EMOTION_COLORS[word.emotion] }}
                className="font-semibold bg-neutral-200 border-t-8 rounded-lg shadow shadow-neutral-400 p-3 pt-1 py-2"
                onClick={() => setSelectedWord(word.id)}
              >
                <FontAwesomeIcon icon={TYPE_ICONS[word.type]} size="xs" />&nbsp;
                {word.word}
              </button>
            ))}
          </div>
        </div>
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
