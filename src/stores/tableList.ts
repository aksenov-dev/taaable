import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Table } from '@/shared/types'

import { useSettingsStore } from '@/stores/settings'
import { createTableStorage } from '@/db/tableStorage'

export const useTableListStore = defineStore('tableList', () => {
  const settingsStore = useSettingsStore()
  const tableStorage = createTableStorage()

  const tableList = ref<Table[]>([])
  const isLoading = ref(false)
  const filterText = ref('')

  const sortedTableList = computed(() => {
    if (settingsStore.settings.sortVariant === 'title') {
      return [...tableList.value].sort((a, b) => a.title.localeCompare(b.title))
    }

    return [...tableList.value].sort((a, b) => b.viewedAt - a.viewedAt)
  })

  const filteredTableList = computed(() => {
    return sortedTableList.value.filter(t => t.title.toLowerCase().includes(filterText.value.toLowerCase()))
  })

  const getTables = async () => {
    isLoading.value = true

    try {
      tableList.value = await tableStorage.getAllTables()
    } catch (error) {
      console.error('Ошибка при загрузке таблиц из IndexedDB:', error)
    } finally {
      isLoading.value = false
    }
  }

  const renameTable = async (tableId: string, value: string): Promise<void> => {
    const table = tableList.value.find(t => t.tableId === tableId)

    if (table) {
      table.title = value
      await tableStorage.saveTable(table)
    }
  }

  const deleteTable = async (tableId: string): Promise<void> => {
    const tableIndex = tableList.value.findIndex(t => t.tableId === tableId)

    if (tableIndex !== -1) {
      tableList.value.splice(tableIndex, 1)
      await tableStorage.deleteTableById(tableId)
    }
  }

  return {
    filterText,
    isLoading,
    filteredTableList,
    getTables,
    renameTable,
    deleteTable
  }
})
