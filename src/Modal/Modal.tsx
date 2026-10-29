import type { ReactNode } from "react"
import { createPortal } from "react-dom"
import clsx from "clsx"

type Props = {
    show: boolean
    children?: ReactNode
    size?: "sm" | "md" | "lg"
}

export default function Modal({ show, size = "md", children }: Props) {
    if (!show) return ""
    
    return createPortal(
        <div className="fixed inset-0 overflow-hidden flex items-center justify-center bg-black/80 z-50">
            <div
                className={clsx(
                  "bg-neutral-100 rounded-lg shadow-xl w-full max-h-[90vh] p-2 lg:p-5 flex flex-col",
                  { sm: "max-w-sm", md: "max-w-md", lg: "max-w-2xl" }[size]
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>,
        document.body
    )
}