import { ref } from 'vue'
import { defineStore } from 'pinia'

import { generateSheetData } from '@/shared/utils'
import type { SheetData } from '@/shared/types'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const createSheetData = async (sheetId: string): Promise<void> => {
    const sheetData = generateSheetData(sheetId)

    sheetsData.value[sheetId] = sheetData
  }

  const clear = (): void => {
    sheetsData.value = {}
  }

  return {
    createSheetData,
    clear
  }
})
