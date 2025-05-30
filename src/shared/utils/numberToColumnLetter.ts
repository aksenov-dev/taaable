const ALPHABET_LENGTH = 26
const ASCII_CODE_A = 'A'.charCodeAt(0)

export const numberToColumnLetter = (num: number): string => {
  let result = ''
  num++

  while (num > 0) {
    const remainder = (num - 1) % ALPHABET_LENGTH

    result = String.fromCharCode(ASCII_CODE_A + remainder) + result
    num = Math.floor((num - 1) / ALPHABET_LENGTH)
  }

  return result
}
