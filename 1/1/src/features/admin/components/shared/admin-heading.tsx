import { FC } from "react"

import { cn } from "@/lib/utils"

// Define the props that the AdminHeading component accepts
interface AdminHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string // The main title text
  description?: string // Supporting description text
}

// Define the AdminHeading component using React functional component syntax
export const AdminHeading: FC<AdminHeadingProps> = ({
  title,
  description,
  className,
  ...props
}) => {
  return (
    // Use the provided className if available, for additional styling
    <div className={cn("", className)} {...props}>
      {/* Render the main title */}
      <h2 className="text-2xl font-semibold tracking-wide capitalize md:text-3xl">
        {title}
      </h2>
      {/* Conditionally render the description if provided */}
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </div>
  )
}
