import { type ClassValue, clsx } from "clsx"
import { toast } from "sonner"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Normalizes a name string by:
 * - Trimming whitespace
 * - Removing special characters
 * - Replacing multiple spaces with a single space
 * - Capitalizing the first letter of each word
 *
 * Example:
 * ```
 * normalizeName("  john   doe! ") // "John Doe"
 * normalizeName("mary jane") // "Mary Jane"
 * ```
 *
 * @param {string} name - The name string to normalize
 * @returns {string} The normalized name string
 */
export function normalizeName(name: string): string {
  return name
    .trim()
    .replace(/[^a-zA-Z\s]/g, "") // Remove special characters
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/^\s+|\s+$/g, "") // Trim leading and trailing spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize first letter of each word
}

/**
 * Converts any value to a plain JavaScript object by:
 * - Serializing to JSON string
 * - Parsing back to remove class instances, functions, numbers, etc.
 * - Preserving only serializable data
 *
 * Example:
 * ```
 * convertToPlainObject(new Date()) // Returns plain object representation
 * convertToPlainObject(classInstance) // Strips methods, keeps data
 * ```
 *
 * @param {T} value - The value to convert to a plain object
 * @returns {T} A plain object representation of the input
 */
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

/**
 * Formats a date using Intl.DateTimeFormat with sensible defaults:
 * - Default: "October 5, 2023 at 02:30:45 PM"
 * - Accepts custom formatting options
 * - Handles Date objects, strings, or timestamps
 *
 * Example:
 * ```
 * formatDate(new Date()) // "October 5, 2023 at 02:30:45 PM"
 * formatDate(date, { month: "short" }) // "Oct 5, 2023 at 02:30:45 PM"
 * ```
 *
 * @param {Date | string | number} date - The date to format
 * @param {Intl.DateTimeFormatOptions} opts - Optional formatting options
 * @returns {string} The formatted date string
 */
export function formatDate(
  date: Date | string | number,
  opts: Intl.DateTimeFormatOptions = {},
): string {
  return new Intl.DateTimeFormat("en-US", {
    month: opts.month ?? "long", // Full month name by default (e.g., "October")
    day: opts.day ?? "numeric", // Day of the month as a number (e.g., "5")
    year: opts.year ?? "numeric", // Full year (e.g., "2023")
    hour: opts.hour ?? "2-digit", // Hour in 2-digit format (e.g., "02" or "14")
    minute: opts.minute ?? "2-digit", // Minute in 2-digit format (e.g., "30")
    second: opts.second ?? "2-digit", // Second in 2-digit format (e.g., "45")
    hour12: opts.hour12 ?? true, // Use 12-hour format by default (e.g., "02:30 PM")
    ...opts, // Merge any additional options provided by the caller
  }).format(new Date(date)) // Convert the input to a Date object and format it
}

/**
 * Creates a URL-friendly slug from a string by:
 * - Converting to lowercase
 * - Removing accents and special characters
 * - Replacing spaces with hyphens
 * - Ensuring clean, web-safe format
 *
 * Example:
 * ```
 * slugify("Hello World!") // "hello-world"
 * slugify("Café & Restaurant") // "cafe-restaurant"
 * ```
 *
 * @param {string} str - The string to convert to a slug
 * @returns {string} A URL-friendly slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase() // Convert to lowercase
    .normalize("NFD") // Normalize accents and diacritics
    .replace(/[\u0300-\u036f]/g, "") // Remove accents/diacritics
    .trim() // Remove leading and trailing spaces
    .replace(/[^\w\s-]/g, "") // Remove non-word, non-whitespace, non-hyphen characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single one
}

/**
 * Extracts a specific key from an array of objects and joins the values into a single string.
 * Useful for creating comma-separated lists from object properties.
 *
 * Example:
 * ```
 * const items = [{ name: "Apple" }, { name: "Banana" }, { name: "Cherry" }]
 * extractAndJoin(items, "name") // "Apple, Banana, Cherry"
 * ```
 *
 * @param {T[]} items - The array of objects to extract from
 * @param {K} key - The key to extract from each object
 * @returns {string} A comma-separated string of the extracted values
 */
export function extractAndJoin<T, K extends keyof T>(
  items: T[],
  key: K,
): string {
  return items.map((item) => String(item[key])).join(", ")
}

/**
 * Capitalizes the first letter of a string.
 * If the string is empty or undefined, it returns the original value.
 *
 * Example:
 * ```
 * capitalize("hello") // "Hello"
 * capitalize("world") // "World"
 * capitalize("") // ""
 * ```
 *
 * @param {string} str - The string to capitalize
 * @returns {string} The capitalized string
 */
export function capitalize(str: string): string {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str
}

/**
 * Converts a value to an array.
 * If the value is already an array, it returns it as-is.
 * If the value is not defined or null, it returns an empty array.
 *
 * @param value - The value to convert to an array
 * @returns An array containing the value or an empty array
 */
export function toArray<T>(value: T | T[] | undefined): T[] {
  if (Array.isArray(value)) return value
  if (value !== undefined && value !== null) return [value]
  return []
}

/**
 * Format price for display
 */
export const formatPrice = (price: number): string => {
  return `${price.toFixed(2)} JOD`
}

/**
 * Copy text to clipboard with error handling
 */
export const handleCopyInfo = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  } catch {
    toast.error("Please copy the information manually")
  }
}
