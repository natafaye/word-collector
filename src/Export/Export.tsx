import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "../Button"
import type { Word } from "../shared/types"
import { faDownload, faUpload } from "@fortawesome/free-solid-svg-icons"
import { useRef, type ChangeEvent } from "react"
import { parseCSV } from "./parseCSV"

type Props = {
    words: Word[]
    importWords: (words: Array<{ word: string, type: string, emotion: string }>) => Promise<void>
}

export default function Export({ words, importWords }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    const exportCSV = () => {
        const escapeCSV = (value: string) => {
            const text = value ?? ""
            return `"${text.replaceAll('"', '""')}"`
        }
        const rows = [
            ["Word", "Type", "Emotion"],
            ...words.map((word) => [word.word, word.type, word.emotion]),
        ]
        const csv = rows.map((row) => row.map(escapeCSV).join(",")).join("\r\n")
        const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = "words.csv"
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    }

    const importCSV = () => fileInputRef.current?.click()

    const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return

        try {
            const text = await file.text()
            const rows = parseCSV(text.replace(/^\uFEFF/, "")).filter((row) =>
                row.some((field) => field.trim().length > 0)
            )
            if (rows.length === 0) {
                window.alert("The CSV file is empty.")
                return
            }

            const headers = rows[0].map((header) => header.trim().toLowerCase())
            const wordIndex = headers.indexOf("word")
            const typeIndex = headers.indexOf("type")
            const emotionIndex = headers.indexOf("emotion")
            if (wordIndex === -1) {
                window.alert('The CSV must contain a "Word" header.')
                return
            }

            const importedRows = rows.slice(1).flatMap((row) => {
                const word = row[wordIndex]?.trim() ?? ""
                if (!word) return []
                return [{
                    word,
                    type: typeIndex === -1 ? "" : row[typeIndex]?.trim() ?? "",
                    emotion: emotionIndex === -1 ? "" : row[emotionIndex]?.trim() ?? "",
                }]
            })

            await importWords(importedRows)
        } catch (error) {
            console.error(error)
            window.alert("The CSV could not be imported.")
        }
    }

    return (
        <>
            <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleFile}
            />
            <Button variant="primary" aria-label="import" onClick={importCSV}><FontAwesomeIcon icon={faUpload}/></Button>
            <Button variant="primary" aria-label="export" onClick={exportCSV}><FontAwesomeIcon icon={faDownload} /></Button>
        </>
    )
}