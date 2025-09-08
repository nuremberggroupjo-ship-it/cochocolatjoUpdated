import { FC } from "react"

import { Button } from "@/components/ui/button"

interface ClearAllFiltersButtonProps {
  onClear: () => void
  disabled?: boolean
  show: boolean
}

export const ClearAllFiltersButton: FC<ClearAllFiltersButtonProps> = ({
  onClear,
  disabled,
  show,
}) =>
  show ? (
    <Button
      variant="link"
      className="px-0 text-sm lg:text-base"
      onClick={onClear}
      disabled={disabled}
    >
      Clear all filters
    </Button>
  ) : null
