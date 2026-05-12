import type { Settings } from '@/shared/types'

export function createDefaultSettings(): Settings {
  return {
    isDarkTheme: false,
    sortVariant: 'title-asc',
    viewVariant: 'list',
  }
}
