import {
  DEFAULT_SERVER_ERROR_MESSAGE,
  createSafeActionClient,
} from "next-safe-action"
import { z } from "zod"

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({ actionName: z.string() })
  },

  handleServerError(e) {
    // Log to console.
    console.error("Action error:", e.message)

    // Every other error that occurs will be masked with the default message.
    return e.message || DEFAULT_SERVER_ERROR_MESSAGE
  },
})
