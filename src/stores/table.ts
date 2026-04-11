import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import type { Table } from '@/shared/types'

import { fromTableDto, generateTable, toTableDto } from '@/shared/utils'

import { createTableStorage } from '@/db/tableStorage'
import { useSheetsStore } from '@/stores/sheets'

export const useTableStore = defineStore('table', () => {
  const isLoading = ref(false)
  const currentTable = ref<Table | null>(null)

  const router = useRouter()
  const tableStorage = createTableStorage()
  const sheetsStore = useSheetsStore()

  async function createTable(): Promise<void> {
    currentTable.value = generateTable()

    await tableStorage.saveTable(toTableDto(currentTable.value))
    await sheetsStore.createSheet()
  }

  async function getTable(tableId: string, sheetId?: string): Promise<void> {
    if (tableId === currentTable.value?.tableId)
      return

    isLoading.value = true

    try {
      const tableDto = await tableStorage.getTableById(tableId)

      if (tableDto) {
        currentTable.value = fromTableDto(tableDto)
        await sheetsStore.getSheets(sheetId)
      }
    }
    catch (error) {
      console.error('Ошибка при загрузке таблицы из IndexedDB:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  async function renameTable(value: string): Promise<void> {
    if (!currentTable.value)
      return

    currentTable.value.title = value
    await tableStorage.saveTable(toTableDto(currentTable.value))
  }

  async function deleteTable(): Promise<void> {
    if (!currentTable.value)
      return

    await tableStorage.deleteTableById(currentTable.value.tableId)
    await router.push({ name: 'Home' })
  }

  function clear(): void {
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
    clear,
  }
})
