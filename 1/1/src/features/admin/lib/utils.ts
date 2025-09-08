/**
 * Helper function to extract file keys from UploadThing URLs
 */
export function extractFileKeyFromUrl(url: string): string {
  // Extract the file key from URLs like: https://utfs.io/f/abc123.jpg
  const parts = url.split("/f/")
  return parts[1] || url
}
