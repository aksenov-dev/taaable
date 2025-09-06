import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData } from '@/shared/types'

import { generateSheetData, fromSheetDataDto, toSheetDataDto } from '@/shared/utils'
import { useTableStore } from '@/stores/table'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataRowsStore } from '@/stores/sheetsData/rows'
import { useSheetsDataColumnsStore } from '@/stores/sheetsData/columns'
import { createSheetDataStorage } from '@/db/sheetDataStorage'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const tableStore = useTableStore()
  const sheetsStore = useSheetsStore()
  const sheetsDataRowsStore = useSheetsDataRowsStore()
  const sheetsDataColumnsStore = useSheetsDataColumnsStore()
  const sheetDataStorage = createSheetDataStorage()

  const currentSheetData = computed(() => {
    if (!sheetsStore.currentSheetId) return
    return sheetsData.value[sheetsStore.currentSheetId]
  })

  const createSheetData = async (sheetId: string): Promise<void> => {
    const sheetData = generateSheetData(sheetId)

    sheetsData.value[sheetId] = sheetData
    sheetsDataRowsStore.calculateRowsOffsets(sheetId)
    sheetsDataColumnsStore.calculateColumnsOffsets(sheetId)

    await sheetDataStorage.saveSheetData(toSheetDataDto(sheetId, sheetData))
  }

  const getSheetsData = async (): Promise<void> => {
    if (!tableStore.currentTable) return

    try {
      const sheetDataDtos = await sheetDataStorage.getSheetsDataByTableId(tableStore.currentTable.tableId)

      for (const sheetDataDto of sheetDataDtos) {
        sheetsData.value[sheetDataDto.sheetId] = fromSheetDataDto(sheetDataDto)
        sheetsDataRowsStore.calculateRowsOffsets(sheetDataDto.sheetId)
        sheetsDataColumnsStore.calculateColumnsOffsets(sheetDataDto.sheetId)
      }
    } catch (error) {
      console.error('Ошибка при загрузке данных таблицы из IndexedDB:', error)
    }
  }

  const getSheetDataById = (sheetId: string): SheetData | null => {
    return sheetsData.value[sheetId] ?? null
  }

  const deleteSheetData = async (sheetId: string): Promise<void> => {
    await sheetDataStorage.deleteSheetDataBySheetId(sheetId)
    delete sheetsData.value[sheetId]
  }

  const clear = (): void => {
    sheetsData.value = {}
  }

  return {
    currentSheetData,
    createSheetData,
    getSheetsData,
    getSheetDataById,
    deleteSheetData,
    clear
  }
})
