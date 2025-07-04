import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'

import type { SheetData } from '@/shared/types'

import { generateSheetData, fromSheetDataDto, toSheetDataDto } from '@/shared/utils'
import { useActiveCell } from '@/composables/useActiveCell'
import { useTableStore } from '@/stores/table'
import { useSheetsStore } from '@/stores/sheets'
import { createSheetDataStorage } from '@/db/sheetDataStorage'

export const useSheetsDataStore = defineStore('sheetsData', () => {
  const sheetsData = ref<Record<string, SheetData>>({})

  const { getActiveCell } = useActiveCell()
  const tableStore = useTableStore()
  const sheetsStore = useSheetsStore()
  const sheetDataStorage = createSheetDataStorage()

  const currentSheetData = computed(() => {
    if (!sheetsStore.currentSheetId) return
    return sheetsData.value[sheetsStore.currentSheetId]
  })

  const currentCell = computed(() => {
    if (!currentSheetData.value) return
    return currentSheetData.value.cells[getActiveCell(sheetsStore.currentSheetId)]
  })

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

  const updateCellValue = async (cellId: string, value: string): Promise<void> => {
    if (!currentSheetData.value) return

    const currentCell = currentSheetData.value.cells[cellId]
    if (!currentCell) return

    currentCell.value = value
  }

  const clear = (): void => {
    sheetsData.value = {}
  }

  return {
    currentSheetData: readonly(currentSheetData),
    currentCell: readonly(currentCell),
    createSheetData,
    getSheetsData,
    deleteSheetData,
    updateCellValue,
    clear
  }
})
