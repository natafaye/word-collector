import Modal from "../Modal/Modal";
import ModalHeader from "../Modal/ModalHeader";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Word } from "../shared/types";
import ModalBody from "../Modal/ModalBody";
import clsx from "clsx";
import TypeaheadSelect from "./TypeaheadSelect";
import { EMOTIONS, TYPES } from "../shared/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ModalFooter from "../Modal/ModalFooter";
import Button from "../Button";
import { normalizeWord } from "../shared/utilities";

type Props = {
	words: Word[]
	addWords: (wordsToAdd: Word[]) => void
}

const getBlankWord = (): Word => ({ id: "", word: "", type: "", emotion: "", partOfSpeech: "V" })

export default function AddWords({ words, addWords }: Props) {
	const [showAddModal, setShowAddModal] = useState(false);
	const [wordsToAdd, setWordsToAdd] = useState<Word[]>([getBlankWord()])

	// Handle changing the focus with row creation and removal
	const inputRefs = useRef<(HTMLInputElement | null)[]>([])
	const emotionInputRefs = useRef<(HTMLInputElement | null)[]>([])
	const typeInputRefs = useRef<(HTMLInputElement | null)[]>([])
	const partOfSpeechInputRefs = useRef<(HTMLInputElement | null)[]>([])
	type FocusField = "word" | "emotion" | "type" | "partOfSpeech"
	const [pendingFocus, setPendingFocus] = useState<{ index: number, field: FocusField } | null>(null)
	useEffect(() => {
		if (pendingFocus !== null) {
			const refs = {
				word: inputRefs,
				emotion: emotionInputRefs,
				type: typeInputRefs,
				partOfSpeech: partOfSpeechInputRefs,
			}[pendingFocus.field]
			refs.current[pendingFocus.index]?.focus()
			setPendingFocus(null)
		}
	}, [pendingFocus])

	const addRow = (index?: number) => {
		if (index === undefined) {
			setWordsToAdd([...wordsToAdd, getBlankWord()])
			setPendingFocus({ index: wordsToAdd.length, field: "word" })
		}
		else {
			const updatedWordsToAdd = [...wordsToAdd];
			updatedWordsToAdd.splice(index + 1, 0, getBlankWord())
			setWordsToAdd(updatedWordsToAdd);
			setPendingFocus({ index: index + 1, field: "word" })
		}
	}

	// const removeRow = (indexToRemove: number) => {
	// 	if (wordsToAdd.length === 1)
	// 		setWordsToAdd([getBlankWord()])
	// 	else
	// 		setWordsToAdd(wordsToAdd.filter((_, index) => index !== indexToRemove))
	// 	setPendingFocus({ index: Math.max(indexToRemove - 1, 0), field: "word" });
	// }

	const updateWord = (indexToUpdate: number, field: keyof Word, value: string) => {
		setWordsToAdd(wordsToAdd.map((word, index) =>
			index === indexToUpdate ? { ...word, [field]: value } : word
		))
	}

	// Duplicate checking
	const enteredWordNames = wordsToAdd.map((word) => normalizeWord(word.word)).filter(word => word !== "")
	const existingWordNames = new Set(words.map((word) => normalizeWord(word.word)))
	const duplicates = enteredWordNames.filter((word, index) =>
		enteredWordNames.indexOf(word) !== index || existingWordNames.has(word)
	)
	const isDuplicate = (word: Word) => word.word !== "" && duplicates.includes(normalizeWord(word.word));

	const moveFocus = (index: number, field: FocusField, direction: -1 | 1) => {
		const targetIndex = direction === -1
			? Math.max(index - 1, 0)
			: Math.min(index + 1, wordsToAdd.length - 1)
		setPendingFocus({ index: targetIndex, field })
	}

	const handleInputKeyUp = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
		const { key } = event
		if (key === "Enter")
			addRow(index);
		// else if (key === "Backspace" && !wordsToAdd[index].word.length)
		// 	removeRow(index);
		else if (key === "ArrowUp") {
			event.preventDefault()
			moveFocus(index, "word", -1)
		}
		else if (key === "ArrowDown") {
			event.preventDefault()
			moveFocus(index, "word", 1)
		}
	}

	const handleSave = () => {
		if (duplicates.length) return

		const normalizedWords = wordsToAdd
			.map((word) => ({
				...word,
				word: normalizeWord(word.word),
			}))
			.filter(word => word.word !== "")

		addWords(normalizedWords);
		setWordsToAdd([getBlankWord()])
		setShowAddModal(false)
	}

	return (
		<div>
			<Button variant="primary" onClick={() => setShowAddModal(true)}>
				<FontAwesomeIcon icon={faPlus} /> Add
			</Button>
			<Modal size="lg" show={showAddModal}>
				<ModalHeader setShow={setShowAddModal}>Add Words</ModalHeader>
				<ModalBody>
					<table className="w-full table-fixed bg-neutral-200 rounded-lg text-sm lg:text-base">
						<thead className="text-sm">
							<tr>
								<th className="text-start font-normal ps-3 py-2 pb-1">Word</th>
								<th className="text-start font-normal ps-3 py-2 pb-1 w-24 lg:w-28">Emotion</th>
								<th className="text-start font-normal ps-3 py-2 pb-1 w-28 lg:w-28">Type</th>
								{/* <th className="text-start font-normal ps-2 py-2 pb-1 w-12">PoS</th> */}
							</tr>
						</thead>
						<tbody>
							{wordsToAdd.map((word, index) => (
								<tr key={index} className="bg-neutral-200 text-black">
									<td className="p-2 py-1 pe-0">
										<input
											ref={(element) => { inputRefs.current[index] = element }}
											name="word"
											className={clsx(
												"p-2 bg-white rounded outline-none border-2 w-full",
												isDuplicate(word) ? "border-red-500 bg-red-100" : "border-transparent"
											)}
											type="text"
											value={word.word}
											aria-invalid={isDuplicate(word)}
											title={isDuplicate(word) ? "Duplicate word" : undefined}
											onChange={(event) => updateWord(index, "word", event.target.value)}
											onKeyUp={(e) => handleInputKeyUp(e, index)}
										/>
									</td>
									<td className="p-1 pe-0">
										<TypeaheadSelect
											value={word.emotion}
											options={EMOTIONS}
											onChange={(value) => updateWord(index, "emotion", value)}
											inputRef={(element) => { emotionInputRefs.current[index] = element }}
											onArrowUp={() => moveFocus(index, "emotion", -1)}
											onArrowDown={() => moveFocus(index, "emotion", 1)}
										/>
									</td>
									<td className="p-1 pe-2">
										<TypeaheadSelect
											value={word.type}
											options={TYPES}
											onChange={(value) => updateWord(index, "type", value)}
											inputRef={(element) => { typeInputRefs.current[index] = element }}
											onArrowUp={() => moveFocus(index, "type", -1)}
											onArrowDown={() => moveFocus(index, "type", 1)}
											onTab={index === wordsToAdd.length - 1 ? () => addRow(index) : undefined}
										/>
									</td>
									{/* <td className="p-1 pe-2">
										<TypeaheadSelect
											value={word.partOfSpeech}
											options={PARTS_OF_SPEECH}
											onChange={(value) => updateWord(index, "partOfSpeech", value)}
											inputRef={(element) => { partOfSpeechInputRefs.current[index] = element }}
											onArrowUp={() => moveFocus(index, "partOfSpeech", -1)}
											onArrowDown={() => moveFocus(index, "partOfSpeech", 1)}
											onSubmit={() => addRow(index)}
											onTab={index === wordsToAdd.length - 1 ? () => addRow(index) : undefined}
										/>
									</td> */}
									{/* <td className="w-10 text-center">
										<button
											onClick={() => removeRow(index)}
											tabIndex={-1}
											className="text-neutral-400 hover:text-red-500 px-2"
										>
											<FontAwesomeIcon icon={faTrash} />
										</button>
									</td> */}
								</tr>
							))}
							<tr>
								<td colSpan={3}>
									<button onClick={() => addRow()} className="text-sm text-black p-3">
										<FontAwesomeIcon icon={faPlus} className="me-1.5" />
										Add Row
									</button>
								</td>
							</tr>
						</tbody>
					</table>
				</ModalBody>
				<ModalFooter>
					<div className="flex justify-end items-center gap-4">
						{duplicates.length !== 0 && (
							<p className="text-sm flex-1 text-red-400" role="alert">
								Duplicate words are not allowed
							</p>
						)}
						<Button
							onClick={handleSave}
							disabled={duplicates.length !== 0}
							variant="success"
						>Add All</Button>
					</div>
				</ModalFooter>
			</Modal>
		</div>
	)
}