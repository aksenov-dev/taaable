import { readonly, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'

import type { Sheet } from '@/shared/types'

import { fromSheetDto, generateSheet, toSheetDto } from '@/shared/utils'

import { createMetaStorage } from '@/db/metaStorage'
import { createSheetStorage } from '@/db/sheetStorage'
import { useSheetsDataStore } from '@/stores/sheetsData'
import { useTableStore } from '@/stores/table'

export const useSheetsStore = defineStore('sheets', () => {
  const sheets = ref<Sheet[]>([])
  const currentSheetId = ref<string | null>(null)

  const tableStore = useTableStore()
  const sheetsDataStore = useSheetsDataStore()
  const metaStorage = createMetaStorage()
  const sheetStorage = createSheetStorage()

  const router = useRouter()

  async function createSheet(): Promise<void> {
    if (!tableStore.currentTable)
      return

    const nextSheetNumber = await metaStorage.getNextSheetNumber(tableStore.currentTable.tableId)
    const sheet = generateSheet(tableStore.currentTable.tableId, sheets.value.length, nextSheetNumber)

    await metaStorage.setNextSheetNumber(tableStore.currentTable.tableId, nextSheetNumber + 1)
    await sheetStorage.saveSheet(toSheetDto(sheet))

    await sheetsDataStore.createSheetData(sheet.sheetId)

    sheets.value.push(sheet)
    currentSheetId.value = sheet.sheetId

    await goToSheet(tableStore.currentTable.tableId, currentSheetId.value)
  }

  async function getSheets(activeSheetId?: string): Promise<void> {
    if (!tableStore.currentTable)
      return

    try {
      const sheetsDto = await sheetStorage.getSheetsByTableId(tableStore.currentTable.tableId)

      sheets.value = sheetsDto.map(fromSheetDto).sort((a, b) => a.order - b.order)
      currentSheetId.value = activeSheetId || sheets.value[0].sheetId

      await sheetsDataStore.getSheetsData()
      await goToSheet(tableStore.currentTable.tableId, currentSheetId.value)
    }
    catch (error) {
      console.error('Ошибка при загрузке листов таблицы из IndexedDB:', error)
    }
  }

  async function setCurrentSheet(sheetId: string): Promise<void> {
    if (!tableStore.currentTable)
      return

    currentSheetId.value = sheetId
    await goToSheet(tableStore.currentTable.tableId, sheetId)
  }

  async function renameSheet(sheetId: string, value: string): Promise<void> {
    const sheet = sheets.value.find(s => s.sheetId === sheetId)

    if (sheet) {
      sheet.title = value
      await sheetStorage.saveSheet(toSheetDto(sheet))
    }
  }

  async function deleteSheet(sheetId: string): Promise<void> {
    const sheetIndex = sheets.value.findIndex(s => s.sheetId === sheetId)

    if (sheetIndex === -1)
      return

    sheets.value.splice(sheetIndex, 1)

    if (sheetId === currentSheetId.value) {
      const prevIndex = sheetIndex ? sheetIndex - 1 : 0
      await setCurrentSheet(sheets.value[prevIndex].sheetId)
    }

    await sheetsDataStore.deleteSheetData(sheetId)
    await sheetStorage.deleteSheetById(sheetId)
    await reorderSheets()
  }

  async function reorderSheets(): Promise<void> {
    const isOrderBroken = sheets.value.some((sheet, index) => sheet.order !== index)

    if (!isOrderBroken)
      return

    const reorderedSheets = sheets.value.map((sheet, index) => ({ ...sheet, order: index }))
    await sheetStorage.saveSheets(reorderedSheets.map(toSheetDto))

    sheets.value = reorderedSheets
  }

  async function goToSheet(tableId: string, sheetId: string): Promise<void> {
    await router.push({
      name: 'Table',
      params: { tableId, sheetId },
    })
  }

  function clear(): void {
    sheets.value = []
    currentSheetId.value = null
    sheetsDataStore.clear()
  }

  watch(() => router.currentRoute.value.params.sheetId, async (newSheetId) => {
    if (newSheetId !== currentSheetId.value && typeof newSheetId === 'string')
      await setCurrentSheet(newSheetId)
  })

  return {
    currentSheetId: readonly(currentSheetId),
    sheets: readonly(sheets),
    createSheet,
    getSheets,
    setCurrentSheet,
    renameSheet,
    deleteSheet,
    clear,
  }
})
