import { getDB } from './database'
import { fromSheetDto, toSheetDto } from '@/shared/utils'

import type { Sheet } from '@/shared/types'

export function createSheetStorage() {
  const getSheetsByTableId = async (tableId: string): Promise<Sheet[]> => {
    const db = await getDB()
    const dtoList = await db.getAllFromIndex('sheets', 'byTableId', tableId)

    return dtoList.map(fromSheetDto)
  }

  const saveSheet = async (sheet: Sheet): Promise<void> => {
    const db = await getDB()
    await db.put('sheets', toSheetDto(sheet))
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

    const sheetIdKeys = await index.getAllKeys(tableId)

    for (const sheetId of sheetIdKeys) {
      await store.delete(sheetId)
    }

    await tx.done
  }

  return {
    getSheetsByTableId,
    saveSheet,
    deleteSheetById,
    deleteSheetsByTableId
  }
}
