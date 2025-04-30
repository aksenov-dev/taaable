export const getKeysFromLocalStorage = (startsWith: string = ''): string[] => {
  const keys = []

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)

    if (key && key.startsWith(startsWith)) {
      keys.push(key)
    }
  }

  return keys
}
