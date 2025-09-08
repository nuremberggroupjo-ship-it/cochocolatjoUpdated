"use client"

import { FC, ReactNode, SVGProps } from "react"

import { Trash2 } from "lucide-react"

import { DIALOG_TEXTS } from "@/constants"

import { Button } from "@/components/ui/button"
import {
  ResponsiveModal,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from "@/components/ui/responsive-modal"

import { LoadingButton } from "@/components/shared/loading-button"
import { SvgIcon } from "@/components/shared/svg-icon"

interface AppResponsiveModalProps
  extends React.ComponentProps<typeof ResponsiveModal> {
  trigger?: ReactNode // Custom trigger component
  showTrigger?: boolean // Whether to show the trigger
  title?: string // Modal title
  description?: string // Modal description
  isDescriptionHtml?: boolean // Whether the description contains HTML
  actionComp?: ReactNode // Custom action button content
  onAction?: () => void // Function to execute when the action button is clicked
  isActionLoading?: boolean // Whether the action is in progress
  actionVariant?: "default" | "destructive" // Variant for the action button
  cancelText?: string // Text for the cancel button
  actionText?: string // Text for the action button
  showCancelButton?: boolean // Whether to show the cancel button
  showActionButton?: boolean // Whether to show the action button
  icon?: FC<SVGProps<SVGSVGElement>> // Icon to display in the action button
}

export const AppResponsiveModal: FC<AppResponsiveModalProps> = ({
  trigger,
  showTrigger = true,
  title = DIALOG_TEXTS.DELETE_CONFIRMATION.TITLE,
  description = DIALOG_TEXTS.DELETE_CONFIRMATION.DESCRIPTION(),
  isDescriptionHtml = false, // Default to false for plain text
  isActionLoading = false,
  actionComp,
  onAction,
  actionVariant = "destructive",
  cancelText = "Cancel",
  actionText = "Delete",
  showCancelButton = true,
  showActionButton = true,
  icon = Trash2,
  children,
  ...props
}) => {
  return (
    <ResponsiveModal {...props}>
      {showTrigger && (
        <ResponsiveModalTrigger asChild>
          {trigger || (
            <Button
              variant="destructive"
              className="w-10 sm:w-auto"
              disabled={isActionLoading}
            >
              <SvgIcon icon={icon} />
              <span className="hidden sm:flex">{actionText}</span>
            </Button>
          )}
        </ResponsiveModalTrigger>
      )}
      <ResponsiveModalContent className="space-y-4 sm:space-y-2 lg:space-y-0">
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>{title}</ResponsiveModalTitle>
          {/* Conditionally render description with or without dangerouslySetInnerHTML */}
          {isDescriptionHtml ? (
            <ResponsiveModalDescription
              dangerouslySetInnerHTML={{ __html: description }}
            />
          ) : (
            <ResponsiveModalDescription>
              {description}
            </ResponsiveModalDescription>
          )}
        </ResponsiveModalHeader>
        {children}
        <ResponsiveModalFooter className="gap-y-2">
          {showCancelButton && (
            <ResponsiveModalClose asChild>
              <Button variant="outline" disabled={isActionLoading}>
                {cancelText}
              </Button>
            </ResponsiveModalClose>
          )}

          {showActionButton && onAction && (
            <LoadingButton
              onClick={onAction}
              variant={actionVariant}
              isLoading={isActionLoading}
            >
              {actionComp || (
                <>
                  <SvgIcon icon={icon} />
                  <span>{actionText}</span>
                </>
              )}
            </LoadingButton>
          )}
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  )
}
