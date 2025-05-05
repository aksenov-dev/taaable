import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import type { Table, TablePreview } from '@/shared/types'
import { getFromLocalStorage, getKeysFromLocalStorage } from '@/shared/utils'
import { useSettingsStore } from '@/stores/settings'

const createTablePreview = (table: Table): TablePreview => ({
  tableId: table.tableId,
  title: table.title,
  viewedAt: table.viewedAt
})

const getTablesFromStorage = () => {
  const keys = getKeysFromLocalStorage('taaableID')

  return keys.reduce((acc: TablePreview[], key) => {
    const table = getFromLocalStorage<Table>(key)
    return table ? acc.concat(createTablePreview(table)) : acc
  }, [])
}

export const useTableListStore = defineStore('tableList', () => {
  const settingsStore = useSettingsStore()

  const tableList = ref(getTablesFromStorage())
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

  const renameTable = (tableId: string, value: string) => {
    const table = tableList.value.find(t => t.tableId === tableId)

    if (table) {
      table.title = value

      // ToDo: Логика переименования в localStorage
    }
  }

  const removeTable = (tableId: string) => {
    const tableIndex = tableList.value.findIndex(t => t.tableId === tableId)

    if (tableIndex !== -1) {
      tableList.value.splice(tableIndex, 1)
    }

    // ToDo: Логика удаления в localStorage
  }

  return {
    filterText,
    filteredTableList,
    renameTable,
    removeTable
  }
})
