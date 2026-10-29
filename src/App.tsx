import { useState } from "react";
import Filters from "./Filters/Filters";
import Words from "./Words/Words";
import type { FilterSettings } from "./shared/types";
import { useWords } from "./useWords";
import AddWords from "./AddWords/AddWords";

export default function App() {
  const [filters, setFilters] = useState<FilterSettings>({ type: "All", emotion: "All", partOfSpeech: "All" });
  const onFilterChange = (changed: Partial<FilterSettings>) => setFilters({ ...filters, ...changed });
  const { words, addWords } = useWords();

  return (
    <div className="bg-neutral-100 text-neutral-950 fixed inset-0 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center bg-cyan-950 text-white p-3">
        <h2 className="slabo text-3xl">Word Collector</h2>
        <AddWords words={words} addWords={addWords}/>
      </div>
      <div className="p-4">
        <Filters filters={filters} onChange={onFilterChange} />
        <div>
          <Words words={words} filters={filters} />
        </div>
      </div>
    </div>
  )
}