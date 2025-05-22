import { getDB } from './database'
import { fromTableDto, toTableDto } from '@/shared/utils'
import { createSheetStorage } from '@/db/sheetStorage'

import type { Table } from '@/shared/types'

export function createTableStorage() {
  const getAllTables = async (): Promise<Table[]> => {
    const db = await getDB()
    const dtoList = await db.getAll('tables')

    return dtoList.map(fromTableDto)
  }

  const getTableById = async (tableId: string): Promise<Table | null> => {
    const db = await getDB()
    const dto = await db.get('tables', tableId)

    return dto ? fromTableDto(dto) : null
  }

  const saveTable = async (table: Table): Promise<void> => {
    const db = await getDB()
    await db.put('tables', toTableDto(table))
  }

  const deleteTableById = async (tableId: string): Promise<void> => {
    const sheetStorage = createSheetStorage()

    const db = await getDB()
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
