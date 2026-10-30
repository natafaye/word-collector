import clsx from "clsx"
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import type { Ref } from "react"
import { createPortal } from "react-dom"

interface Props {
  value: string
  options: string[]
  onChange: (value: string) => void
  onSubmit?: () => void
  onArrowUp?: () => void
  onArrowDown?: () => void
  onTab?: () => void
  inputRef?: Ref<HTMLInputElement>
  className?: string
}

export default function TypeaheadSelect({ value, options, onChange, onSubmit, onArrowUp, onArrowDown, onTab, inputRef, className }: Props) {
  const [draft, setDraft] = useState(value)
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(0)
  const [hasTyped, setHasTyped] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 240 })
  const internalInputRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => {
    setDraft(value)
    setHasTyped(false)
  }, [value])

  const matches = !hasTyped
    ? options
    : options.filter((option) => {
      const query = draft.trim().toLowerCase()
      if (!query) return true
      return option.toLowerCase().startsWith(query)
    })

  useLayoutEffect(() => {
    if (!open || !internalInputRef.current) return

    const updatePosition = () => {
      const rect = internalInputRef.current!.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom - 8
      const spaceAbove = rect.top - 8
      const estimatedHeight = matches.length * 40 + 8
      const openAbove = spaceBelow < estimatedHeight && spaceAbove > spaceBelow
      const maxHeight = Math.max(openAbove ? spaceAbove : spaceBelow, 40)

      setPosition({
        top: openAbove ? rect.top - Math.min(estimatedHeight, maxHeight) - 4 : rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        maxHeight,
      })
    }

    updatePosition()
    window.addEventListener("resize", updatePosition)
    window.addEventListener("scroll", updatePosition, true)
    return () => {
      window.removeEventListener("resize", updatePosition)
      window.removeEventListener("scroll", updatePosition, true)
    }
  }, [open, matches.length])

  const commitMatch = () => {
    if (!hasTyped) {
      setDraft(value)
      return value
    }
    const match = matches[highlighted] ?? matches[0]
    if (match) {
      setDraft(match)
      onChange(match)
      return match
    }
    setDraft(value)
    return value
  }

  return (
    <div className={clsx(className, "relative")}>
      <input
        ref={(element) => {
          internalInputRef.current = element
          if (typeof inputRef === "function") inputRef(element)
          else if (inputRef) inputRef.current = element
        }}
        className="p-2.5 bg-white w-full rounded"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        type="text"
        value={draft}
        autoComplete="off"
        onFocus={(event) => {
          setHasTyped(false)
          setHighlighted(0)
          setOpen(true)
          event.currentTarget.select()
        }}
        onBlur={() => {
          commitMatch()
          setOpen(false)
        }}
        onChange={(event) => {
          setDraft(event.target.value)
          setHasTyped(true)
          setHighlighted(0)
          setOpen(true)
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault()
            setOpen(false)
            onArrowUp?.()
          } else if (event.key === "ArrowDown") {
            event.preventDefault()
            setOpen(false)
            onArrowDown?.()
          } else if (event.key === "Enter") {
            event.preventDefault()
            commitMatch()
            onSubmit?.()
          } else if (event.key === "Escape") {
            setDraft(value)
            setHasTyped(false)
            setOpen(false)
          } else if (event.key === "Tab") {
            commitMatch()
            if (onTab && !event.shiftKey) {
              event.preventDefault()
              setOpen(false)
              onTab()
            }
          }
        }}
      />
      {open && matches.length > 0 && typeof document !== "undefined" && createPortal(
        <ul
          id={listId}
          role="listbox"
          className="fixed z-100 overflow-y-auto bg-white border border-neutral-300 rounded-lg shadow-lg"
          style={{
            top: position.top,
            left: position.left,
            width: position.width,
            maxHeight: position.maxHeight,
          }}
        >
          {matches.map((option, index) => (
            <li
              key={option}
              role="option"
              aria-selected={highlighted === index}
              className="px-3 py-2 cursor-pointer hover:bg-neutral-100 text-sm lg:text-base"
              onMouseDown={(event) => {
                event.preventDefault()
                setDraft(option)
                setHasTyped(false)
                onChange(option)
                setOpen(false)
              }}
            >{option}</li>
          ))}
        </ul>,
        document.body
      )}
    </div>
  )
}
