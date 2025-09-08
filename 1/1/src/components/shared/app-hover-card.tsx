import { FC, ReactNode } from "react"

import { HelpCircle } from "lucide-react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

interface AppHoverCardProps {
  children: ReactNode
}

export const AppHoverDemo: FC<AppHoverCardProps> = ({ children }) => {
  return (
    <HoverCard>
      <HoverCardTrigger className="cursor-pointer">
        <HelpCircle className="text-info size-[14px]" />
      </HoverCardTrigger>
      <HoverCardContent className="w-64 text-sm">{children}</HoverCardContent>
    </HoverCard>
  )
}
