import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData } from '@/shared/types'

import { fromSheetDataDto, generateSheetData, toSheetDataDto } from '@/shared/utils'

import { createSheetDataStorage } from '@/db/sheetDataStorage'
import { useSheetsStore } from '@/stores/sheets'
import { useSheetsDataColumnsStore } from '@/stores/sheetsData/columns'
import { useSheetsDataRowsStore } from '@/stores/sheetsData/rows'
import { useTableStore } from '@/stores/table'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const tableStore = useTableStore()
  const sheetsStore = useSheetsStore()
  const sheetsDataRowsStore = useSheetsDataRowsStore()
  const sheetsDataColumnsStore = useSheetsDataColumnsStore()
  const sheetDataStorage = createSheetDataStorage()

  const currentSheetData = computed(() => {
    if (!sheetsStore.currentSheetId)
      return

    return sheetsData.value[sheetsStore.currentSheetId]
  })

  async function createSheetData(sheetId: string): Promise<void> {
    const sheetData = generateSheetData(sheetId)

    sheetsData.value[sheetId] = sheetData
    sheetsDataRowsStore.calculateRowsOffsets(sheetId)
    sheetsDataColumnsStore.calculateColumnsOffsets(sheetId)

    await sheetDataStorage.saveSheetData(toSheetDataDto(sheetId, sheetData))
  }

  async function getSheetsData(): Promise<void> {
    if (!tableStore.currentTable)
      return

    try {
      const sheetDataDtos = await sheetDataStorage.getSheetsDataByTableId(tableStore.currentTable.tableId)

      for (const sheetDataDto of sheetDataDtos) {
        sheetsData.value[sheetDataDto.sheetId] = fromSheetDataDto(sheetDataDto)
        sheetsDataRowsStore.calculateRowsOffsets(sheetDataDto.sheetId)
        sheetsDataColumnsStore.calculateColumnsOffsets(sheetDataDto.sheetId)
      }
    }
    catch (error) {
      console.error('Ошибка при загрузке данных таблицы из IndexedDB:', error)
    }
  }

  function getSheetDataById(sheetId: string): SheetData | null {
    return sheetsData.value[sheetId] ?? null
  }

  async function deleteSheetData(sheetId: string): Promise<void> {
    await sheetDataStorage.deleteSheetDataBySheetId(sheetId)
    delete sheetsData.value[sheetId]
  }

  function clear(): void {
    sheetsData.value = {}
  }

  return {
    currentSheetData,
    createSheetData,
    getSheetsData,
    getSheetDataById,
    deleteSheetData,
    clear,
  }
})
