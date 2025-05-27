import { getDB } from './database'

export function createMetaStorage() {
  const getNextSheetNumber = async (tableId: string): Promise<number> => {
    const db = await getDB()
    const value = await db.get('meta', `nextSheetId:${tableId}`)

    return typeof value === 'number' ? value : 1
  }

  const setNextSheetNumber = async (tableId: string, nextSheetNumber: number): Promise<void> => {
    const db = await getDB()
    await db.put('meta', nextSheetNumber, `nextSheetId:${tableId}`)
  }

  const deleteNextSheetId = async (tableId: string): Promise<void> => {
    const db = await getDB()
    await db.delete('meta', `nextSheetId:${tableId}`)
  }

  return {
    getNextSheetNumber,
    setNextSheetNumber,
    deleteNextSheetId
  }
}
