import { FC } from "react"

import { Loader2Icon } from "lucide-react"

import { Button, type ButtonProps } from "@/components/ui/button"

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean
}

export const LoadingButton: FC<LoadingButtonProps> = ({
  isLoading,
  disabled,
  children,
  ...props
}) => {
  return (
    <Button type="submit" disabled={isLoading || disabled} {...props}>
      {isLoading && <Loader2Icon className="h-5 w-5 animate-spin" />}
      {children}
    </Button>
  )
}
