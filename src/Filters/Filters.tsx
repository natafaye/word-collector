import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EMOTIONS, EMOTION_COLORS, TYPES, TYPE_ICONS } from "../shared/constants"
import RadioInput from "./RadioInput"
import type { FilterSettings } from "../shared/types"

type Props = {
    filters: FilterSettings
    onChange: (changed: Partial<FilterSettings>) => void
}

export default function Filters({ filters, onChange }: Props) {
    return (
        <div className="flex flex-row flex-wrap gap-3">
            <div className="flex flex-wrap bg-neutral-200 rounded-lg p-1 gap-1">
                <RadioInput
                    key="All"
                    name="emotion"
                    value="All"
                    checked={filters.emotion === "All"}
                    onChange={() => onChange({ emotion: "All" })}
                    checkedClassName="bg-neutral-700 text-white"
                >
                    All
                </RadioInput>
                {EMOTIONS.map(emotion => (
                    <RadioInput
                        key={emotion}
                        name="emotion"
                        value={emotion}
                        checked={filters.emotion === emotion}
                        onChange={() => onChange({ emotion })}
                        checkedStyle={{ backgroundColor: EMOTION_COLORS[emotion] }}
                        checkedClassName="text-white"
                    >
                        {emotion}
                    </RadioInput>
                ))}
            </div>
            <div className="flex flex-wrap bg-neutral-200 rounded-lg p-1 px-2 gap-1">
                <RadioInput
                    key="All"
                    name="type"
                    value="All"
                    checked={filters.type === "All"}
                    onChange={() => onChange({ type: "All" })}
                    className="flex items-center"
                >
                    All
                </RadioInput>
                {TYPES.map(type => (
                    <RadioInput
                        key={type}
                        name="type"
                        value={type}
                        checked={filters.type === type}
                        onChange={() => onChange({ type })}
                        className="flex items-center"
                    >
                        <FontAwesomeIcon icon={TYPE_ICONS[type]} className="me-1.5" />{type}
                    </RadioInput>
                ))}
            </div>
            {/* <div className="flex flex-wrap bg-neutral-200 rounded-lg p-1 px-2 gap-1">
                <RadioInput
                    key="All"
                    name="type"
                    value="All"
                    checked={filters.partOfSpeech === "All"}
                    onChange={() => onChange({ partOfSpeech: "All" })}
                    className="flex items-center"
                >
                    All
                </RadioInput>
                {PARTS_OF_SPEECH.map(partOfSpeech => (
                    <RadioInput
                        key={partOfSpeech}
                        name="type"
                        value={partOfSpeech}
                        checked={filters.partOfSpeech === partOfSpeech}
                        onChange={() => onChange({ partOfSpeech })}
                        className="flex items-center"
                    >
                        {PARTS_OF_SPEECH_EXPANSIONS[partOfSpeech]}
                    </RadioInput>
                ))}
            </div> */}
        </div>
    )
}