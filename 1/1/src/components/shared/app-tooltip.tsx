import type {
  FC,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from "react"

import {
  Tooltip,
  TooltipContent,
  TooltipContentProps,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface AppTooltipProps
  extends React.ComponentProps<
    ForwardRefExoticComponent<
      TooltipContentProps & RefAttributes<HTMLDivElement>
    >
  > {
  /** The element that triggers the tooltip to show */
  trigger: ReactNode
}

/**
 * A simple tooltip component that can be used throughout the application.
 *
 * @example
 * <AppTooltip trigger={<Button>Hover Me</Button>}>
 *   This is a helpful tooltip
 * </AppTooltip>
 */
export const AppTooltip: FC<AppTooltipProps> = ({
  trigger,
  children,
  ...props
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{trigger}</TooltipTrigger>
        <TooltipContent {...props}>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
