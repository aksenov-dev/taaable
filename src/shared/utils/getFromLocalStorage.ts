function getFromLocalStorage<T>(key: string): T | null {
  const item = localStorage.getItem(key)

  if (!item) return null

  try {
    return JSON.parse(item)
  } catch (error) {
    console.error(`Error parsing JSON from localStorage for key "${key}":`, error)
    return null
  }
}

export { getFromLocalStorage }
