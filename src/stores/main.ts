import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { Settings } from '@/shared/types'
import { setHtmlDark } from '@/shared/utils'

const createDefaultSettings = (): Settings => {
  return {
    isDarkTheme: false
  }
}

export const useMainStore = defineStore('main', () => {
  const settings = useStorage('taaable', createDefaultSettings(), localStorage, { mergeDefaults: true })

  const setDarkTheme = (value: boolean) => {
    settings.value.isDarkTheme = value
    setHtmlDark(value)
  }

  setHtmlDark(settings.value.isDarkTheme)

  return {
    settings,
    setDarkTheme
  }
})
