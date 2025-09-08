"use client";

import { FC } from "react";
import { CheckedState } from "@radix-ui/react-checkbox";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { AppAccordion } from "@/components/shared/app-accordion";

interface FilterItem {
  slug: string;
  name: string;
  id: string;
  count: number;
}

interface GenericCheckboxFilterProps {
  title: "categories" | "dietary" | "sale" | "size";
  items: FilterItem[];
  count?: number;
  selectedSlugs: string[]; // selected slugs
  onSelectionChange: (slugs: string[]) => void;
  className?: string;
  maxHeight?: string;
  lockedSlugs?: string[]; // <-- new: slugs that should be checked & disabled (cannot be unchecked)
}

export const GenericCheckboxFilter: FC<GenericCheckboxFilterProps> = ({
  title,
  items,
  selectedSlugs,
  onSelectionChange,
  className = "",
  maxHeight = "max-h-64",
  lockedSlugs = [],
}) => {
  const handleItemToggle = (slug: string, checked: CheckedState) => {
    // If this slug is locked, ignore toggle (do nothing)
    if (lockedSlugs.includes(slug)) return;

    const updatedSlugs = checked
      ? // checked can be true or "indeterminate" — treat truthy as checked
        [...selectedSlugs, slug]
      : selectedSlugs.filter((s) => s !== slug);

    onSelectionChange(updatedSlugs);
    console.log("Toggled:", slug, checked);
  };

  return (
    <div className={cn("space-y-2", className)}>
      <AppAccordion
        items={[
          {
            value: title,
            trigger: (
              <h2 className="text-sm font-semibold tracking-wide uppercase">
                {title}
              </h2>
            ),
            content: (
              <div
                className={cn(
                  "filter-scroll overflow-x-hidden overflow-y-auto",
                  maxHeight
                )}
              >
                <ul className="space-y-1.5 pr-2">
                  {items.map(({ id, name, slug }) => {
                    const isSelected = selectedSlugs.includes(slug);
                    const isLocked = lockedSlugs.includes(slug);

                    return (
                      <li key={id} className="text-sm">
                        <label
                          className={cn(
                            "flex items-center gap-2 rounded-md p-1 font-medium transition-colors",
                            "hover:bg-muted/30",
                            isLocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer",
                          )}
                          // when locked, prevent pointer interactions on label children
                          aria-disabled={isLocked}
                        >
                          <Checkbox
                            id={`${title.toLowerCase()}-${slug}`}
                            checked={isSelected || isLocked}
                            disabled={isLocked}
                            onCheckedChange={(checked) =>
                              handleItemToggle(slug, checked)
                            }
                          />
                          <span className="line-clamp-1 flex-1 text-sm break-all capitalize">
                            {name}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ),
          },
        ]}
        type="single"
        collapsible
        defaultValue={title}
      />
    </div>
  );
};
