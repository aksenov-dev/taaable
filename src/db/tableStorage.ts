import type { TableDto } from '@/shared/types'

import { getDB } from './database'
import { createMetaStorage } from '@/db/metaStorage'
import { createSheetStorage } from '@/db/sheetStorage'
import { createSheetDataStorage } from '@/db/sheetDataStorage'

export const createTableStorage = () => {
  const metaStorage = createMetaStorage()
  const sheetStorage = createSheetStorage()
  const sheetDataStorage = createSheetDataStorage()

  const getAllTables = async (): Promise<TableDto[]> => {
    const db = await getDB()
    return await db.getAll('tables')
  }

  const getTableById = async (tableId: string): Promise<TableDto | null> => {
    const db = await getDB()
    return await db.get('tables', tableId) ?? null
  }

  const saveTable = async (table: TableDto): Promise<void> => {
    const db = await getDB()
    await db.put('tables', table)
  }

  const deleteTableById = async (tableId: string): Promise<void> => {
    const db = await getDB()

    await metaStorage.deleteNextSheetId(tableId)
    await sheetDataStorage.deleteSheetsDataByTableId(tableId)
    await sheetStorage.deleteSheetsByTableId(tableId)
    await db.delete('tables', tableId)
  }

  return {
    getAllTables,
    getTableById,
    saveTable,
    deleteTableById
  }
}
