import clsx from "clsx"
import type { ButtonHTMLAttributes } from "react"

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant: "primary" | "success"
}

export default function Button({ children, className, variant, ...props }: Props) {
    return (
        <button className={clsx(
            { primary: "bg-cyan-800", success: "bg-emerald-600" }[variant],
            "py-2 p-3 rounded-lg text-white",
            "disabled:bg-neutral-600 disabled:text-neutral-400 disabled:cursor-not-allowed", 
            className
        )} {...props}>{children}</button>
    )
}