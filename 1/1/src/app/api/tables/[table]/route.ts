import { type NextRequest } from "next/server"

import * as XLSX from "xlsx"

import { verifySession } from "@/lib/dal"
import prisma from "@/lib/prisma"

/**
 * Handles a GET request to export data from a specified database table in various formats.
 *
 * @param params - An object containing the `table` parameter, indicating the name of the database table.
 * @returns A Response object containing the data in the requested format (CSV, TXT, XLSX, JSON, or HTML).
 *
 * @throws Will throw an error if the table name is not provided or if the specified table does not exist in the database.
 *
 * The function performs the following steps:
 * 1. Retrieves all table names from the database.
 * 2. Checks if the specified table exists among the retrieved table names.
 * 3. Fetches data from the specified table.
 * 4. Converts the data into the requested format using the XLSX library.
 * 5. Returns the formatted data in a Response object with appropriate headers.
 *
 * Supported formats:
 * - CSV: Returns data as a CSV file with quoted values.
 * - TXT: Returns data as a tab-separated text file.
 * - XLSX: Returns data as an Excel spreadsheet.
 * - JSON: Returns data in JSON format.
 * - HTML: Returns data as an HTML table.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const session = await verifySession({ isAdmin: true })
  if (!session || session.user?.role !== "ADMIN") {
    return new Response("Unauthorized", { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const format = searchParams.get("format") // Get the requested file format (e.g., csv, xlsx)

  try {
    const table = (await params).table
    if (!table) throw new Error("Table name required.") // Ensure a table name is provided

    // FIX: Cast the column to TEXT to avoid deserialization issues
    const tableNames = await prisma.$queryRaw<{ tablename: string }[]>`
      SELECT tablename::TEXT as tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public'
    `
    // Convert to simple array of table names
    const availableTables = tableNames.map((row) => row.tablename)

    // Check if the provided table name exists in the list of table names
    if (!availableTables.includes(table)) {
      throw new Error(`Table '${table}' does not exist.`)
    }

    // Fetch the data from the matching table using dynamic queries
    const data = await prisma.$queryRawUnsafe(`SELECT * FROM "${table}"`)

    // Convert the data into a worksheet (in-memory representation)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const worksheet = XLSX.utils.json_to_sheet(data as any[])

    // Determine the file format and generate the appropriate response
    switch (format) {
      case "csv":
        const csvData = XLSX.utils.sheet_to_csv(worksheet, {
          forceQuotes: true,
        })
        return new Response(csvData, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="co-chocolat-${table}.csv"`,
            "Content-Type": "text/csv",
          },
        })
      case "txt":
        const txtData = XLSX.utils.sheet_to_txt(worksheet, {
          forceQuotes: true,
        })
        return new Response(txtData, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="co-chocolat-${table}.txt"`,
            "Content-Type": "text/plain",
          },
        })
      case "xlsx":
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
        const buffer = XLSX.write(workbook, {
          type: "buffer",
          bookType: "xlsx",
        })
        return new Response(buffer, {
          status: 200,
          headers: {
            "Content-Disposition": `attachment; filename="co-chocolat-${table}.xlsx"`,
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          },
        })
      case "json":
        return Response.json(data)
      default:
        const htmlData = XLSX.utils.sheet_to_html(worksheet)
        return new Response(htmlData, {
          status: 200,
          headers: {
            "Content-Type": "text/html",
          },
        })
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return new Response(e.message, {
        status: 400,
      })
    }
  }
}
