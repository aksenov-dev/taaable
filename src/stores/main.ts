import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { MainViewVariant, Settings } from '@/shared/types'
import { setHtmlDark } from '@/shared/utils'

const createDefaultSettings = (): Settings => {
  return {
    isDarkTheme: false,
    sortVariant: 'title',
    viewVariant: 'list'
  }
}

export const useMainStore = defineStore('main', () => {
  const settings = useStorage('taaable', createDefaultSettings(), localStorage, { mergeDefaults: true })

  const setDarkTheme = (value: boolean) => {
    settings.value.isDarkTheme = value
    setHtmlDark(value)
  }

  const setViewVariant = (value: MainViewVariant) => {
    settings.value.viewVariant = value
  }

  setHtmlDark(settings.value.isDarkTheme)

  return {
    settings,
    setDarkTheme,
    setViewVariant
  }
})
