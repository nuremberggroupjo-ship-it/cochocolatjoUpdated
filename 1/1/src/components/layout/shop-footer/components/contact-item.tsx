import Link from "next/link"
import { FC, ReactNode } from "react"

import { LucideIcon } from "lucide-react"

interface ContactItemProps {
  icon: LucideIcon
  href: string
  label: string
  children?: ReactNode
}

export const ContactItem: FC<ContactItemProps> = ({
  icon: Icon,
  href,
  label,
  children,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4" />
      <Link
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="hover:text-primary transition-colors"
      >
        {label}
      </Link>
      {children}
    </div>
  )
}
