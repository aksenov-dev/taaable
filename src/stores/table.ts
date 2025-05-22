import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import router from '@/router'

import type { Table } from '@/shared/types'

import { useSheetStore } from '@/stores/sheet'
import { createTableStorage } from '@/db/tableStorage'
import { createTableObject } from '@/shared/utils'

export const useTableStore = defineStore('table', () => {
  const isLoading = ref(false)
  const currentTable = ref<Table | null>(null)

  const tableStorage = createTableStorage()
  const sheetStore = useSheetStore()

  const createTable = async (): Promise<void> => {
    currentTable.value = createTableObject()

    await tableStorage.saveTable(currentTable.value)
    const sheetId = await sheetStore.createSheet(currentTable.value.tableId)

    await router.push({
      name: 'Table',
      params: { tableId: currentTable.value.tableId, sheetId }
    })
  }

  const getTable = async (tableId: string, sheetId?: string): Promise<void> => {
    isLoading.value = true

    try {
      currentTable.value = await tableStorage.getTableById(tableId)
      await sheetStore.getSheets(tableId)
    } catch (error) {
      console.error('Ошибка при загрузке таблицы из IndexedDB:', error)
    } finally {
      isLoading.value = false
    }
  }

  const renameTable = async (value: string): Promise<void> => {
    if (currentTable.value) {
      currentTable.value.title = value
      await tableStorage.saveTable(currentTable.value)
    }
  }

  const deleteTable = async (): Promise<void> => {
    if (currentTable.value) {
      await tableStorage.deleteTableById(currentTable.value.tableId)
      await router.push({ name: 'Home' })
    }
  }

  const clear = () => {
    isLoading.value = false
    currentTable.value = null
    sheetStore.clear()
  }

  return {
    isLoading,
    currentTable: readonly(currentTable),
    createTable,
    getTable,
    renameTable,
    deleteTable,
    clear
  }
})
