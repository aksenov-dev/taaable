import { ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData } from '@/shared/types'

import { generateSheetData, fromSheetDataDto, toSheetDataDto } from '@/shared/utils'
import { useTableStore } from '@/stores/table'
import { createSheetDataStorage } from '@/db/sheetDataStorage'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const tableStore = useTableStore()
  const sheetDataStorage = createSheetDataStorage()

  const createSheetData = async (sheetId: string): Promise<void> => {
    const sheetData = generateSheetData(sheetId)

    sheetsData.value[sheetId] = sheetData
    await sheetDataStorage.saveSheetData(toSheetDataDto(sheetId, sheetData))
  }

  const getSheetsData = async (): Promise<void> => {
    if (!tableStore.currentTable) return

    try {
      const sheetDataDtos = await sheetDataStorage.getSheetsDataByTableId(tableStore.currentTable.tableId)

      for (const sheetDataDto of sheetDataDtos) {
        sheetsData.value[sheetDataDto.sheetId] = fromSheetDataDto(sheetDataDto)
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных таблицы из IndexedDB:', error)
    }
  }

  const deleteSheetData = async (sheetId: string): Promise<void> => {
    await sheetDataStorage.deleteSheetDataBySheetId(sheetId)
    delete sheetsData.value[sheetId]
  }

  const clear = (): void => {
    sheetsData.value = {}
  }

  return {
    createSheetData,
    getSheetsData,
    deleteSheetData,
    clear
  }
})
