import { ComponentProps, FC, ReactNode } from "react"

import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

import { cn } from "@/lib/utils"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export type SheetSide = "top" | "right" | "bottom" | "left"
export type SheetSize = "sm" | "default" | "lg" | "xl" | "full" | "content"

interface AppSheetProps {
  /** The element that triggers the sheet to open */
  trigger: ReactNode
  /** The main content of the sheet */
  children: ReactNode
  /** Optional title for the sheet */
  title?: string
  /** Optional description for the sheet */
  description?: string
  /** Optional footer content */
  footer?: ReactNode
  /** Side from which the sheet appears */
  side?: SheetSide
  /** Size of the sheet */
  size?: SheetSize
  /** Whether the sheet is currently open (controlled mode) */
  open?: boolean
  /** Handler for when the open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional class names for the sheet content */
  className?: string
  /** Additional props for SheetContent */
  sheetContentProps?: Omit<
    ComponentProps<typeof SheetContent>,
    "side" | "className" | "children"
  >
}

/**
 * A flexible sheet/drawer component that can be used throughout the application.
 *
 * @example
 * // Basic usage with trigger
 * <AppSheet
 *   trigger={<Button>Open Sheet</Button>}
 *   title="User Settings"
 *   description="Manage your account preferences"
 * >
 *   <YourSheetContent />
 * </AppSheet>
 *
 * @example
 * // With custom footer and side
 * <AppSheet
 *   trigger={<IconButton icon={Settings} label="Settings" />}
 *   title="Account Settings"
 *   side="left"
 *   size="lg"
 *   footer={
 *     <div className="flex justify-between">
 *       <Button variant="outline">Cancel</Button>
 *       <Button>Save Changes</Button>
 *     </div>
 *   }
 * >
 *   <SettingsForm />
 * </AppSheet>
 */
export const AppSheet: FC<AppSheetProps> = ({
  trigger,
  children,
  title,
  description,
  footer,
  side = "right",
  size = "default",
  open,
  onOpenChange,
  className,
  sheetContentProps,
}) => {
  // Map size to classes
  const sizeClasses = {
    sm: "sm:max-w-sm",
    default: "sm:max-w-3xs md:max-w-xs",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    full: "sm:max-w-full",
    content: "sm:max-w-fit",
  }

  const sizeClass = sizeClasses[size as keyof typeof sizeClasses] || size

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        side={side}
        className={cn(sizeClass, className)}
        {...sheetContentProps}
      >
        {/* Render header if title or description exists */}
        {title || description ? (
          <SheetHeader>
            {title && <SheetTitle>{title}</SheetTitle>}
            {description && (
              <SheetDescription className="text-xs md:text-sm">
                {description}
              </SheetDescription>
            )}
          </SheetHeader>
        ) : (
          // Visually hide the header if no title or description bc ui error
          <VisuallyHidden>
            <SheetHeader>
              <SheetTitle>{title}</SheetTitle>
              <SheetDescription>{description}</SheetDescription>
            </SheetHeader>
          </VisuallyHidden>
        )}

        {/* Main content */}
        {children}

        {/* Render footer if it exists */}
        {footer && <SheetFooter>{footer}</SheetFooter>}
      </SheetContent>
    </Sheet>
  )
}
