import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData, SheetMeta } from '@/shared/types'

import { createSheetStorage } from '@/db/sheetStorage'
import { createSheetObject } from '@/shared/utils'

export const useSheetStore = defineStore('sheet', () => {
  const sheetsMeta = ref<SheetMeta[]>([])
  const sheetsData = ref<Record<string, SheetData>>({})

  const sheetStorage = createSheetStorage()

  const createSheet = async (tableId: string, order: number = 0): Promise<string> => {
    const sheet = createSheetObject(tableId, order)
    await sheetStorage.saveSheet(sheet)

    return sheet.sheetId
  }

  const getSheets = async (tableId: string) => {
    try {
      const sheets = await sheetStorage.getSheetsByTableId(tableId)
    } catch (error) {
      console.error('Ошибка при загрузке листов таблицы из IndexedDB:', error)
    }
  }

  const clear = () => {}

  return {
    createSheet,
    getSheets,
    clear
  }
})
