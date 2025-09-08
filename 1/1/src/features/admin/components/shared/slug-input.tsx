import { cn } from "@/lib/utils"

interface SlugInputProps {
  value?: string | number
  hasError?: boolean
}

export function SlugInput({ value, hasError }: SlugInputProps) {
  return (
    <div
      className={cn(
        "flex h-9 w-full min-w-0 items-center rounded-md border px-3 py-1 text-sm shadow-xs",
        !value && "text-muted-foreground",
        hasError ? "border-destructive" : "border-input",
      )}
    >
      {value ? value : "Slug"}
    </div>
  )
}
