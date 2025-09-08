"use client"

import { useEffect, useState } from "react"

/**
 * A hook that returns whether the component is mounted on the client side.
 * Useful for preventing hydration errors with libraries that rely on browser APIs.
 *
 * @returns {boolean} Whether the component is mounted on the client
 */
export function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)

    return () => {
      setIsMounted(false)
    }
  }, [])

  return isMounted
}
