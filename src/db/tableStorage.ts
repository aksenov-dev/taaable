import type { TableDto } from '@/shared/types'

import { createMetaStorage } from '@/db/metaStorage'
import { createSheetDataStorage } from '@/db/sheetDataStorage'
import { createSheetStorage } from '@/db/sheetStorage'

import { getDB } from './database'

export function createTableStorage() {
  const metaStorage = createMetaStorage()
  const sheetStorage = createSheetStorage()
  const sheetDataStorage = createSheetDataStorage()

  async function getAllTables(): Promise<TableDto[]> {
    const db = await getDB()
    return await db.getAll('tables')
  }

  async function getTableById(tableId: string): Promise<TableDto | null> {
    const db = await getDB()
    return await db.get('tables', tableId) ?? null
  }

  async function saveTable(table: TableDto): Promise<void> {
    const db = await getDB()
    await db.put('tables', table)
  }

  async function deleteTableById(tableId: string): Promise<void> {
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
    deleteTableById,
  }
}
