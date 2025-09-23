import { type Options, hash as argon2Hash, verify as argon2Verify } from "@node-rs/argon2"

const options: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

// Canonical hash function (plain -> hash)
export async function hashPassword(password: string): Promise<string> {
  return argon2Hash(password, options)
}

// Overloads allow BOTH signatures for internal convenience
export function verifyPassword(hash: string, password: string): Promise<boolean>
export function verifyPassword(data: { hash: string; password: string }): Promise<boolean>
export async function verifyPassword(a: any, b?: any): Promise<boolean> {
  if (typeof a === "string" && typeof b === "string") {
    // (hash, password)
    return argon2Verify(a, b, options)
  }
  if (typeof a === "object" && a?.hash && a?.password) {
    return argon2Verify(a.hash, a.password, options)
  }
  throw new Error("Invalid arguments passed to verifyPassword")
}

/**
 * Adapter specifically shaped for BetterAuth (data object form).
 * (You could pass verifyPassword directly since overload includes object form,
 * but separating makes intent explicit and avoids inference edge cases.)
 */
export const verifyPasswordObject = (data: { hash: string; password: string }) =>
  verifyPassword(data)