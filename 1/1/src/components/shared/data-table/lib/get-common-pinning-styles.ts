import type { Column } from "@tanstack/react-table"

/**
 * Generate common pinning styles for a table column.
 *
 * This function calculates and returns CSS properties for pinned columns in a data table.
 * It handles both left and right pinning, applying appropriate styles for positioning,
 * shadows, and z-index. The function also considers whether the column is the last left-pinned
 * or first right-pinned column to apply specific shadow effects.
 *
 * @param options - The options for generating pinning styles.
 * @param options.column - The column object for which to generate styles.
 * @param options.withBorder - Whether to show a box shadow between pinned and scrollable columns.
 * @returns A React.CSSProperties object containing the calculated styles.
 */
export function getCommonPinningStyles<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  /**
   * Show box shadow between pinned and scrollable columns.
   * @default false
   */
  withBorder?: boolean
}): React.CSSProperties {
  const pinnedSide = column.getIsPinned()
  const isPinnedLeft = pinnedSide === "left"
  const isPinnedRight = pinnedSide === "right"

  // Detect if this is the last left-pinned or first right-pinned column
  const isLastLeftPinned = isPinnedLeft && column.getIsLastColumn("left")
  const isFirstRightPinned = isPinnedRight && column.getIsFirstColumn("right")

  return {
    position: pinnedSide ? "sticky" : "relative",
    zIndex: pinnedSide ? 1 : 0,
    background: "var(--background)",
    opacity: pinnedSide ? 0.97 : 1,
    width: column.getSize(),
    left: isPinnedLeft ? `${column.getStart("left")}px` : undefined,
    right: isPinnedRight ? `${column.getAfter("right")}px` : undefined,
    boxShadow:
      withBorder && (isLastLeftPinned || isFirstRightPinned)
        ? `${isLastLeftPinned ? "-" : ""}4px 0 4px -4px var(--muted) inset`
        : undefined,
  }
}
