import { readonly } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

import type { MainSortVariant, MainViewVariant, Settings } from '@/shared/types'
import { setHtmlDark } from '@/shared/utils'

const createDefaultSettings = (): Settings => {
  return {
    isDarkTheme: false,
    sortVariant: 'title',
    viewVariant: 'list'
  }
}

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
