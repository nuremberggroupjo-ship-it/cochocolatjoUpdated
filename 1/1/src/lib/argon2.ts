import { type Options, hash, verify } from "@node-rs/argon2"

// memoryCost: The amount of memory to use, in kibibytes (KiB).
// timeCost: The number of iterations to perform.
// outputLen: The length of the output hash in bytes.
// parallelism: The number of parallel threads to use.
const options: Options = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
}

export async function hashPassword(password: string): Promise<string> {
  const result = await hash(password, options)
  return result
}

export async function verifyPassword(data: {
  password: string
  hash: string
}): Promise<boolean> {
  const { password, hash } = data

  const result = await verify(hash, password, options)
  return result
}
