import type { SheetDto } from '@/shared/types'

import { getDB } from './database'

export function createSheetStorage() {
  async function getSheetsByTableId(tableId: string): Promise<SheetDto[]> {
    const db = await getDB()
    return await db.getAllFromIndex('sheets', 'byTableId', tableId)
  }

  async function saveSheet(sheet: SheetDto): Promise<void> {
    const db = await getDB()
    await db.put('sheets', sheet)
  }

  async function saveSheets(sheets: SheetDto[]): Promise<void> {
    const db = await getDB()

    const tx = db.transaction('sheets', 'readwrite')
    const store = tx.objectStore('sheets')

    await Promise.all(sheets.map(sheet => store.put(sheet)))

    await tx.done
  }

  async function deleteSheetById(sheetId: string): Promise<void> {
    const db = await getDB()
    await db.delete('sheets', sheetId)
  }

  async function deleteSheetsByTableId(tableId: string): Promise<void> {
    const db = await getDB()

    const tx = db.transaction('sheets', 'readwrite')
    const store = tx.objectStore('sheets')
    const index = store.index('byTableId')

    const sheetIds = await index.getAllKeys(tableId)

    await Promise.all(sheetIds.map(sheetId => store.delete(sheetId)))

    await tx.done
  }

  return {
    getSheetsByTableId,
    saveSheet,
    saveSheets,
    deleteSheetById,
    deleteSheetsByTableId,
  }
}
