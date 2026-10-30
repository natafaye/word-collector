import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { Word } from "../shared/types"
import { EMOTION_COLORS, EMOTIONS, TYPE_ICONS, TYPES } from "../shared/constants"
import { faCheck, faPencil, faTrash, faX } from "@fortawesome/free-solid-svg-icons"
import { capitalizeFirst, normalizeWord } from "../shared/utilities"

type Props = {
    word: Word
    setSelectedWord: (word: string | null) => void
    updateWord: (wordId: string, field: keyof Word, value: string) => Promise<void>
    deleteWord: (wordId: string) => Promise<void>
}

export default function SelectedWord({ word, setSelectedWord, updateWord, deleteWord }: Props) {
    const [isEditing, setIsEditing] = useState(false)
    const [wordValue, setWordValue] = useState(capitalizeFirst(word.word))
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isEditing) inputRef.current?.focus()
    }, [isEditing])

    useEffect(() => {
        setIsEditing(false)
    }, [word.word])

    const saveWord = async () => {
        const normalizedWord = normalizeWord(wordValue)
        if (!normalizedWord) return
        if (normalizedWord === word.word) {
            setIsEditing(false)
            return
        }
        updateWord(word.id, "word", normalizedWord)
        setIsEditing(false)
    }

    return (
        <div className="bg-neutral-200 p-4">
            <div className="flex justify-between mb-3">
                {isEditing ? (
                    <div className="flex items-center gap-1">
                        <input
                            ref={inputRef}
                            className="font-bold text-xl bg-white border border-neutral-400 rounded px-2 py-1 outline-none"
                            value={wordValue}
                            aria-label="Word"
                            onChange={(event) => setWordValue(event.target.value)}
                            onKeyDown={(event) => {
                                if (event.key === "Enter") void saveWord()
                                if (event.key === "Escape") {
                                    setIsEditing(false)
                                }
                            }}
                        />
                        <button
                            type="button"
                            className="text-neutral-500 p-1.5"
                            aria-label="Save"
                            onClick={() => saveWord()}
                        >
                            <FontAwesomeIcon icon={faCheck} size="lg" />
                        </button>
                    </div>
                ) : (
                    <h4 className="font-bold text-xl">
                        {capitalizeFirst(word.word)}
                        <button
                            type="button"
                            className="text-neutral-500 p-2"
                            aria-label="Edit"
                            onClick={() => {
                                setWordValue(capitalizeFirst(word.word))
                                setIsEditing(true)
                            }}
                        >
                            <FontAwesomeIcon icon={faPencil} size="xs" />
                        </button>
                    </h4>
                )}
                <button className="text-neutral-600" aria-label="close" onClick={() => setSelectedWord(null)}><FontAwesomeIcon icon={faX} /></button>
            </div>
            <div className="flex gap-2">
                <div className="rounded-lg p-2.5 text-white" style={{ backgroundColor: EMOTION_COLORS[word.emotion] }}>
                    <select
                        aria-label="Emotion"
                        className="cursor-pointer border-0 outline-none"

                        value={word.emotion}
                        onChange={(event) => updateWord(word.id, "emotion", event.target.value)}
                    >
                        {EMOTIONS.map((emotion) => (
                            <option key={emotion} value={emotion} className="bg-white text-neutral-900">{emotion}</option>
                        ))}
                    </select>
                </div>
                <div className="bg-neutral-500 text-white rounded-lg p-2.5 flex items-center gap-1.5">
                    <FontAwesomeIcon icon={TYPE_ICONS[word.type]} />
                    <select
                        aria-label="Type"
                        className="cursor-pointer border-0 outline-none -ms-1"
                        value={word.type}
                        onChange={(event) => updateWord(word.id, "type", event.target.value)}
                    >
                        {TYPES.map((type) => (
                            <option key={type} value={type} className="bg-white text-neutral-900">{type}</option>
                        ))}
                    </select>
                </div>
                <button
                    className="ms-auto text-neutral-600 hover:text-red-700"
                    aria-label="Delete word"
                    onClick={() => {
                        void deleteWord(word.id)
                        setSelectedWord(null)
                    }}
                ><FontAwesomeIcon icon={faTrash} /></button>
            </div>
        </div>
    )
}