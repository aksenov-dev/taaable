import type { SheetDto } from '@/shared/types'

import { getDB } from './database'

export const createSheetStorage = () => {
  const getSheetsByTableId = async (tableId: string): Promise<SheetDto[]> => {
    const db = await getDB()
    return await db.getAllFromIndex('sheets', 'byTableId', tableId)
  }

  const saveSheet = async (sheet: SheetDto): Promise<void> => {
    const db = await getDB()
    await db.put('sheets', sheet)
  }

  const saveSheets = async (sheets: SheetDto[]): Promise<void> => {
    const db = await getDB()

    const tx = db.transaction('sheets', 'readwrite')
    const store = tx.objectStore('sheets')

    await Promise.all(sheets.map(sheet => store.put(sheet)))

    await tx.done
  }

  const deleteSheetById = async (sheetId: string): Promise<void> => {
    const db = await getDB()
    await db.delete('sheets', sheetId)
  }

  const deleteSheetsByTableId = async (tableId: string): Promise<void> => {
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
    deleteSheetsByTableId
  }
}
