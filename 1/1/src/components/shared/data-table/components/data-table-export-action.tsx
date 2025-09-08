import Link from "next/link"

import { ChevronsUpDown, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { TableName } from "@/features/admin/types"

const availableFormats = ["csv", "txt", "json", "html"]
// const availableFormats = ["xlsx", "csv", "txt", "json", "html"]

interface DataTableExportActionProps {
  tableName: TableName
}

export function DataTableExportAction({
  tableName,
}: DataTableExportActionProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto flex h-8">
          <Download />
          <span className="hidden md:flex">Export</span>
          <ChevronsUpDown className="hidden shrink-0 opacity-50 md:flex" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {availableFormats.map((format) => (
          <Link
            key={format}
            href={`/api/tables/${tableName.toLowerCase()}?format=${format}`}
          >
            <DropdownMenuItem className="cursor-pointer capitalize">
              {format}
            </DropdownMenuItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
