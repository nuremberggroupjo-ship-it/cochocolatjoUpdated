import { ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export type AccordionItemType = {
  value: string
  trigger: ReactNode
  content: ReactNode
}

interface AppAccordionProps {
  items: AccordionItemType[]
  type?: "single" | "multiple"
  collapsible?: boolean
  defaultValue?: string | string[]
  className?: string
}

export function AppAccordion({
  items,
  type = "single",
  collapsible = true,
  defaultValue,
  className,
}: AppAccordionProps) {
  return type === "single" ? (
    <Accordion
      type="single"
      collapsible={collapsible}
      defaultValue={defaultValue as string}
      className={className}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger className="py-2">{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ) : (
    <Accordion
      type="multiple"
      defaultValue={defaultValue as string[]}
      className={className}
    >
      {items.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.trigger}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
