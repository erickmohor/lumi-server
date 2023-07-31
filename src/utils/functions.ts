export function splitEmptySpaces(value: string) {
  return value.split(/(?:,| )+/)
}

export function removeEmptySpaces(value: string) {
  return value.replace(/\s/g, '')
}