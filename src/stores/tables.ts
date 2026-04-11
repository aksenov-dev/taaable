import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Table } from '@/shared/types'

import { fromTableDto, toTableDto } from '@/shared/utils'

import { createTableStorage } from '@/db/tableStorage'
import { useSettingsStore } from '@/stores/settings'

export const useTablesStore = defineStore('tables', () => {
  const tables = ref<Table[]>([])
  const isLoading = ref(false)
  const filterText = ref('')

  const settingsStore = useSettingsStore()
  const tableStorage = createTableStorage()

  const sortedTables = computed<Table[]>(() => {
    if (settingsStore.settings.sortVariant === 'title') {
      return [...tables.value].sort((a, b) => a.title.localeCompare(b.title))
    }

    return [...tables.value].sort((a, b) => b.viewedAt - a.viewedAt)
  })

  const filteredTables = computed(() => {
    return sortedTables.value.filter(t => t.title.toLowerCase().includes(filterText.value.toLowerCase()))
  })

  async function getTables(): Promise<void> {
    isLoading.value = true

    try {
      const tablesDto = await tableStorage.getAllTables()
      tables.value = tablesDto.map(fromTableDto)
    }
    catch (error) {
      console.error('Ошибка при загрузке таблиц из IndexedDB:', error)
    }
    finally {
      isLoading.value = false
    }
  }

  async function renameTable(tableId: string, value: string): Promise<void> {
    const table = tables.value.find(t => t.tableId === tableId)

    if (table) {
      table.title = value
      await tableStorage.saveTable(toTableDto(table))
    }
  }

  async function deleteTable(tableId: string): Promise<void> {
    const tableIndex = tables.value.findIndex(t => t.tableId === tableId)

    if (tableIndex === -1)
      return

    tables.value.splice(tableIndex, 1)
    await tableStorage.deleteTableById(tableId)
  }

  return {
    filterText,
    isLoading: readonly(isLoading),
    filteredTables,
    getTables,
    renameTable,
    deleteTable,
  }
})
