import type { Settings } from '@/shared/types'

export const createDefaultSettings = (): Settings => {
  return {
    isDarkTheme: false,
    sortVariant: 'title',
    viewVariant: 'list'
  }
}
