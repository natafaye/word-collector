export const parseCSV = (text: string) => {
    const rows: string[][] = []
    let row: string[] = []
    let field = ""
    let inQuotes = false

    for (let index = 0; index < text.length; index++) {
        const character = text[index]
        if (inQuotes) {
            if (character === '"' && text[index + 1] === '"') {
                field += '"'
                index++
            } else if (character === '"') {
                inQuotes = false
            } else {
                field += character
            }
        } else if (character === '"') {
            inQuotes = true
        } else if (character === ',') {
            row.push(field)
            field = ""
        } else if (character === '\n') {
            row.push(field.replace(/\r$/, ""))
            rows.push(row)
            row = []
            field = ""
        } else {
            field += character
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field)
        rows.push(row)
    }

    return rows
}