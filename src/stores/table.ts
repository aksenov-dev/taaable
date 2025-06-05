import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'

import router from '@/router'

import type { Table } from '@/shared/types'

import { generateTable, fromTableDto, toTableDto } from '@/shared/utils'
import { useSheetsStore } from '@/stores/sheets'
import { createTableStorage } from '@/db/tableStorage'

export const useTableStore = defineStore('table', () => {
  const isLoading = ref(false)
  const currentTable = ref<Table | null>(null)

  const tableStorage = createTableStorage()
  const sheetsStore = useSheetsStore()

  const createTable = async (): Promise<void> => {
    currentTable.value = generateTable()

    await tableStorage.saveTable(toTableDto(currentTable.value))
    await sheetsStore.createSheet()
  }

  const getTable = async (tableId: string, sheetId?: string): Promise<void> => {
    if (tableId === currentTable.value?.tableId) return

    isLoading.value = true

    try {
      const tableDto = await tableStorage.getTableById(tableId)

      if (tableDto) {
        currentTable.value = fromTableDto(tableDto)
        await sheetsStore.getSheets(sheetId)
      }
    } catch (error) {
      console.error('Ошибка при загрузке таблицы из IndexedDB:', error)
    } finally {
      isLoading.value = false
    }
  }

  const renameTable = async (value: string): Promise<void> => {
    if (!currentTable.value) return

    currentTable.value.title = value
    await tableStorage.saveTable(toTableDto(currentTable.value))
  }

  const deleteTable = async (): Promise<void> => {
    if (!currentTable.value) return

    await tableStorage.deleteTableById(currentTable.value.tableId)
    await router.push({ name: 'Home' })
  }

  const clear = (): void => {
    isLoading.value = false
    currentTable.value = null
    sheetsStore.clear()
  }

  return {
    isLoading: readonly(isLoading),
    currentTable: readonly(currentTable),
    createTable,
    getTable,
    renameTable,
    deleteTable,
    clear
  }
})
