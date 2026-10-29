import clsx from "clsx"
import type { CSSProperties, ReactNode } from "react"

type Props = {
    value: string | number
    name: string
    checked: boolean
    onChange: (newValue: string | number) => void
    children: ReactNode
    className?: string
    style?: CSSProperties
    checkedStyle?: CSSProperties
    checkedClassName?: string
}

const defaultCheckedClassName = "border-cyan-600 text-cyan-600"

export default function RadioInput({ value, name, checked, onChange, children, className,
    style = {}, 
    checkedStyle = {},
    checkedClassName = defaultCheckedClassName
}: Props) {
    return (
        <label style={{...style, ...(checked ? checkedStyle : {})}} className={clsx(
            className,
            "flex p-1.5 px-3 rounded-lg",
            checked ? checkedClassName : "border-transparent"
        )}>
            <input
                type="radio"
                className="opacity-0 h-0 w-0"
                name={name}
                checked={checked}
                onChange={() => onChange(value)}
            />
            {children}
        </label>
    )
}