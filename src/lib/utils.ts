const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
const CODE_LENGTH = 7

export function generateShortCode(): string {
  let result = ""
  for (let i = 0; i < CODE_LENGTH; i++) {
    result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length))
  }
  return result
}
