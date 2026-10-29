import type { ReactNode } from "react"

type Props = {
  children: ReactNode
}
export default function ModalBody({ children }: Props) {
  return (
    <div className="overflow-y-auto min-h-0 flex-1">
      {children}
    </div>
  )
}