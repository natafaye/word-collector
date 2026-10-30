import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EMOTIONS, EMOTION_COLORS, TYPES, TYPE_ICONS } from "../shared/constants"
import RadioInput from "./RadioInput"
import type { FilterSettings } from "../shared/types"
import { useState } from "react"
import { faAngleDown, faAngleUp, faMagnifyingGlass, faX } from "@fortawesome/free-solid-svg-icons"

type Props = {
    filters: FilterSettings
    onChange: (changed: Partial<FilterSettings>) => void
}

export default function Filters({ filters, onChange }: Props) {
    const [expanded, setExpanded] = useState(true);
    return (
        <div>
            <div className="flex flex-wrap gap-3">
                {!expanded ? (
                    <div className="flex items-center w-full bg-neutral-200 p-2 rounded-lg gap-2 text-neutral-700">
                        {filters.emotion === "All" && filters.type === "All" && filters.query === "" &&
                            <span className="text-neutral-500">Showing all</span>
                        }
                        {filters.emotion !== "All" && filters.emotion !== "Group" && (
                            <div className="text-white p-1.5 px-3 rounded-lg" style={{ backgroundColor: EMOTION_COLORS[filters.emotion] }}>
                                {filters.emotion}
                            </div>
                        )}
                        {filters.type !== "All" && filters.type !== "Group" && <div className="text-white p-1.5 px-3 rounded-lg bg-neutral-800">
                            <FontAwesomeIcon icon={TYPE_ICONS[filters.type]} className="me-1.5" />{filters.type}
                        </div>}
                        <span className="text-neutral-500">
                            {filters.emotion === "Group" ? "Grouped by Emotion" : filters.type === "Group" ? "Grouped by Type" : ""}
                        </span>
                        {filters.query && <div>"{filters.query}"</div>}
                    </div>
                ) : <>
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
                        <RadioInput
                            key="Group"
                            name="emotion"
                            value="Group"
                            checked={filters.emotion === "Group"}
                            onChange={() => onChange({ emotion: "Group" })}
                            checkedClassName="bg-neutral-700 text-white"
                        >
                            Group
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
                    {/* <div className="bg-neutral-200 rounded-lg pe-2 w-full md:w-auto order-3 md:order-2">
                        <select className="p-2 w-full" value={filters.groupBy} onChange={(e) => onChange({ groupBy: e.target.value as keyof Word })}>
                            <option value="">Don't Group</option>
                            <option value="emotion">Group by Emotion</option>
                            <option value="type">Group by Type</option>
                        </select>
                    </div> */}
                    <div className="flex flex-wrap bg-neutral-200 rounded-lg p-1 px-2 gap-1">
                        <RadioInput
                            key="All"
                            name="type"
                            value="All"
                            checked={filters.type === "All"}
                            onChange={() => onChange({ type: "All" })}
                            className="flex items-center"
                            checkedClassName="bg-neutral-700 text-white"
                        >
                            All
                        </RadioInput>
                        <RadioInput
                            key="Group"
                            name="type"
                            value="Group"
                            checked={filters.type === "Group"}
                            onChange={() => onChange({ type: "Group" })}
                            className="flex items-center"
                            checkedClassName="bg-neutral-700 text-white"
                        >
                            Group
                        </RadioInput>
                        {TYPES.map(type => (
                            <RadioInput
                                key={type}
                                name="type"
                                value={type}
                                checked={filters.type === type}
                                onChange={() => onChange({ type })}
                                className="flex items-center"
                                checkedClassName="bg-neutral-700 text-white"
                            >
                                <FontAwesomeIcon icon={TYPE_ICONS[type]} className="me-1.5" />{type}
                            </RadioInput>
                        ))}
                    </div>
                    <div className="bg-neutral-200 rounded-lg p-1.5 flex gap-2 items-center text-neutral-700 w-full md:w-72">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="text-neutral-500" />
                        <input
                            type="text"
                            className="outline-0 grow min-w-20"
                            value={filters.query}
                            onChange={(e) => onChange({ query: e.target.value })}
                        />
                        {filters.query && <button aria-label="clear search" onClick={() => onChange({ query: "" })}>
                            <FontAwesomeIcon icon={faX} className="text-neutral-400" />
                        </button>}
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
                </>}
            </div>
            <button className="w-full flex gap-2 items-center mt-2 text-neutral-400" onClick={() => setExpanded(!expanded)}>
                <hr className="grow border-neutral-400" />
                <FontAwesomeIcon icon={expanded ? faAngleUp : faAngleDown} size="lg" />
                <hr className="grow border-neutral-400" />
            </button>
        </div>
    )
}