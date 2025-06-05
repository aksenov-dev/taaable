import { readonly } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { MainSortVariant, MainViewVariant } from '@/shared/types'

import { createDefaultSettings, setHtmlDark } from '@/shared/utils'

export const useSettingsStore = defineStore('settings', () => {
  const settings = useStorage('taaable', createDefaultSettings(), localStorage, { mergeDefaults: true })

  const setDarkTheme = (value: boolean): void => {
    settings.value.isDarkTheme = value
    setHtmlDark(value)
  }

  const setSortVariant = (value: MainSortVariant): void => {
    settings.value.sortVariant = value
  }

  const setViewVariant = (value: MainViewVariant): void => {
    settings.value.viewVariant = value
  }

  setHtmlDark(settings.value.isDarkTheme)

  return {
    settings: readonly(settings),
    setDarkTheme,
    setSortVariant,
    setViewVariant
  }
})
