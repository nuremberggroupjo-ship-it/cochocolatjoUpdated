import { FC, SVGProps } from "react"

import { cn } from "@/lib/utils"

interface SvgIconProps extends SVGProps<SVGSVGElement> {
  icon: FC<SVGProps<SVGSVGElement>>
}

export const SvgIcon: FC<SvgIconProps> = ({
  icon: Icon,
  className,
  ...props
}) => {
  return <Icon {...props} className={cn("size-5", className)} />
}
